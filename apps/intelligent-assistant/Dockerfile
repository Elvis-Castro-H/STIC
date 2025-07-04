FROM rasa/rasa:3.6.11-full

WORKDIR /app

COPY . /app

COPY requirements.txt /app/requirements.txt
USER root
RUN pip install --no-cache-dir -r requirements.txt || true

RUN rasa train

ENV PORT=5005
EXPOSE 5005

CMD ["rasa", "run",
     "-m", "models",
     "--enable-api",
     "--cors", "*",
     "--port", "5005",
     "--endpoints", "endpoints.yml"]
