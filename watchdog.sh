#!/bin/bash

# BIZEN Local Watchdog
# Monitorea la API de Health Check para vigilar el servidor y la Base de Datos
# También ejecuta el cron de dividendos cada hora.

URL="http://localhost:3004/api/health"
DIVIDEND_URL="http://localhost:3004/api/cron/dividends"
CRON_SECRET="BIZEN_CRON_2026"
INTERVAL=15 # Revisa cada 15 segundos
DIVIDEND_INTERVAL=3600 # Paga dividendos cada 1 hora (3600 segundos)
LAST_DIVIDEND_RUN=0  # Timestamp de la última ejecución

echo "=========================================="
echo " 🐶 Iniciando BIZEN Watchdog Local "
echo "=========================================="
echo "Monitorizando: $URL"
echo "Presiona Ctrl+C para detener."
echo ""

while true; do
  NOW=$(date +%s)

  # ── Health Check ──────────────────────────────────────────
  RESPONSE=$(curl -s -w "\n%{http_code}" $URL)
  HTTP_STATUS=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | sed '$d')

  if [ "$HTTP_STATUS" -eq 200 ]; then
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
    
    osascript -e 'display notification "Revisa la terminal de BIZEN" with title "🚨 BIZEN Watchdog: Servidor Caído"'
    echo -e "\a"
  fi

  # ── Cron de Dividendos (cada hora, solo si el servidor está UP) ──
  if [ "$HTTP_STATUS" -eq 200 ]; then
    ELAPSED=$(( NOW - LAST_DIVIDEND_RUN ))
    if [ "$ELAPSED" -ge "$DIVIDEND_INTERVAL" ]; then
      echo "[$(date +'%H:%M:%S')] 💸 Ejecutando cron de dividendos..."
      DIV_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "x-cron-secret: $CRON_SECRET" \
        "$DIVIDEND_URL")
      if [ "$DIV_RESPONSE" -eq 200 ]; then
        echo "[$(date +'%H:%M:%S')] ✅ Dividendos procesados OK"
      else
        echo "[$(date +'%H:%M:%S')] ⚠️  Cron de dividendos respondió: $DIV_RESPONSE"
      fi
      LAST_DIVIDEND_RUN=$NOW
    fi
  fi

  sleep $INTERVAL
done
