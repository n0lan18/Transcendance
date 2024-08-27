# Dockerfile pour Django

FROM python:3.9-slim

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration
COPY requirements.txt /app/

# Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code de l'application
COPY . /app/

# Exposer le port pour Gunicorn
EXPOSE 8000

# Commande pour démarrer Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "myproject.wsgi:application"]
