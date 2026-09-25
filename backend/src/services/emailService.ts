import { config } from '../config/index.js';
import { DigitalTicket } from '../types/index.js';

export class EmailService {
  /**
   * Dispatches branded registration ticket pass via Resend API
   */
  static async sendTicketConfirmation(ticket: DigitalTicket): Promise<boolean> {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
          .header { background: #03254C; color: #ffffff; padding: 32px 24px; text-align: center; }
          .title { font-size: 24px; font-weight: bold; margin: 0 0 8px 0; letter-spacing: -0.5px; }
          .badge { display: inline-block; padding: 4px 12px; background: #C5A059; color: #03254C; font-weight: bold; border-radius: 9999px; font-size: 12px; text-transform: uppercase; }
          .body { padding: 32px 24px; color: #1e293b; }
          .ticket-details { background: #f1f5f9; border-radius: 12px; padding: 20px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }
          .detail-label { color: #64748b; font-weight: 500; }
          .detail-value { font-weight: 600; color: #0f172a; text-align: right; }
          .qr-section { text-align: center; margin: 28px 0; }
          .qr-img { width: 180px; height: 180px; border-radius: 8px; border: 1px solid #cbd5e1; }
          .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="badge">Official Digital Pass</span>
            <h1 class="title">${ticket.event_title}</h1>
            <p style="margin: 0; opacity: 0.9; font-size: 14px;">Chartered Institute of Bankers, Ghana</p>
          </div>
          <div class="body">
            <p>Dear <strong>${ticket.attendee_name}</strong>,</p>
            <p>Your registration is confirmed. Please present your digital pass or QR code upon arrival at the venue for instant accreditation.</p>
            
            <div class="ticket-details">
              <div class="detail-row">
                <span class="detail-label">Pass Reference:</span>
                <span class="detail-value">${ticket.registration_number}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Pass Category:</span>
                <span class="detail-value">${ticket.registration_tier}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Venue:</span>
                <span class="detail-value">${ticket.event_venue}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Dates:</span>
                <span class="detail-value">${ticket.event_date}</span>
              </div>
            </div>

            <div class="qr-section">
              <img src="${ticket.qr_code_data}" alt="Ticket QR Code" class="qr-img" />
              <p style="font-size: 12px; color: #64748b; margin-top: 8px;">Scan at the check-in desk for entry</p>
            </div>
          </div>
          <div class="footer">
            <p>© 2026 Chartered Institute of Bankers, Ghana. All rights reserved.</p>
            <p>Accra, Ghana • support@cibghana.org</p>
          </div>
        </div>
      </body>
      </html>
    `;

    if (!config.email.apiKey || config.email.apiKey.includes('your_resend')) {
      console.log(`[EmailService] Simulation: Ticket confirmation email generated for ${ticket.attendee_email} (Reg: ${ticket.registration_number})`);
      return true;
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.email.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: config.email.fromEmail,
          to: ticket.attendee_email,
          subject: `Your Pass: ${ticket.event_title} (${ticket.registration_number})`,
          html: htmlContent,
        }),
      });

      return response.ok;
    } catch (err) {
      console.error('Failed to send email via Resend:', err);
      return false;
    }
  }
}
