#!/bin/sh

# Télécharger le script wait-for-it.sh et le rendre exécutable
curl -o wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
chmod +x wait-for-it.sh

echo "Waiting for PostgreSQL to be ready..."
./wait-for-it.sh db:5432 --timeout=15 --strict -- echo "PostgreSQL is up!"

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
python manage.py makemigrations &

wait

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

# Démarrer le serveur Daphne avec surveillance des changements
echo "Starting Daphne server with file watcher..."

cat <<EOF > run_daphne_with_reload.py
from watchfiles import run_process
import subprocess

def run_daphne():
    subprocess.run(["daphne", "-b", "0.0.0.0", "-p", "8000", "myproject.asgi:application"])

    try:
        process.wait()
    except KeyboardInterrupt:
        print("Arrêt en cours...")
        process.terminate()  # Termine le processus proprement
        process.wait()


if __name__ == "__main__":
    try:
        run_process(".", target=run_daphne)
    except KeyboardInterrupt:
        print("Arrêt du serveur de développement.")
EOF

exec python run_daphne_with_reload.py
