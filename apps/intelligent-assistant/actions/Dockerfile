FROM rasa/rasa-sdk:3.6.0

WORKDIR /app

# Copia todo el contenido del directorio 'actions' al contenedor
COPY . /app/

USER root

# Instala las dependencias desde el requirements.txt que ya está en /app
RUN pip install --no-cache-dir -r requirements.txt || true

EXPOSE 5055

# Ejecuta el servidor de acciones especificando el módulo 'actions'
CMD ["rasa", "run", "actions", "--actions", "actions", "--port", "5055", "--debug"]
