#!/bin/bash

# Script de inicio para Rasa con mejor manejo de errores

# Verificar que existe al menos un modelo entrenado
if [ ! -d "/app/models" ] || [ -z "$(ls -A /app/models)" ]; then
    echo "No se encontraron modelos entrenados. Entrenando ahora..."
    rasa train --debug
    if [ $? -ne 0 ]; then
        echo "Error al entrenar el modelo"
        exit 1
    fi
fi

# Listar modelos disponibles
echo "Modelos disponibles:"
ls -la /app/models/

# Función para limpiar procesos al recibir señales
cleanup() {
    echo "Deteniendo servicios..."
    kill $RASA_PID $ACTIONS_PID 2>/dev/null
    exit 0
}

# Configurar el manejo de señales
trap cleanup SIGTERM SIGINT

# Iniciar el servidor de acciones en segundo plano
echo "Iniciando servidor de acciones..."
rasa run actions --port 5055 --debug &
ACTIONS_PID=$!

# Esperar un poco para que el servidor de acciones se inicie
sleep 5

# Iniciar el servidor de Rasa
echo "Iniciando servidor de Rasa..."
rasa run --enable-api --cors '*' --port 5005 --debug &
RASA_PID=$!

# Esperar a que los procesos terminen
wait $RASA_PID $ACTIONS_PID