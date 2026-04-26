#!/bin/bash

# BIZEN Local Watchdog
# Monitorea la API de Health Check para vigilar el servidor y la Base de Datos

URL="http://localhost:3004/api/health"
INTERVAL=15 # Revisa cada 15 segundos

echo "=========================================="
echo " 🐶 Iniciando BIZEN Watchdog Local "
echo "=========================================="
echo "Monitorizando: $URL"
echo "Presiona Ctrl+C para detener."
echo ""

while true; do
  # Intentar obtener el status code y el cuerpo de la respuesta
  RESPONSE=$(curl -s -w "\n%{http_code}" $URL)
  HTTP_STATUS=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | sed '$d')

  if [ "$HTTP_STATUS" -eq 200 ]; then
    # Extraer latencia y memoria si es posible (usando grep/sed básico)
    LATENCY=$(echo "$BODY" | grep -o '"latency_ms":[0-9]*' | cut -d':' -f2 || echo "?")
    echo "[$(date +'%H:%M:%S')] ✅ OK | Latencia BD: ${LATENCY}ms"
  else
    echo "[$(date +'%H:%M:%S')] 🚨 ¡ALERTA CRÍTICA! (Código: $HTTP_STATUS)"
    
    if [ "$HTTP_STATUS" -eq 000 ]; then
      echo "   ❌ El servidor Next.js está apagado o no responde."
    elif [ "$HTTP_STATUS" -eq 503 ]; then
      echo "   ❌ La Base de Datos se desconectó. ¡Revisa el cloud-sql-proxy!"
    else
      echo "   ❌ Error desconocido en el servidor."
    fi
    
    # Notificación del sistema (funciona en Mac)
    osascript -e 'display notification "Revisa la terminal de BIZEN" with title "🚨 BIZEN Watchdog: Servidor Caído"'
    
    # Hacemos ruido en la terminal (campana)
    echo -e "\a"
  fi

  sleep $INTERVAL
done
