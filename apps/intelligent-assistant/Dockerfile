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

# Entrenar el modelo de Rasa y verificar que se genere correctamente
RUN rasa train --debug

# Verificar que el modelo se haya creado
RUN ls -la /app/models/

# Exponer los puertos necesarios para la API de Rasa y el Action Server
EXPOSE 5005
EXPOSE 5055

# Crear un script de inicio para manejar ambos servicios
COPY start.sh /app/start.sh
USER root
RUN chmod +x /app/start.sh
USER 1001

# Usar el script de inicio
ENTRYPOINT ["/app/start.sh"]