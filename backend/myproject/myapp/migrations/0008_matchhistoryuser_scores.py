# Generated by Django 4.2.18 on 2025-01-30 15:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0007_alter_matchhistoryuser_dureematch'),
    ]

    operations = [
        migrations.AddField(
            model_name='matchhistoryuser',
            name='scores',
            field=models.CharField(default='0-0', max_length=50),
        ),
    ]
