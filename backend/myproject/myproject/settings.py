"""
Django settings for myproject project.

Generated by 'django-admin startproject' using Django 4.2.15.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path, os
from datetime import timedelta
import logging
import builtins

original_print = builtins.print

def print(*args, **kwargs):
    kwargs.setdefault('flush', True)  # Ajoute flush=True si non défini
    original_print(*args, **kwargs)

# Configuration de niveau de log
logging.basicConfig(level=logging.DEBUG)

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')

IP_ADDRESS = os.getenv('IP_ADDRESS')
LOCAL_ADDRESS = os.getenv('LOCAL_ADDRESS')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DEBUG')

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS').split(',')

# Securisation http request
CSRF_TRUSTED_ORIGINS = [
	LOCAL_ADDRESS,
	IP_ADDRESS
]

# Only local_address and Ip_address can access API
CORS_ALLOWED_ORIGINS = [
    LOCAL_ADDRESS,
    IP_ADDRESS
]

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
	'rest_framework',
	'rest_framework_simplejwt',
	'corsheaders',
	'channels',
    'myapp',
    'rest_framework_simplejwt.token_blacklist', 
]

# Different application for protecting middlewares
MIDDLEWARE = [
	'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'myproject.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Classic http request
WSGI_APPLICATION = 'myproject.wsgi.application'

# Async request like websockets
ASGI_APPLICATION = 'myproject.asgi.application'

# Websocket connexion 
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('redis', 6379)],
        },
    },
}

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT'),
    }
}

REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'PAGE_SIZE': 100,
    #User must be authenticate
    'DEFAULT_AUTHENTICATION_CLASSES': (
		'rest_framework_simplejwt.authentication.JWTAuthentication',
		# 'rest_framework.authentication.SessionAuthentication',

	),
    'DEFAULT_PERMISSION_CLASSES': (
		'rest_framework.permissions.IsAuthenticated',
    ),
}

# Configuration JWToken
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),  # Durée de validité du token d'accès
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),    # Durée de validité du token de rafraîchissement
    'ROTATE_REFRESH_TOKENS': True,  # Si vrai, génère un nouveau refresh token lors du rafraîchissement
    'BLACKLIST_AFTER_ROTATION': True, # Blackliste l'ancien refresh token après rotation
    'UPDATE_LAST_LOGIN': False,       # Met à jour l'heure du dernier login lors de l'authentification
}

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

# Default password Django validator
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Authentification with function in backends.py
AUTHENTICATION_BACKENDS = [
    'myapp.backends.UsernameOrEmailBackend',
    'django.contrib.auth.backends.ModelBackend',
]

# Keep traces and logs for production
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'DEBUG',
    },
    'django': {
        'handlers': ['console'],
        'level': 'INFO',
        'propagate': True,
    },
}

# Model for authentification
AUTH_USER_MODEL = 'myapp.User'