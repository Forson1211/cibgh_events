import { config } from '../config/index.js';
import { DigitalTicket, Registration } from '../types/index.js';
import nodemailer, { type Transporter } from 'nodemailer';
import fs from 'fs';
import path from 'path';

export interface PaymentEmailOptions {
  registration: Registration;
  ticket: DigitalTicket;
  eventTitle?: string;
  eventVenue?: string;
  eventDate?: string;
}

export interface EmailDispatchResult {
  success: boolean;
  messageId?: string;
  method: 'SMTP' | 'RESEND' | 'SIMULATED';
  recipient: string;
  previewUrl?: string;
  error?: string;
}

export class EmailService {
  private static transporter: Transporter | null = null;

  /**
   * Initializes or returns a cached Nodemailer SMTP transporter if SMTP is configured
   */
  private static getSmtpTransporter(): Transporter | null {
    if (this.transporter) return this.transporter;

    const { host, port, secure, user, pass } = config.email.smtp;
    if (host && user && pass) {
      try {
        this.transporter = nodemailer.createTransport({
          host,
          port,
          secure,
          auth: { user, pass },
          tls: { rejectUnauthorized: false },
        });
        console.log(`[EmailService] Nodemailer SMTP transport initialized for host: ${host}:${port}`);
        return this.transporter;
      } catch (err) {
        console.error('[EmailService] Failed to initialize Nodemailer SMTP transport:', err);
        return null;
      }
    }
    return null;
  }

  /**
   * Helper to check if a Resend API key is valid (not empty and not a placeholder)
   */
  private static isRealResendKey(key?: string): boolean {
    if (!key) return false;
    const lower = key.toLowerCase();
    if (
      lower.includes('your_resend') ||
      lower.includes('re_cib_ghana_resend_api_key') ||
      lower.includes('placeholder') ||
      lower.length < 15
    ) {
      return false;
    }
    return key.startsWith('re_');
  }

  /**
   * Helper to format payment method for human readability
   */
  private static formatPaymentMethod(method?: string): string {
    switch (method) {
      case 'PAYSTACK_CARD':
        return 'Card Payment (Paystack Gateway)';
      case 'PAYSTACK_MOMO':
        return 'Mobile Money (MTN / Telecel / AT)';
      case 'BANK_TRANSFER':
        return 'Direct Bank Transfer';
      case 'COMPLIMENTARY':
        return 'Complimentary VIP Pass';
      default:
        return 'Electronic Payment (Paystack)';
    }
  }

