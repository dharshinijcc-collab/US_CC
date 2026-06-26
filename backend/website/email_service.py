import os
import threading
import resend
from backend.config import RESEND_API_KEY, FROM_EMAIL, TEAM_NOTIFICATION_EMAIL, REPLY_TO_EMAIL

# Initialize Resend
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

TEAM_EMAIL = TEAM_NOTIFICATION_EMAIL


def _send_email(to_email: str, subject: str, html_body: str, reply_to: str = None):
    """Send an email via Resend API."""
    if not RESEND_API_KEY:
        print("WARNING: RESEND_API_KEY not set - skipping email")
        return
    try:
        params = {
            "from": FROM_EMAIL,
            "to": [to_email],
            "subject": subject,
            "html": html_body,
        }
        if reply_to:
            params["reply_to"] = reply_to

        resend.Emails.send(params)
        print(f"Email sent to {to_email} via Resend")
    except Exception as e:
        print(f"Failed to send email to {to_email} via Resend: {e}")


def _base_template(title: str, body_html: str) -> str:
    """Shared branded HTML email wrapper."""
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>{title}</title>
    </head>
    <body style="margin:0;padding:0;background-color:#F3F5F9;font-family:'Inter',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F3F5F9;padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
              
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#005AE2,#0088FF);border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
                  <p style="margin:0;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.02em;">
                    Crestcode Product Studio
                  </p>
                  <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:13px;font-weight:500;">
                    Venture Building  Product Development  Innovation
                  </p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="background:#ffffff;padding:40px;border-left:1px solid #E2E8F0;border-right:1px solid #E2E8F0;">
                  {body_html}
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#F8FAFC;border:1px solid #E2E8F0;border-top:none;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
                  <p style="margin:0;color:#94A3B8;font-size:12px;">
                     2025 Crestcode Product Studio. All rights reserved.<br>
                    You're receiving this because you submitted a form on our website.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    """


def send_contact_confirmation(to_email: str, first_name: str, service: str, message: str):
    """Send confirmation email after Contact Us form submission."""
    body = f"""
      <h2 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#020617;">
        Thanks for reaching out, {first_name}! 
      </h2>
      <p style="margin:0 0 24px;color:#64748B;font-size:15px;line-height:1.6;">
        We've received your inquiry and our team is reviewing it now. We'll get back to you within <strong style="color:#005AE2;">12 business days</strong>.
      </p>

      <div style="background:#F0F7FF;border-left:4px solid #005AE2;border-radius:4px 12px 12px 4px;padding:20px 24px;margin-bottom:32px;">
        <p style="margin:0 0 8px;font-size:12px;font-weight:800;color:#005AE2;text-transform:uppercase;letter-spacing:0.08em;">Your Submission</p>
        <p style="margin:0 0 6px;font-size:14px;color:#334155;"><strong>Service Interest:</strong> {service or 'General Enquiry'}</p>
        <p style="margin:0;font-size:14px;color:#334155;"><strong>Your Message:</strong> {message[:200] + '...' if len(message) > 200 else message}</p>
      </div>

      <p style="margin:0 0 24px;color:#64748B;font-size:14px;line-height:1.6;">
        While you wait, feel free to explore how we work with founders and investors:
      </p>

      <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
        <tr>
          <td style="padding-right:12px;">
            <a href="https://us-cc.netlify.app/studio" style="display:inline-block;background:linear-gradient(135deg,#0088FF,#005AE2);color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">
              Our Studio 
            </a>
          </td>
          <td>
            <a href="https://us-cc.netlify.app/playbook" style="display:inline-block;background:#F1F5F9;color:#334155;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">
              Our Playbook 
            </a>
          </td>
        </tr>
      </table>

      <p style="margin:0;color:#94A3B8;font-size:13px;">
        Best regards,<br>
        <strong style="color:#334155;">The Crestcode Team</strong>
      </p>
    """

    # Notify Team
    team_body = f"""
      <h2 style="font-size:20px;color:#020617;">New Contact Inquiry</h2>
      <p><strong>From:</strong> {first_name} ({to_email})</p>
      <p><strong>Service:</strong> {service}</p>
      <p><strong>Message:</strong> {message}</p>
    """
    _send_email(
        TEAM_EMAIL,
        f"New Inquiry: {service} from {first_name}",
        _base_template("New Contact Submission", team_body),
        reply_to=to_email
    )

    # Send to User (delayed by 5 minutes)
    def send_delayed():
        try:
            _send_email(
                to_email,
                f"We got your message, {first_name}!",
                _base_template("Thank you for contacting Crestcode", body),
                reply_to=REPLY_TO_EMAIL
            )
            print(f"[DELAYED EMAIL] Contact confirmation sent to {to_email}")
        except Exception as e:
            print(f"[DELAYED EMAIL ERROR] Failed to send contact confirmation to {to_email}: {e}")

    timer = threading.Timer(60.0, send_delayed)
    timer.daemon = True
    timer.start()
    print(f"[DELAYED EMAIL] Scheduled contact confirmation for {to_email} in 1 minute")


