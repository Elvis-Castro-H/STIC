from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import requests
import os
from dotenv import load_dotenv

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

        marca = tracker.get_slot('marca')
        modelo = tracker.get_slot('modelo')
        anio = tracker.get_slot('anio')

        pulgadas = 1.5
        material = "Aluminio"

        payload = {
            "make": marca,
            "model": modelo,
            "year": int(anio),
            "inches": pulgadas,
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
                f"- Marca: {marca.title()}\n"
                f"- Modelo: {modelo.title()}\n"
                f"- Año: {anio}\n"
                f"- Espesor: {pulgadas}\" pulgadas\n"
                f"- Material: {material}\n\n"
                f"El precio estimado es de **BOB {precio:.2f}** por juego."
            )
            dispatcher.utter_message(text=mensaje)
        except Exception as e:
            print(f"Error al cotizar separador: {e}")
            dispatcher.utter_message(text="Lo siento, ocurrió un error al obtener la cotización del separador.")
        return []

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
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"

        headers = {"Content-Type": "application/json"}
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
