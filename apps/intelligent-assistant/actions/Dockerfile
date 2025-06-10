FROM rasa/rasa-sdk:latest
WORKDIR /app
COPY . /app

USER root
RUN pip install --no-cache-dir -r requirements-actions.txt
USER 1001

EXPOSE 5055

CMD ["rasa", "run", "actions", "--auto-reload", "--port", "5055"]