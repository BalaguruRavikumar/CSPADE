# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-12-14 14:24
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0004_auto_20161214_1117'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='data_file',
            field=models.FileField(blank=True, null=True, upload_to='uploads/'),
        ),
    ]
