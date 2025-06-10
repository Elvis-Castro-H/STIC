# Usar la imagen base oficial de Rasa
FROM rasa/rasa:2.8.0-full

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar todos los archivos del proyecto al contenedor
COPY . /app

# Ejecutar como root para instalar las dependencias
USER root

# Instalar las dependencias del proyecto
RUN pip install --no-cache-dir -r requirements.txt

# Exponer los puertos necesarios para la API de Rasa y el Action Server
EXPOSE 5005
EXPOSE 5055

# Entrenar el modelo de Rasa
RUN rasa train

# Usar ENTRYPOINT para iniciar ambos servicios (Rasa y Action Server) en paralelo
ENTRYPOINT ["sh", "-c", "rasa run --enable-api --cors '*' --port 5005 & rasa run actions --port 5055"]