def send_idea_confirmation(to_email: str, name: str, idea_preview: str):
    """Send confirmation email after idea submission."""

    display_name = name if name else "there"
    body = f"""
      <h2 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#020617;">
        We have received your submission, {display_name}!
      </h2>
      <p style="margin:0 0 24px;color:#64748B;font-size:15px;line-height:1.6;">
        Thank you for sharing your idea with us. We have received your submission and our team will review it carefully.
      </p>

      <p style="margin:0 0 24px;color:#64748B;font-size:15px;line-height:1.6;">
        We will reach out to you soon to discuss the next steps.
      </p>

      <div style="background:#F0F7FF;border-left:4px solid #005AE2;border-radius:4px 12px 12px 4px;padding:20px 24px;margin-bottom:32px;">
        <p style="margin:0 0 8px;font-size:12px;font-weight:800;color:#005AE2;text-transform:uppercase;letter-spacing:0.08em;">Your Idea</p>
        <p style="margin:0;font-size:14px;color:#334155;">{idea_preview[:200] + '...' if len(idea_preview) > 200 else idea_preview}</p>
      </div>

      <p style="margin:0;color:#94A3B8;font-size:13px;">
        Regards,<br>
        <strong style="color:#334155;">CC Team</strong>
      </p>
    """

    # Notify Team
    team_body = f"""
      <h2 style="font-size:20px;color:#020617;">New Idea Submission</h2>
      <p><strong>Founder:</strong> {name} ({to_email})</p>
      <p><strong>Idea:</strong> {idea_preview}</p>
    """
    _send_email(
        TEAM_EMAIL,
        f"New Idea from {name or to_email}",
        _base_template("New Idea Submission", team_body),
        reply_to=to_email
    )

    # Send to User (delayed by 5 minutes)
    def send_delayed():
        try:
            _send_email(
                to_email,
                "We received your submission!",
                _base_template("Idea Received - Crestcode", body),
                reply_to=REPLY_TO_EMAIL
            )
            print(f"[DELAYED EMAIL] Idea confirmation sent to {to_email}")
        except Exception as e:
            print(f"[DELAYED EMAIL ERROR] Failed to send idea confirmation to {to_email}: {e}")

    timer = threading.Timer(60.0, send_delayed)
    timer.daemon = True
    timer.start()
    print(f"[DELAYED EMAIL] Scheduled idea confirmation for {to_email} in 1 minute")


def send_talent_confirmation(to_email: str, first_name: str, interest: str):
    """Send confirmation email after talent/careers form submission."""

    body = f"""
      <h2 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#020617;">
        Application received, {first_name}! 
      </h2>
      <p style="margin:0 0 24px;color:#64748B;font-size:15px;line-height:1.6;">
        Thanks for your interest in joining the Crestcode team. We've logged your application and will review your profile shortly.
      </p>

      <div style="background:#F0F7FF;border-left:4px solid #005AE2;border-radius:4px 12px 12px 4px;padding:20px 24px;margin-bottom:32px;">
        <p style="margin:0 0 8px;font-size:12px;font-weight:800;color:#005AE2;text-transform:uppercase;letter-spacing:0.08em;">Your Application</p>
        <p style="margin:0;font-size:14px;color:#334155;"><strong>Area of Interest:</strong> {interest or 'General'}</p>
      </div>

      <p style="margin:0 0 24px;color:#64748B;font-size:14px;line-height:1.6;">
        We'll be in touch if your background aligns with our current needs. In the meantime, feel free to explore our work.
      </p>

      <p style="margin:0;color:#94A3B8;font-size:13px;">
        Best regards,<br>
        <strong style="color:#334155;">The Crestcode Team</strong>
      </p>
    """

    # Notify Team
    team_body = f"""
      <h2 style="font-size:20px;color:#020617;">New Talent Application</h2>
      <p><strong>Candidate:</strong> {first_name} ({to_email})</p>
      <p><strong>Area:</strong> {interest}</p>
    """
    _send_email(
        TEAM_EMAIL,
        f"New Talent App: {interest} from {first_name}",
        _base_template("New Talent Submission", team_body),
        reply_to=to_email
    )

    # Send to User (delayed by 5 minutes)
    def send_delayed():
        try:
            _send_email(
                to_email,
                f"Application received, {first_name}! We'll be in touch",
                _base_template("Application Received - Crestcode", body),
                reply_to=REPLY_TO_EMAIL
            )
            print(f"[DELAYED EMAIL] Talent confirmation sent to {to_email}")
        except Exception as e:
            print(f"[DELAYED EMAIL ERROR] Failed to send talent confirmation to {to_email}: {e}")

    timer = threading.Timer(60.0, send_delayed)
    timer.daemon = True
    timer.start()
    print(f"[DELAYED EMAIL] Scheduled talent confirmation for {to_email} in 1 minute")


