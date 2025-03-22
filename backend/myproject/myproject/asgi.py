"""
ASGI config for myproject project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os
import logging
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from myproject.middleware import TokenAuthMiddleware
import myproject.routing 

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')

logging.basicConfig(level=logging.INFO)
logging.info("Chargement de websocket_urlpatterns: %s", myproject.routing.websocket_urlpatterns)

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": TokenAuthMiddleware(
        URLRouter(myproject.routing.websocket_urlpatterns)
    ),
})
