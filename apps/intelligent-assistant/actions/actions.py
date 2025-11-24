from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import requests
import os
from dotenv import load_dotenv
from rasa_sdk.events import SlotSet, FollowupAction, UserUtteranceReverted

import json

load_dotenv()

class ActionProcesarCotizacionEngranaje(Action):
    def name(self) -> Text:
        return "action_procesar_cotizacion_engranaje"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        num_dientes = tracker.get_slot('num_dientes')
        diametro_exterior = tracker.get_slot('diametro_exterior')
        diametro_interior = tracker.get_slot('diametro_interior')

        module = 1.5
        pitch_diameter = 0
        width = 15
        tooth_height = 5
        gear_type = "Spur"
        material = "Aluminio"

        payload = {
            "toothCount": int(num_dientes),
            "module": module,
            "pitchDiameter": pitch_diameter,
            "outerDiameter": float(diametro_exterior),
            "width": float(width),
            "toothHeight": float(tooth_height),
            "gearType": gear_type.lower(),
            "material": material
        }

        url = "http://localhost:5267/api/quotation/Gear/calculate-price"
        headers = {
            "accept": "text/plain",
            "Content-Type": "application/json"
        }

        try:
            response = requests.post(url, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            precio = round(data.get("price", 0), 2)

            mensaje = (
                f"He procesado la cotización para un engranaje con las siguientes características:\n"
                f"- Número de dientes: {num_dientes}\n"
                f"- Diámetro exterior: {diametro_exterior} mm\n"
                f"- Diámetro interior: {diametro_interior} mm\n"
                f"- Tipo: {gear_type}\n"
                f"- Material: {material}\n"
                f"- Espesor: {width} mm\n\n"
                f"El precio estimado de fabricación es de **BOB {precio:.2f}**."
            )
            dispatcher.utter_message(text=mensaje)
        except Exception as e:
            print(f"Error al cotizar engranaje: {e}")
            dispatcher.utter_message(text="Lo siento, hubo un error al obtener la cotización del engranaje.")
        return []

class ActionProcesarCotizacionSeparador(Action):
    def name(self) -> Text:
        return "action_procesar_cotizacion_separador"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        prev_brand = None
        prev_model = None
        prev_year = None
        prev_thickness = None
        prev_material = None
        
        brand = tracker.get_slot("marca")
        model = tracker.get_slot("modelo")
        year = tracker.get_slot("anio")
        thickness = tracker.get_slot("espesor")
        material = tracker.get_slot("material")
        
        api_key = os.getenv("GEMINI_API_KEY")
        gemini_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
        headers = {
            "x-goog-api-key": api_key,
            "Content-Type": "application/json"
        }

        itr = 0

        while True:
            itr += 1
            user_message = tracker.latest_message.get('text')

            prompt = f"""
            El usuario ha dicho: {user_message}.
            Extrae la siguiente información en formato JSON con las claves:
            "brand", "model", "year", "thickness", "material". 
            considera que para brand, model y material usar el formato Abcd, la primera letra en mayúscula y el resto en minúscula.           
            para year usar el formato YYYY, para thickness usar el formato X.0 (donde X es un número entero) y debe ser en pulgadas, si recibes en otra unidad lo transformas y lo pasas en pulgadas con solo un decimal
            si solo proporciona el modelo y eres capaz de deducir la marca, dame también la marca.
            por el momento los unicos materiales disponibles son Aluminio, Acero 1010, considera eso al enviarme como json y enviame con ese nombre
            si el usuario no pone algun dato, entonces esos campos quedaran como nulos
            """

            try:
                payload = {
                    "contents": [{
                        "parts": [{"text": prompt}]
                    }],
                    "generationConfig": {
                        "responseMimeType": "application/json"
                    }
                }
                
                response = requests.post(gemini_url, headers=headers, json=payload)
                response.raise_for_status()

                response_data = response.json()
                gemini_response = response_data["candidates"][0]["content"]["parts"][0]["text"]
                data = json.loads(gemini_response)

                print(data)

                prev_brand = data[0].get("brand") if data[0].get("brand") else prev_brand
                prev_model = data[0].get("model") if data[0].get("model") else prev_model
                prev_year = data[0].get("year") if data[0].get("year") else prev_year
                prev_thickness = data[0].get("thickness") if data[0].get("thickness") else prev_thickness
                prev_material = data[0].get("material") if data[0].get("material") else prev_material

            except Exception as e:
                gemini_response = "Hubo un error procesando tu información. Intenta de nuevo."

            if not brand and prev_brand:
                brand = prev_brand
            if not model and prev_model != "0": 
                model = prev_model
            if not year and prev_year:
                year = prev_year
            if not thickness and prev_thickness:
                thickness = prev_thickness
            if not material and prev_material:
                material = prev_material                

            missing_fields = []
            if not brand:
                missing_fields.append("brand")
            if not model:
                missing_fields.append("model")
            if not year:
                missing_fields.append("year")
            if not thickness:
                missing_fields.append("thickness")
            if not material:
                missing_fields.append("material")

            if missing_fields:
                missing_fields_text = ", ".join(missing_fields)
                request_prompt = f"Dame una pregunta en formato JSON con la clave question, para este enunciado: El usuario ha proporcionado una información parcial para cotizar separadores de aro. Faltan los siguientes datos: {missing_fields_text}. Por favor, genera una pregunta para pedir esa información faltante de manera natural y fluida."                             

                payload_question = {
                    "contents": [{
                        "parts": [{"text": request_prompt}]
                    }],
                    "generationConfig": {
                        "responseMimeType": "application/json"
                    }
                }
                
                response = requests.post(gemini_url, headers=headers, json=payload_question)
                response.raise_for_status()
                response_data = response.json()
                question_to_ask = response_data["candidates"][0]["content"]["parts"][0]["text"]
                print(question_to_ask)
                data_question = json.loads(question_to_ask)
                print(data_question)
                question = data_question.get("question") if data_question.get("question") else "no"
                dispatcher.utter_message(text=question)

                return [FollowupAction("action_listen"),             
                        SlotSet("marca", brand),
                        SlotSet("modelo", model),
                        SlotSet("anio", year),
                        SlotSet("espesor", thickness),
                        SlotSet("material", material),
                        ]  
            else:
                break  

        dispatcher.utter_message(text=f"Gracias, toda tu información ha sido procesada correctamente. Marca: {brand}, Modelo: {model}, Año: {year}, Espesor: {thickness}, Material: {material}")

        payload = {
            "make": brand,
            "model": model,
            "year": int(year),
            "inches": thickness,
            "material": material
        }

        url = "http://localhost:5267/api/quotation/Spacer/calculate-price"
        headers = {
            "accept": "text/plain",
            "Content-Type": "application/json"
        }

        try:
            response = requests.post(url, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            precio = round(data.get("price", 0), 2)

            mensaje = (
                f"He generado una cotización para separadores de aro para su vehículo:\n"
                f"- Marca: {brand.title()}\n"
                f"- Modelo: {model.title()}\n"
                f"- Año: {year}\n"
                f"- Espesor: {thickness}\" pulgadas\n"
                f"- Material: {material}\n\n"
                f"El precio estimado es de **BOB {precio:.2f}** por juego."
            )
            dispatcher.utter_message(text=mensaje)
        except Exception as e:
            print(f"Error al cotizar separador: {e}")
            dispatcher.utter_message(text="Lo siento, ocurrió un error al obtener la cotización del separador.")
        return [SlotSet("marca", ""),
                SlotSet("modelo", ""),
                SlotSet("anio", ""),
                SlotSet("espesor", ""),
                SlotSet("material", ""),]
        
class ActionProcesarCotizacionPolea(Action):
    def name(self) -> Text:
        return "action_procesar_cotizacion_polea"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        diametro_exterior = tracker.get_slot('diametro_exterior')
        diametro_hueco_interior = tracker.get_slot('diametro_hueco_interior')
        numero_canales = tracker.get_slot('numero_canales')
        tipo_de_canal = tracker.get_slot('tipo_de_canal')

        material = "Aluminio"
        width = 20

        payload = {
            "material": material,
            "outerDiameter": float(diametro_exterior),
            "innerBoreDiameter": float(diametro_hueco_interior),
            "width": float(width),
            "grooveCount": int(numero_canales),
            "grooveType": tipo_de_canal.upper()
        }

        url = "http://localhost:5267/api/quotation/Pulley/calculate-price"
        headers = {
            "accept": "text/plain",
            "Content-Type": "application/json"
        }

        try:
            response = requests.post(url, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            precio = round(data.get("price", 0), 2)

            mensaje = (
                f"La cotización para su polea es la siguiente:\n"
                f"- Diámetro exterior: {diametro_exterior} mm\n"
                f"- Diámetro del eje: {diametro_hueco_interior} mm\n"
                f"- Número de canales: {numero_canales}\n"
                f"- Tipo de canal: {tipo_de_canal.upper()}\n"
                f"- Espesor: {width} mm\n"
                f"- Material: {material}\n\n"
                f"El precio estimado es de **BOB {precio:.2f}**."
            )
            dispatcher.utter_message(text=mensaje)
        except Exception as e:
            print(f"Error al cotizar polea: {e}")
            dispatcher.utter_message(text="Lo siento, ocurrió un error al obtener la cotización de la polea.")
        return []

class ActionQueryGemini(Action):
    def name(self) -> Text:
        return "action_query_gemini"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        user_message = tracker.latest_message.get('text')
        api_key = os.getenv("GEMINI_API_KEY")
        url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

        headers = {
            "x-goog-api-key": api_key,
            "Content-Type": "application/json"
        }
        payload = {
            "contents": [{
                "parts": [{
                    "text": (
                        f"Eres un asistente inteligente conversacional de la empresa STIC, especializada en la fabricación "
                        f"de componentes mecánicos industriales como poleas, engranajes y separadores de aro para vehículos. "
                        f"Tu función principal es asistir a los clientes brindando respuestas precisas, cotizaciones preliminares "
                        f"automáticas y soporte técnico básico, todo de forma inmediata y clara. También debes recopilar datos "
                        f"necesarios para escalar consultas más complejas a atención humana. El cliente dice: {user_message}"
                    )
                }]
            }]
        }

        try:
            response = requests.post(url, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            reply = data["candidates"][0]["content"]["parts"][0]["text"]
            dispatcher.utter_message(text=reply)
        except Exception as e:
            print(f"Error consultando a Gemini: {e}")
            dispatcher.utter_message(text="Lo siento, no entendí eso y no pude obtener una respuesta de la IA.")
        return []
