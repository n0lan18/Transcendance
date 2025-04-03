#!/bin/bash

# Récupérer l'adresse IP de l'interface en0
IP_ADDRESS=$(ifconfig enp6s0 | grep "inet " | awk '{print $2}')

# Vérifier si l'adresse IP est récupérée
if [ -z "$IP_ADDRESS" ]; then
    echo "Erreur : Impossible de récupérer l'adresse IP de l'interface enp6s0."
    IP_ADDRESS=$(ifconfig en0 | grep "inet " | awk '{print $2}')
    if [ -z "$IP_ADDRESS" ]; then
        echo "Erreur : Impossible de récupérer l'adresse IP de l'interface en0."
    fi
fi 

# Chemin du fichier .env
ENV_FILE=".env"

# Nom de la variable à mettre à jour dans le fichier .env
VARIABLE_NAME="SERVER_IP"

# Vérifier si le fichier .env existe
if [ ! -f "$ENV_FILE" ]; then
    echo "Erreur : Le fichier $ENV_FILE n'existe pas."
    exit 1
fi

# Mettre à jour ou ajouter la variable dans le fichier .env
if grep -q "^${VARIABLE_NAME}=" "$ENV_FILE"; then
    # Si la variable existe, la mettre à jour
    sed -i "s/${SERVER_IP}=*/${SERVER_IP}=${IP_ADDRESS}/" "${ENV_FILE}"
    echo "La variable ${VARIABLE_NAME} a été mise à jour avec l'adresse IP : ${IP_ADDRESS}"
else
    # Si la variable n'existe pas, l'ajouter à la fin du fichier
    echo "${VARIABLE_NAME}=${IP_ADDRESS}" >> "$ENV_FILE"
    echo "La variable ${VARIABLE_NAME} a été ajoutée avec l'adresse IP : ${IP_ADDRESS}"
fi