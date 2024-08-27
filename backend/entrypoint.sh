#!/bin/sh

# Créer un projet Django s'il n'existe pas déjà
if [ ! -d "myproject" ]; then
    echo "Creating Django project..."
    django-admin startproject myproject
fi

# Changer de répertoire vers le projet Django
cd myproject

# Créer une application Django s'il n'existe pas déjà
if [ ! -d "myapp" ]; then
    echo "Creating Django app..."
    python manage.py startapp myapp
fi

# Appliquer les migrations
echo "Applying migrations..."
python manage.py migrate

# Collecter les fichiers statiques
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Démarrer le serveur Gunicorn
echo "Starting Gunicorn..."
exec gunicorn myproject.wsgi:application --bind 0.0.0.0:8000
