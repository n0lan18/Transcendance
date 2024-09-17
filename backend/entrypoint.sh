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

echo "Applying makemigrations..."
python manage.py makemigrations

# Appliquer les migrations
echo "Applying migrations..."
python manage.py migrate

# Mise a jour des fichiers static files
echo "Collect static files..."
python manage.py collectstatic --noinput

# Créer un superutilisateur si les variables d'environnement sont définies
#if [ "$DJANGO_SUPERUSER_USERNAME" ] && [ "$DJANGO_SUPERUSER_PASSWORD" ] && [ "$DJANGO_SUPERUSER_EMAIL" ]; then
#    echo "Creating superuser..."
#    python manage.py shell <<EOF
#from django.contrib.auth.models import User
#if not User.objects.filter(username='$DJANGO_SUPERUSER_USERNAME').exists():
#    User.objects.create_superuser('$DJANGO_SUPERUSER_USERNAME', '$DJANGO_SUPERUSER_EMAIL', '$DJANGO_SUPERUSER_PASSWORD')
#EOF
#fi

# Démarrer le serveur Django avec runserver
echo "Starting Django development server..."
exec python -u manage.py runserver 0.0.0.0:8000
