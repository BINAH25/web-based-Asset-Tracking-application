import logging
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from smtplib import SMTPException

logger = logging.getLogger(__name__)

def send_otp_mail(email, otp):
    try:
        context = {"otp": otp}
        html_message = render_to_string("otp.html", context)
        plain_message = strip_tags(html_message)
        message = EmailMultiAlternatives(
            subject="One Time Password",
            body=plain_message,
            from_email=settings.EMAIL_HOST_USER,
            to=[email],
        )
        message.attach_alternative(html_message, 'text/html')
        message.send()
        logger.info(f"Email sent to {email}")
    except SMTPException as exc:
        logger.error(f"Failed to send email to {email}: {exc}")


def send_account_registration_mail(email, name, username,password):
    try:
        context = {
        "username":username,
        "name":name,
        "email":email,
        "password":password
        }
        html_message = render_to_string("login_detail.html",context)
        plain_message = strip_tags(html_message)
        message = EmailMultiAlternatives(
        subject="Your Login Details",
        body=plain_message,
        from_email=settings.EMAIL_HOST_USER,
        to=[email],
        )
        message.attach_alternative(html_message, 'text/html')
        message.send()
        logger.info(f"Email sent to {email}")
    except SMTPException as exc:
        logger.error(f"Failed to send email to {email}: {exc}")
