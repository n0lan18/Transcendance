# Dockerfile pour Django

FROM python:3.9-slim

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration
COPY requirements.txt /app/

# Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Copier le script d'entrée
COPY entrypoint.sh /app/

# Rendre le script d'entrée exécutable
RUN chmod +x /app/entrypoint.sh

# Copier le code de l'application
COPY . /app/

# Définir le script d'entrée comme point d'entrée
ENTRYPOINT ["sh", "/app/entrypoint.sh"]

# Exposer le port pour Gunicorn
EXPOSE 8000
