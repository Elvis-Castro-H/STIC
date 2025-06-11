FROM rasa/rasa-sdk:3.6.0

WORKDIR /app

# Copia solo el paquete de acciones
COPY . /app/actions

USER root
RUN pip install --no-cache-dir -r /actions/requirements.txt || true

EXPOSE 5055

CMD ["rasa", "run", "actions", "--actions", "actions.actions", "--port", "5055", "--debug"]
