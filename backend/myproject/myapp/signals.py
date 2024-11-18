from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.db import database_sync_to_async

User = get_user_model()

@receiver(post_save, sender=User)
def force_offline(sender, instance, **kwargs):
    if not instance.is_authenticated:
        instance.is_online = False
        instance.save()