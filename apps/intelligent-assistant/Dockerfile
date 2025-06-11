# Usa la imagen oficial de Rasa (versión completa)
FROM rasa/rasa:3.6.11-full

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia todo el proyecto al contenedor
COPY . /app

# Instala las dependencias si tienes (esto es opcional)
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt || true

# Entrena el modelo de Rasa
RUN rasa train

# Expone el puerto 5005 (API REST y canales de entrada)
EXPOSE 5005

# Ejecuta el servidor de Rasa en modo API
ENTRYPOINT ["rasa", "run", "--enable-api", "--cors", "*", "--port", "5005"]
