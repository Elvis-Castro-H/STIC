# Usar la imagen base oficial de Rasa
FROM rasa/rasa:2.8.0-full

# Establecer el directorio de trabajo
WORKDIR /app

# Ejecutar como root para instalar las dependencias
USER root

# Copiar requirements.txt primero para aprovechar el cache de Docker
COPY requirements.txt /app/requirements.txt

# Instalar las dependencias del proyecto
RUN pip install --no-cache-dir -r requirements.txt

# Copiar todos los archivos del proyecto al contenedor
COPY . /app

# Cambiar permisos para que el usuario rasa pueda acceder
RUN chown -R 1001:1001 /app

# Volver al usuario rasa
USER 1001

# Entrenar el modelo de Rasa con logs detallados
RUN rasa train --debug

# Verificar que el modelo se haya creado
RUN ls -la /app/models/ || echo "No se encontraron modelos"

# Exponer los puertos necesarios
EXPOSE 5005
EXPOSE 5055

# Variables de entorno
ENV RASA_HOME=/app
ENV RASA_MODEL_DIR=/app/models
ENV RASA_LOG_LEVEL=DEBUG

# Comando de inicio embebido (sin script separado)
CMD ["sh", "-c", "echo 'Iniciando servicios de Rasa...' && \
    echo 'Modelos disponibles:' && ls -la /app/models/ && \
    rasa run actions --port 5055 --debug & sleep 5 && \
    rasa run --enable-api --cors '*' --port 5005 --debug"]