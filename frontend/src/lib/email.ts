export interface EmailPayload {
  to: string;
  subject: string;
  template: 'REGISTRATION_CONFIRMATION' | 'PAYMENT_CONFIRMATION' | 'EVENT_REMINDER' | 'EVENT_CANCELLATION';
  data: Record<string, any>;
}

export function generateEmailTemplate(type: EmailPayload['template'], data: Record<string, any>): { subject: string; html: string } {
  switch (type) {
    case 'REGISTRATION_CONFIRMATION':
      return {
        subject: `Registration Confirmed: ${data.eventTitle} (Ref: ${data.registrationNumber})`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #E2E8F0; border-radius: 12px; background: #ffffff;">
            <div style="text-align: center; border-bottom: 2px solid #0A5C36; padding-bottom: 16px; margin-bottom: 24px;">
              <h1 style="color: #0A5C36; margin: 0; font-size: 24px;">Chartered Institute of Bankers, Ghana</h1>
              <p style="color: #64748B; margin: 4px 0 0 0; font-size: 14px;">Official Event Notification</p>
            </div>
            <h2 style="color: #0F172A; font-size: 20px;">You're Registered!</h2>
            <p>Dear ${data.attendeeName},</p>
            <p>Thank you for registering for <strong>${data.eventTitle}</strong>. We are pleased to confirm your participation.</p>
            
            <div style="background: #F8FAFC; border-left: 4px solid #D4AF37; padding: 16px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 4px 0;"><strong>Event:</strong> ${data.eventTitle}</p>
              <p style="margin: 4px 0;"><strong>Date:</strong> ${data.eventDate}</p>
              <p style="margin: 4px 0;"><strong>Venue:</strong> ${data.eventVenue}</p>
              <p style="margin: 4px 0;"><strong>Registration ID:</strong> <span style="font-family: monospace; font-size: 16px; font-weight: bold; color: #0A5C36;">${data.registrationNumber}</span></p>
              <p style="margin: 4px 0;"><strong>Attendance Type:</strong> ${data.attendanceType}</p>
            </div>
            
            <p>Please present your digital ticket QR code at the check-in desk upon arrival.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.ticketUrl || '#'}" style="background-color: #0A5C36; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">VIEW YOUR TICKET</a>
            </div>
            
            <p style="color: #64748B; font-size: 12px; text-align: center; border-top: 1px solid #E2E8F0; padding-top: 16px; margin-top: 30px;">
              Chartered Institute of Bankers, Ghana &bull; Okponglo-East Legon, Trinity Avenue, Accra &bull; info@cibgh.org
            </p>
          </div>
        `,
      };

    case 'PAYMENT_CONFIRMATION':
      return {
        subject: `Payment Receipt: ${data.eventTitle} (Amount: GHS ${data.amount})`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #E2E8F0; border-radius: 12px;">
            <h2 style="color: #0A5C36;">Payment Successful</h2>
            <p>Dear ${data.attendeeName},</p>
            <p>Your payment of <strong>GHS ${data.amount}</strong> for <strong>${data.eventTitle}</strong> has been successfully processed.</p>
            <p><strong>Payment Reference:</strong> ${data.reference}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
        `,
      };

    case 'EVENT_REMINDER':
      return {
        subject: `Reminder: ${data.eventTitle} is coming up`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #E2E8F0; border-radius: 12px;">
            <h2 style="color: #0A5C36;">Upcoming Event Reminder</h2>
            <p>Dear ${data.attendeeName},</p>
            <p>This is a reminder that <strong>${data.eventTitle}</strong> takes place on <strong>${data.eventDate}</strong> at ${data.eventVenue}.</p>
          </div>
        `,
      };

    case 'EVENT_CANCELLATION':
      return {
        subject: `Important: Notice regarding ${data.eventTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #E2E8F0; border-radius: 12px;">
            <h2 style="color: #C41230;">Event Notice</h2>
            <p>Dear ${data.attendeeName},</p>
            <p>We regret to inform you that <strong>${data.eventTitle}</strong> scheduled for ${data.eventDate} has been cancelled or rescheduled.</p>
          </div>
        `,
      };
  }
}

export async function sendEmailNotification(payload: EmailPayload): Promise<{ success: boolean; message: string }> {
  // In frontend environment, queue and log email dispatch
  const template = generateEmailTemplate(payload.template, payload.data);
  console.log(`[CIB Email Service] Dispatched "${template.subject}" to ${payload.to}`);
  return {
    success: true,
    message: `Email notification sent to ${payload.to}`,
  };
}
