import os
import resend
from dotenv import load_dotenv

load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY")
sender_email = os.getenv("SENDER_EMAIL", "CrestCode <onboarding@resend.dev>")

def send_email(to_email: str, subject: str, html_content: str):
    if not resend.api_key:
        print(f"Resend is not configured. Email to {to_email} skipped. Subject: {subject}")
        return None
    try:
        response = resend.Emails.send({
            "from": sender_email,
            "to": to_email,
            "subject": subject,
            "html": html_content
        })
        return response
    except Exception as e:
        print(f"Failed to send email via Resend: {e}")
        return None
