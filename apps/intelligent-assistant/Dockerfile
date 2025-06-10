FROM rasa/rasa:latest-full
WORKDIR /app
COPY . /app

USER root
#RUN pip install --no-cache-dir -r requirements.txt || true # '|| true' para que no falle si no existe
USER 1001

EXPOSE 5005

CMD ["rasa", "run", "-m", "models", "--enable-api", "--cors", "*", "--debug", "--port", "5005"]