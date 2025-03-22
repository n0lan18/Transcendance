# Dockerfile pour Nginx

FROM nginx:latest

RUN mkdir -p /etc/nginx/ssl
RUN apt-get update -y && apt-get install -y openssl
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/inception.key -out /etc/nginx/ssl/inception.crt \
    -subj "/C=SW/ST=VD/L=Lausane/O=42/OU=42/CN=nleggeri.42.ch/emailAddress=nleggeri@student.42.fr"


# Copier la configuration Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exposer les ports
EXPOSE 443