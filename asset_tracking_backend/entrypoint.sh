#! /bin/bash

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
while ! nc -z db 5432; do
  sleep 0.1
done
echo "PostgreSQL is up!"

python manage.py makemigrations --no-input
python manage.py migrate --no-input
gunicorn asset_tracking_backend.wsgi:application --bind 0.0.0.0:8000