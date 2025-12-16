# backend/store/management/commands/process_emails.py
from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from store.models import OrderEmailQueue
import time

class Command(BaseCommand):
    help = 'Procesa la cola de correos electrónicos pendientes de pedidos'

    def handle(self, *args, **options):
        self.stdout.write("Iniciando servicio de envío de correos...")
        
        # Bucle infinito para simular un servicio (Daemon)
        # En producción podrías usar CRON (quitando el while) o SYSTEMD (con el while)
        while True:
            # Buscar tareas PENDIENTES o FALLIDAS (con menos de 3 intentos)
            tasks = OrderEmailQueue.objects.filter(
                status__in=['PENDING', 'FAILED'], 
                attempts__lt=3
            ).select_related('order')[:10] # Procesar de a 10 para no saturar memoria

            if not tasks.exists():
                # Si no hay tareas, esperar 5 segundos y volver a consultar
                time.sleep(5)
                continue

            for task in tasks:
                self.process_task(task)

            # Pequeña pausa entre lotes
            time.sleep(1)

    def process_task(self, task):
        try:
            task.attempts += 1
            task.save(update_fields=['attempts']) # Guardar intento inmediatamente

            if task.email_type == 'CONFIRMATION':
                self.send_confirmation(task.order)
            elif task.email_type == 'UPDATE':
                self.send_update(task.order)
            
            # Si tuvo éxito:
            task.status = 'SENT'
            task.error_message = None
            task.save()
            self.stdout.write(self.style.SUCCESS(f"Email enviado: {task}"))

        except Exception as e:
            # Si falló:
            task.status = 'FAILED'
            task.error_message = str(e)
            task.save()
            self.stdout.write(self.style.ERROR(f"Error enviando {task}: {e}"))

    def send_confirmation(self, order):
        track_url = "http://localhost:5173/track" # Ajustar dominio en PROD
        
        subject = f'Confirmación de Pedido #{str(order.id)[:8].upper()}'
        message = f"""
        Hola {order.customer_name},
        
        Gracias por tu compra en Vinilo Store.
        
        PEDIDO RECIBIDO:
        Ref: {order.id}
        Total: ${order.total_amount:,.0f}
        
        Rastrea tu pedido aquí:
        {track_url}/{order.id}
        """
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [order.customer_email],
            fail_silently=False,
        )

    def send_update(self, order):
        track_url = "http://localhost:5173/track"
        status_label = order.get_status_display()
        
        extra_info = ""
        if order.tracking_number:
            extra_info = f"\nGuía: {order.tracking_number} ({order.shipping_company})"

        subject = f'Actualización: {status_label.upper()} - Pedido #{str(order.id)[:8].upper()}'
        message = f"""
        Hola {order.customer_name},
        
        Tu pedido ha cambiado de estado a: {status_label.upper()}
        {extra_info}
        
        Ver detalles:
        {track_url}/{order.id}
        """

        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [order.customer_email],
            fail_silently=False,
        )