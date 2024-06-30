from __future__ import absolute_import, unicode_literals
import os

from celery import Celery
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'asset_tracking_backend.settings')
app = Celery('asset_tracking_backend')
app.config_from_object(settings, namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()


# def celery_info():
#     return bool(app.control.inspect().active())


@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
