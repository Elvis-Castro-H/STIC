FROM rasa/rasa-sdk:3.6.0

WORKDIR /app
COPY . /app/

USER root

RUN pip install --no-cache-dir -r requirements.txt || true

EXPOSE 5055

ENTRYPOINT ["python", "-m", "rasa_sdk", "--actions", "actions", "--port", "5055"]
