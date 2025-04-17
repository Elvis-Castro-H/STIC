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

        url = f"http://localhost:5195/api/gear/quote/{num_dientes}/{diametro_interior}/{diametro_exterior}"
        print(url)

        precio = 0
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            precio = data.get("price")
            print("Precio:", precio)
        else:
            print("Error:", response.status_code, response.text)

        dispatcher.utter_message(response="utter_cotizacion_enviada", precio=precio)
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
        url = f"http://localhost:5195/api/vehicles/price/{marca.strip()}/{modelo}/{anio}"

        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            precio = data.get("price")
            print("Precio:", precio)
        else:
            print("Error:", response.status_code, response.text)

        dispatcher.utter_message(response="utter_cotizacion_enviada", precio=precio)
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
                "parts": [{"text": f"Eres un asistente inteligente conversacional de la empresa STIC, especializada en la fabricación de componentes mecánicos industriales como poleas, engranajes y separadores de aro para vehículos. Tu función principal es asistir a los clientes brindando respuestas precisas, cotizaciones preliminares automáticas y soporte técnico básico, todo de forma inmediata y clara. También debes recopilar datos necesarios para escalar consultas más complejas a atención humana. Responde siempre en un tono profesional, cordial y orientado a resolver eficientemente la necesidad del cliente. El cliente dice: {user_message}"}]
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