def send_investor_confirmation(to_email: str, full_name: str, expertise: str):
    """Send confirmation email after investor form submission."""

    body = f"""
      <h2 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#020617;">
        Welcome to the network, {full_name}! 
      </h2>
      <p style="margin:0 0 24px;color:#64748B;font-size:15px;line-height:1.6;">
        Thank you for expressing interest in partnering with Crestcode. We've received your investor profile and our team will review it carefully.
      </p>

      <div style="background:#F0F7FF;border-left:4px solid #005AE2;border-radius:4px 12px 12px 4px;padding:20px 24px;margin-bottom:32px;">
        <p style="margin:0 0 8px;font-size:12px;font-weight:800;color:#005AE2;text-transform:uppercase;letter-spacing:0.08em;">Your Profile</p>
        <p style="margin:0;font-size:14px;color:#334155;"><strong>Expertise:</strong> {expertise or 'Not specified'}</p>
      </div>

      <p style="margin:0 0 24px;color:#64748B;font-size:14px;line-height:1.6;">
        We'll reach out within <strong style="color:#005AE2;">35 business days</strong> to schedule an introductory call.
      </p>

      <p style="margin:0;color:#94A3B8;font-size:13px;">
        Best regards,<br>
        <strong style="color:#334155;">The Crestcode Team</strong>
      </p>
    """

    # Notify Team
    team_body = f"""
      <h2 style="font-size:20px;color:#020617;">New Investor Profile</h2>
      <p><strong>Investor:</strong> {full_name} ({to_email})</p>
      <p><strong>Expertise:</strong> {expertise}</p>
    """
    _send_email(
        TEAM_EMAIL,
        f"New Investor: {full_name}",
        _base_template("New Investor Submission", team_body),
        reply_to=to_email
    )

    # Send to User (delayed by 5 minutes)
    def send_delayed():
        try:
            _send_email(
                to_email,
                "Investor Profile Received - Crestcode",
                _base_template("Investor Profile Received - Crestcode", body),
                reply_to=REPLY_TO_EMAIL
            )
            print(f"[DELAYED EMAIL] Investor confirmation sent to {to_email}")
        except Exception as e:
            print(f"[DELAYED EMAIL ERROR] Failed to send investor confirmation to {to_email}: {e}")

    timer = threading.Timer(60.0, send_delayed)
    timer.daemon = True
    timer.start()
    print(f"[DELAYED EMAIL] Scheduled investor confirmation for {to_email} in 1 minute")


def send_idea_confirmation_delayed(to_email: str, name: str, idea_preview: str, delay_minutes: int = 1):
    """Send confirmation email after idea submission with a delay."""
    
    def send_delayed():
        try:
            send_idea_confirmation(to_email, name, idea_preview)
            print(f"Delayed confirmation email sent to {to_email} after {delay_minutes} minutes")
        except Exception as e:
            print(f"Failed to send delayed email to {to_email}: {e}")
    
    # Start a timer to send the email after the specified delay
    timer = threading.Timer(delay_minutes * 60, send_delayed)
    timer.daemon = True  # Daemon thread won't prevent program from exiting
    timer.start()
    print(f"Scheduled confirmation email to {to_email} in {delay_minutes} minutes")
