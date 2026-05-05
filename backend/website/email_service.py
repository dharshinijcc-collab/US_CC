import os
import resend

# Initialize Resend with API key from environment
resend.api_key = os.environ.get("RESEND_EMAIL_API_KEY", "")

TEAM_EMAIL = os.environ.get("TEAM_NOTIFICATION_EMAIL", "team@crestcode.studio")
FROM_EMAIL = "Crestcode Product Studio <onboarding@resend.dev>"  # Use your domain once verified


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
                    Venture Building · Product Development · Innovation
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
                    © 2025 Crestcode Product Studio. All rights reserved.<br>
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
    if not resend.api_key:
        print("⚠️ RESEND_EMAIL_API_KEY not set — skipping email")
        return

    body = f"""
      <h2 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#020617;">
        Thanks for reaching out, {first_name}! 👋
      </h2>
      <p style="margin:0 0 24px;color:#64748B;font-size:15px;line-height:1.6;">
        We've received your inquiry and our team is reviewing it now. We'll get back to you within <strong style="color:#005AE2;">1–2 business days</strong>.
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
              Our Studio →
            </a>
          </td>
          <td>
            <a href="https://us-cc.netlify.app/playbook" style="display:inline-block;background:#F1F5F9;color:#334155;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">
              Our Playbook →
            </a>
          </td>
        </tr>
      </table>

      <p style="margin:0;color:#94A3B8;font-size:13px;">
        Best regards,<br>
        <strong style="color:#334155;">The Crestcode Team</strong>
      </p>
    """

    try:
        resend.Emails.send({
            "from": FROM_EMAIL,
            "to": [to_email],
            "subject": f"We got your message, {first_name}! 🚀",
            "html": _base_template("Thank you for contacting Crestcode", body)
        })
        print(f"✅ Confirmation email sent to {to_email}")
    except Exception as e:
        print(f"❌ Failed to send confirmation email: {e}")


def send_idea_confirmation(to_email: str, name: str, idea_preview: str):
    """Send confirmation email after idea submission."""
    if not resend.api_key:
        print("⚠️ RESEND_EMAIL_API_KEY not set — skipping email")
        return

    display_name = name if name else "there"
    body = f"""
      <h2 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#020617;">
        Your idea is in good hands, {display_name}! 💡
      </h2>
      <p style="margin:0 0 24px;color:#64748B;font-size:15px;line-height:1.6;">
        We've received your idea submission. Our team will review it and reach out if it's a strong fit for our studio model.
      </p>

      <div style="background:#F0F7FF;border-left:4px solid #005AE2;border-radius:4px 12px 12px 4px;padding:20px 24px;margin-bottom:32px;">
        <p style="margin:0 0 8px;font-size:12px;font-weight:800;color:#005AE2;text-transform:uppercase;letter-spacing:0.08em;">Your Idea</p>
        <p style="margin:0;font-size:14px;color:#334155;">{idea_preview[:200] + '...' if len(idea_preview) > 200 else idea_preview}</p>
      </div>

      <p style="margin:0 0 24px;color:#64748B;font-size:14px;line-height:1.6;">
        We evaluate ideas based on market size, technical feasibility, and founder-market fit. Expect to hear from us within <strong style="color:#005AE2;">5–7 business days</strong>.
      </p>

      <p style="margin:0;color:#94A3B8;font-size:13px;">
        Best regards,<br>
        <strong style="color:#334155;">The Crestcode Team</strong>
      </p>
    """

    try:
        resend.Emails.send({
            "from": FROM_EMAIL,
            "to": [to_email],
            "subject": "We received your idea! 💡",
            "html": _base_template("Idea Received - Crestcode", body)
        })
        print(f"✅ Idea confirmation email sent to {to_email}")
    except Exception as e:
        print(f"❌ Failed to send idea email: {e}")


def send_talent_confirmation(to_email: str, first_name: str, interest: str):
    """Send confirmation email after talent/careers form submission."""
    if not resend.api_key:
        print("⚠️ RESEND_EMAIL_API_KEY not set — skipping email")
        return

    body = f"""
      <h2 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#020617;">
        Application received, {first_name}! 🎯
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

    try:
        resend.Emails.send({
            "from": FROM_EMAIL,
            "to": [to_email],
            "subject": f"Application received, {first_name}! We'll be in touch 🎯",
            "html": _base_template("Application Received - Crestcode", body)
        })
        print(f"✅ Talent confirmation email sent to {to_email}")
    except Exception as e:
        print(f"❌ Failed to send talent email: {e}")


def send_investor_confirmation(to_email: str, full_name: str, expertise: str):
    """Send confirmation email after investor form submission."""
    if not resend.api_key:
        print("⚠️ RESEND_EMAIL_API_KEY not set — skipping email")
        return

    body = f"""
      <h2 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#020617;">
        Welcome to the network, {full_name}! 🤝
      </h2>
      <p style="margin:0 0 24px;color:#64748B;font-size:15px;line-height:1.6;">
        Thank you for expressing interest in partnering with Crestcode. We've received your investor profile and our team will review it carefully.
      </p>

      <div style="background:#F0F7FF;border-left:4px solid #005AE2;border-radius:4px 12px 12px 4px;padding:20px 24px;margin-bottom:32px;">
        <p style="margin:0 0 8px;font-size:12px;font-weight:800;color:#005AE2;text-transform:uppercase;letter-spacing:0.08em;">Your Profile</p>
        <p style="margin:0;font-size:14px;color:#334155;"><strong>Expertise:</strong> {expertise or 'Not specified'}</p>
      </div>

      <p style="margin:0 0 24px;color:#64748B;font-size:14px;line-height:1.6;">
        We'll reach out within <strong style="color:#005AE2;">3–5 business days</strong> to schedule an introductory call.
      </p>

      <p style="margin:0;color:#94A3B8;font-size:13px;">
        Best regards,<br>
        <strong style="color:#334155;">The Crestcode Team</strong>
      </p>
    """

    try:
        resend.Emails.send({
            "from": FROM_EMAIL,
            "to": [to_email],
            "subject": "Investor Profile Received - Crestcode 🤝",
            "html": _base_template("Investor Profile Received - Crestcode", body)
        })
        print(f"✅ Investor confirmation email sent to {to_email}")
    except Exception as e:
        print(f"❌ Failed to send investor email: {e}")
