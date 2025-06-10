# Usar la imagen base oficial de Rasa
FROM rasa/rasa:2.8.0-full

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar todos los archivos del proyecto al contenedor
COPY . /app

# Instalar las dependencias del proyecto
#RUN pip install --no-cache-dir -r requirements.txt

# Exponer el puerto necesario para la API de Rasa
EXPOSE 5005
# Exponer el puerto 5055 para el Action Server
EXPOSE 5055

# Entrenar el modelo de Rasa
#RUN rasa train

# Iniciar Rasa y el Action Server en paralelo
CMD ["bash", "-c", "rasa run --enable-api --cors '*' --port 5005 & rasa run actions --port 5055"]
