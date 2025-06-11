FROM rasa/rasa-sdk:3.6.0

WORKDIR /app

# Copia solo el paquete de acciones
COPY actions /app/actions
COPY requirements.txt /app/

USER root
RUN pip install --no-cache-dir -r requirements.txt || true

EXPOSE 5055

CMD ["rasa", "run", "actions", "--actions", "actions.actions", "--port", "5055", "--debug"]
