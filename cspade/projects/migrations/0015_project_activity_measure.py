# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2017-03-10 12:33
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0014_project_example'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='activity_measure',
            field=models.TextField(blank=True, null=True),
        ),
    ]
