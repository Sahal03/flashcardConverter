#!/bin/bash
echo "Deploying to Cloud Run..."
gcloud run deploy flashcard-app \
  --source . \
  --region us-central1 \
  --allow-unauthenticated

echo "Deployment complete!"
gcloud run services describe flashcard-app --region us-central1 --format="value(status.url)"