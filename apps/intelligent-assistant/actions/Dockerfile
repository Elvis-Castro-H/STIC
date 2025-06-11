# Usa la imagen oficial del Action Server
FROM rasa/rasa-sdk:3.6.0

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia solo la carpeta de acciones (ajusta si está en otro lugar)
COPY actions /app/actions

# Si tienes dependencias para tus acciones, colócalas en este archivo
COPY requirements-actions.txt /app/requirements.txt

# Instala las dependencias (opcional, si tienes algo en requirements)
RUN pip install --no-cache-dir -r requirements.txt || true

# Expone el puerto por defecto del action server
EXPOSE 5055

# Comando para iniciar el servidor de acciones
CMD ["rasa", "run", "actions"]
