# Imagen base del action server
FROM rasa/rasa-sdk:3.6.0

# Directorio dentro del contenedor
WORKDIR /app

# Copia el contenido de la carpeta 'actions' del proyecto raíz
COPY . /app

USER root

# Instala dependencias si tienes requirements
RUN pip install --no-cache-dir -r requirements.txt || true

# Puerto del action server
EXPOSE 5055

# Comando para ejecutar el action server
ENTRYPOINT ["rasa", "run", "actions", "--port", "5055"]