  /**
   * Formats a number to GHS currency
   */
  private static formatCurrency(amount: number, currency = 'GHS'): string {
    return `${currency} ${Number(amount || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  /**
   * Dispatches branded registration & payment confirmation receipt with digital ticket pass
   */
  static async sendPaymentConfirmation(options: PaymentEmailOptions): Promise<EmailDispatchResult> {
    const { registration, ticket } = options;
    const recipient = registration.email;
    const attendeeName = `${registration.first_name} ${registration.last_name}`.trim();
    const eventTitle = options.eventTitle || ticket.event_title || registration.event_title || '30th National Banking & Ethics Conference 2026';
    const eventVenue = options.eventVenue || ticket.event_venue || 'Aqua Safari Resort Convention Pavilion, Ada Foah';
    const eventDate = options.eventDate || ticket.event_date || 'November 8 - 10, 2026';
    const regNumber = registration.registration_number || ticket.registration_number;
    const amountFormatted = this.formatCurrency(registration.total_amount, registration.currency || 'GHS');
    const paymentRef = registration.payment_reference || `PAY_${Date.now()}`;
    const paymentMethodLabel = this.formatPaymentMethod(registration.payment_method);
    const dateFormatted = new Date(registration.created_at || Date.now()).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const ticketPassUrl = `${config.clientUrl}/events/30th-national-banking-ethics-conference-2026/ticket/${encodeURIComponent(regNumber)}`;
    const qrImageUrl = ticket.qr_code_data?.startsWith('data:image')
      ? ticket.qr_code_data
      : `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(regNumber)}`;

    const subject = `Payment Confirmed & Pass Issued: ${eventTitle} (Ref: ${regNumber})`;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Receipt & Accreditation Pass - CIB Ghana</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px 12px; color: #1e293b; line-height: 1.6; }
          .email-card { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
          .header { background: #03254C; background-image: linear-gradient(135deg, #03254C 0%, #0A5C36 100%); color: #ffffff; padding: 36px 24px; text-align: center; }
          .header-badge { display: inline-block; padding: 5px 14px; background: #C5A059; color: #03254C; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; border-radius: 9999px; margin-bottom: 12px; }
          .title { font-size: 22px; font-weight: 800; margin: 0 0 6px 0; letter-spacing: -0.5px; color: #ffffff; line-height: 1.3; }
          .subtitle { margin: 0; opacity: 0.9; font-size: 13px; color: #f8fafc; }
          .content { padding: 32px 28px; }
          .receipt-hero { background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 10px; padding: 18px 20px; text-align: center; margin-bottom: 26px; }
          .receipt-status { display: inline-flex; align-items: center; gap: 6px; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #065f46; margin-bottom: 6px; }
          .receipt-amount { font-size: 28px; font-weight: 900; color: #065f46; margin: 0; }
          .section-title { font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #64748b; margin: 24px 0 12px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
          .table-details { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 14px; }
          .table-details td { padding: 8px 0; vertical-align: top; }
          .label-col { color: #64748b; font-weight: 500; width: 42%; }
          .val-col { font-weight: 700; color: #0f172a; text-align: right; }
          .qr-box { text-align: center; padding: 24px; background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; margin: 28px 0; }
          .qr-img { width: 170px; height: 170px; border-radius: 8px; background: #ffffff; padding: 8px; border: 1px solid #e2e8f0; display: block; margin: 0 auto; }
          .btn-cta { display: block; width: fit-content; margin: 20px auto 0 auto; background: #1B7E3E; color: #ffffff !important; padding: 14px 32px; font-weight: 800; font-size: 14px; text-decoration: none; border-radius: 8px; letter-spacing: 0.5px; text-transform: uppercase; text-align: center; }
          .notice-box { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 14px 16px; font-size: 13px; color: #92400e; border-radius: 4px; margin: 24px 0; }
          .footer { background: #f8fafc; padding: 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
          .footer p { margin: 4px 0; }
        </style>
      </head>
      <body>
        <div class="email-card">
          <!-- Header -->
          <div class="header">
            <span class="header-badge">Official Payment Receipt & Digital Pass</span>
            <h1 class="title">${eventTitle}</h1>
            <p class="subtitle">Chartered Institute of Bankers, Ghana • Established under Act 991</p>
          </div>

          <!-- Body -->
          <div class="content">
            <p style="font-size: 15px; margin-top: 0;">
              Dear <strong>${attendeeName}</strong>,
            </p>
            <p style="font-size: 14px; color: #334155;">
              Thank you for registering. We are pleased to confirm that your payment has been processed successfully. Below is your official tax receipt and delegate accreditation pass.
            </p>

            <!-- Payment Receipt Box -->
            <div class="receipt-hero">
              <div class="receipt-status">
                <span>&#10004;</span> Payment Verified & Confirmed
              </div>
              <div class="receipt-amount">${amountFormatted}</div>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #047857; font-weight: 500;">
                Transaction Reference: <strong style="font-family: monospace;">${paymentRef}</strong>
              </p>
            </div>

            <!-- Payment Breakdown -->
            <div class="section-title">Payment Transaction Summary</div>
            <table class="table-details">
              <tr>
                <td class="label-col">Amount Paid:</td>
                <td class="val-col" style="color: #065f46;">${amountFormatted}</td>
              </tr>
              <tr>
                <td class="label-col">Payment Channel:</td>
                <td class="val-col">${paymentMethodLabel}</td>
              </tr>
              <tr>
                <td class="label-col">Payment Status:</td>
                <td class="val-col" style="color: #065f46;">SUCCESSFUL / PAID</td>
              </tr>
              <tr>
                <td class="label-col">Transaction Date:</td>
                <td class="val-col">${dateFormatted}</td>
              </tr>
              <tr>
                <td class="label-col">Settlement Currency:</td>
                <td class="val-col">${registration.currency || 'GHS'}</td>
              </tr>
            </table>

            <!-- Delegate & Event Summary -->
            <div class="section-title">Delegate & Conference Details</div>
            <table class="table-details">
              <tr>
                <td class="label-col">Delegate Name:</td>
                <td class="val-col">${attendeeName}</td>
              </tr>
              <tr>
                <td class="label-col">Registration Number:</td>
                <td class="val-col" style="font-family: monospace; color: #03254C; font-size: 15px;">${regNumber}</td>
              </tr>
              <tr>
                <td class="label-col">Organization:</td>
                <td class="val-col">${registration.organization || 'Chartered Banking Professional'}</td>
              </tr>
              <tr>
                <td class="label-col">Package / Tier:</td>
                <td class="val-col">${registration.registration_type_name || ticket.registration_tier || 'Delegate Package'}</td>
              </tr>
              <tr>
                <td class="label-col">Membership Tier:</td>
                <td class="val-col">${registration.membership_category || 'CIB Associate'}</td>
              </tr>
              <tr>
                <td class="label-col">Event Dates:</td>
                <td class="val-col">${eventDate}</td>
              </tr>
              <tr>
                <td class="label-col">Venue:</td>
                <td class="val-col">${eventVenue}</td>
              </tr>
            </table>

            <!-- Digital Pass & QR Code Section -->
            <div class="qr-box">
              <h3 style="margin: 0 0 6px 0; font-size: 16px; font-weight: 800; color: #03254C;">
                Your Official Digital Entry Pass
              </h3>
              <p style="margin: 0 0 16px 0; font-size: 12px; color: #64748b;">
                Present this scannable QR code at the registration desk for priority accreditation
              </p>
              <img src="${qrImageUrl}" alt="Accreditation QR Pass" class="qr-img" />
              <p style="margin: 12px 0 0 0; font-family: monospace; font-size: 15px; font-weight: 800; color: #03254C;">
                ${regNumber}
              </p>
              <a href="${ticketPassUrl}" class="btn-cta">
                View & Download Live Ticket Pass
              </a>
            </div>

            <!-- Venue & Check-in Advisory -->
            <div class="notice-box">
              <strong>Check-in Notice:</strong> Registration and delegate room check-in begins at 08:30 GMT on Sunday, 8th November 2026 at Aqua Safari Resort Convention Pavilion, Ada Foah. Please keep this email accessible on your mobile phone.
            </div>

            <p style="font-size: 13px; color: #64748b; margin-bottom: 0;">
              If you have any questions or require special assistance, please contact the CIB Ghana Secretariat at <a href="mailto:events@cibghana.org" style="color: #1B7E3E; font-weight: bold;">events@cibghana.org</a> or call <strong>+233 (0) 302 543 456</strong>.
            </p>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p><strong>Chartered Institute of Bankers, Ghana</strong></p>
            <p>Okponglo-East Legon, Trinity Avenue, P.O. Box AN 14455, Accra, Ghana</p>
            <p>Tel: +233 (0) 302 543 456 | Email: info@cibgh.org | Web: www.cibgh.org</p>
            <p style="font-size: 11px; color: #94a3b8; margin-top: 10px;">
              This email serves as an official proof of payment and tax receipt under the Chartered Institute of Bankers, Ghana Act 2019 (Act 991).
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const plainText = `
CHARTERED INSTITUTE OF BANKERS, GHANA
OFFICIAL PAYMENT RECEIPT & ACCREDITATION PASS
==============================================
Event: ${eventTitle}
Registration Number: ${regNumber}
Delegate: ${attendeeName}
Organization: ${registration.organization || 'N/A'}
Amount Paid: ${amountFormatted}
Payment Reference: ${paymentRef}
Payment Method: ${paymentMethodLabel}
Payment Status: SUCCESSFUL
Dates: ${eventDate}
Venue: ${eventVenue}

Live Ticket Link: ${ticketPassUrl}

Please present your registration number (${regNumber}) or digital QR pass upon arrival at the registration desk.

Support & Inquiries:
Email: events@cibghana.org | info@cibgh.org
Phone: +233 (0) 302 543 456
Address: Okponglo-East Legon, Trinity Avenue, Accra, Ghana
    `.trim();

    // 1. Try Nodemailer SMTP if configured
    const smtpTransporter = this.getSmtpTransporter();
    if (smtpTransporter) {
      try {
        const info = await smtpTransporter.sendMail({
          from: config.email.smtp.from || config.email.fromEmail,
          to: recipient,
          subject,
          text: plainText,
          html: htmlContent,
        });

        console.log(`[EmailService] Sent payment confirmation via SMTP to ${recipient} (Message ID: ${info.messageId})`);
        return {
          success: true,
          messageId: info.messageId,
          method: 'SMTP',
          recipient,
        };
      } catch (smtpErr: any) {
        console.error('[EmailService] SMTP send error, checking fallbacks:', smtpErr.message);
      }
    }

    // 2. Try Resend API if real API key configured
    if (this.isRealResendKey(config.email.apiKey)) {
      try {
        let fromAddress = config.email.fromEmail || 'CIB Ghana <cibghevent@resend.dev>';
        if (!fromAddress.includes('<')) {
          fromAddress = `CIB Ghana <${fromAddress}>`;
        }
        const replyToAddress = config.email.replyTo || 'cibghevent@cibghana.org';

        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${config.email.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromAddress,
            reply_to: replyToAddress,
            to: recipient,
            subject,
            text: plainText,
            html: htmlContent,
          }),
        });

        const resendData: any = await resendRes.json();
        if (resendRes.ok) {
          console.log(`[EmailService] Sent payment confirmation via Resend from "${fromAddress}" to ${recipient} (ID: ${resendData?.id})`);
          return {
            success: true,
            messageId: resendData?.id,
            method: 'RESEND',
            recipient,
          };
        } else if (resendRes.status === 403 && resendData?.message?.includes('own email address')) {
          const testRecipient = process.env.RESEND_TEST_RECIPIENT || 'forsonodonkor1211@gmail.com';
          console.log(`[EmailService] Resend sandbox mode: Forwarding confirmation email to verified account (${testRecipient}) for attendee ${recipient}`);
          const fallbackRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${config.email.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: fromAddress,
              reply_to: replyToAddress,
              to: testRecipient,
              subject: `[Delegate: ${recipient}] ${subject}`,
              text: `[Delivered to account owner ${testRecipient} during Resend sandbox mode]\n\n` + plainText,
              html: `<div style="background:#fef3c7;padding:10px 16px;border-bottom:1px solid #f59e0b;font-size:12px;color:#92400e;text-align:center;"><strong>[Sandbox Notice]</strong> Delivered to verified owner (${testRecipient}) for registered attendee: <strong>${recipient}</strong></div>` + htmlContent,
            }),
          });
          const fallbackData: any = await fallbackRes.json();
          if (fallbackRes.ok) {
            console.log(`[EmailService] Delivered via Resend from "${fromAddress}" to ${testRecipient} (ID: ${fallbackData?.id})`);
            return {
              success: true,
              messageId: fallbackData?.id,
              method: 'RESEND',
              recipient: testRecipient,
            };
          }
        } else {
          console.warn('[EmailService] Resend API responded with error:', resendData);
        }
      } catch (resendErr: any) {
        console.error('[EmailService] Resend API fetch failed:', resendErr.message);
      }
    }

    // 3. Fallback / Dev Mode: High-fidelity simulation & preview generation
    try {
      const previewDir = path.resolve(process.cwd(), 'scratch', 'email_previews');
      if (!fs.existsSync(previewDir)) {
        fs.mkdirSync(previewDir, { recursive: true });
      }
      const previewFilePath = path.join(previewDir, `receipt_${regNumber}.html`);
      fs.writeFileSync(previewFilePath, htmlContent, 'utf-8');
      console.log(`[EmailService] Simulation: Payment confirmation email generated for ${recipient}`);
      console.log(`  -> Pass: ${regNumber} | Amount: ${amountFormatted} | Ref: ${paymentRef}`);
      console.log(`  -> Preview saved to: ${previewFilePath}`);
    } catch {
      // Ignored if file write fails in production container
    }

    return {
      success: true,
      method: 'SIMULATED',
      recipient,
      messageId: `sim_${Date.now()}_${regNumber}`,
    };
  }

  /**
   * Backward-compatible ticket confirmation method
   */
  static async sendTicketConfirmation(ticket: DigitalTicket): Promise<boolean> {
    const mockRegistration: Registration = {
      id: ticket.registration_id,
      event_id: ticket.event_id,
      event_title: ticket.event_title,
      registration_number: ticket.registration_number,
      registration_type_id: 'default',
      registration_type_name: ticket.registration_tier,
      first_name: ticket.attendee_name.split(' ')[0] || 'Esteemed',
      last_name: ticket.attendee_name.split(' ').slice(1).join(' ') || 'Delegate',
      email: ticket.attendee_email,
      phone: '',
      organization: ticket.organization,
      job_title: 'Delegate',
      country: 'Ghana',
      attendance_type: ticket.attendance_type,
      total_amount: 5600,
      currency: 'GHS',
      payment_status: 'SUCCESSFUL',
      payment_reference: `PAY_${Date.now()}`,
      check_in_status: ticket.check_in_status,
      created_at: ticket.issue_date || new Date().toISOString(),
    };

    const res = await this.sendPaymentConfirmation({
      registration: mockRegistration,
      ticket,
      eventTitle: ticket.event_title,
      eventVenue: ticket.event_venue,
      eventDate: ticket.event_date,
    });

    return res.success;
  }
}
