#!/bin/bash

# Configuration
PROJECT_ID="bizen-475002"
REGION="us-central1"
SERVICE_NAME="bizen-frontend"
REPOSITORY="bizen-repo"

echo "🚀 Iniciando despliegue de BIZEN a Google Cloud Run..."

# 1. Enable necessary APIs
echo "🔑 Asegurando que las APIs de Google estén activas..."
gcloud services enable run.googleapis.com \
    artifactregistry.googleapis.com \
    cloudbuild.googleapis.com --project=$PROJECT_ID

# 2. Create Artifact Registry if it doesn't exist
echo "📦 Verificando repositorio de contenedores..."
gcloud artifacts repositories describe $REPOSITORY --location=$REGION --project=$PROJECT_ID > /dev/null 2>&1
if [ $? -ne 0 ]; then
    gcloud artifacts repositories create $REPOSITORY \
        --repository-format=docker \
        --location=$REGION \
        --description="Repositorio para BIZEN" \
        --project=$PROJECT_ID
fi

# 3. Load Environment Variables for Build Args
echo "🔍 Extrayendo variables de entorno..."
source .env

# 4. Sincronizar Secretos (Caja Fuerte)
echo "🔒 Sincronizando Secretos con Google Cloud..."
echo -n "$DATABASE_URL_PROD" | gcloud secrets versions add BIZEN_DATABASE_URL --data-file=- --project=$PROJECT_ID
echo -n "$CLERK_SECRET_KEY" | gcloud secrets versions add CLERK_SECRET_KEY --data-file=- --project=$PROJECT_ID

# 5. Build and Deploy using Cloud Build
echo "🏗️ Construyendo y Desplegando en la nube (Cloud Build)..."
gcloud builds submit --config cloudbuild.yaml \
    --substitutions=_REGION=$REGION,_REPOSITORY=$REPOSITORY,_SERVICE_NAME=$SERVICE_NAME,_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

echo "✅ ¡Proceso completado!"
gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --project=$PROJECT_ID --format='value(status.url)'
