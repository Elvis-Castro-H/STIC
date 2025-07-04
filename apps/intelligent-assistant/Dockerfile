FROM rasa/rasa:3.6.11-full

WORKDIR /app

COPY . /app

COPY requirements.txt /app/requirements.txt
USER root
RUN pip install --no-cache-dir -r requirements.txt || true

RUN rasa train

#ENV PORT=5005
EXPOSE 5005
ENTRYPOINT []
#CMD ["sh", "-c", "echo PORT=$PORT5000 && rasa run -m models --enable-api --cors '*' --interface 0.0.0.0 --port ${PORT} --endpoints endpoints.yml"]
CMD ["sh", "-c", "echo PORT=$PORT5000 && rasa run -m models --enable-api --cors '*' --interface 0.0.0.0 --endpoints endpoints.yml"]