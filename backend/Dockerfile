# Dockerfile pour Django

FROM python:3.9-slim

# Définir le répertoire de travail
WORKDIR /app

COPY . .

RUN apt-get update && apt-get install -y curl

# Installer les dépendances
RUN  pip install --upgrade pip \
&& pip install --no-cache-dir -r requirements.txt \
&& apt-get install -y curl \
&& pip install channels \
&& pip install channels-redis \
&& pip install daphne \
&& pip install --upgrade watchfiles \
&& pip install requests

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
