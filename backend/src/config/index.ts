import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: (process.env.NODE_ENV || 'development') === 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  // Supabase
  supabase: {
    url: process.env.SUPABASE_URL || 'https://ijfjuezgvroyhtwcnlrx.supabase.co',
    anonKey:
      process.env.SUPABASE_ANON_KEY ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqZmp1ZXpndnJveWh0d2NubHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMjIzNzQsImV4cCI6MjEwNTg5ODM3NH0.cbzToWOHT5DeYbtXDqG_lt_Lfxsb3Y-eJaQkC5UJW40',
    serviceRoleKey:
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqZmp1ZXpndnJveWh0d2NubHJ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDMyMjM3NCwiZXhwIjoyMTA1ODk4Mzc0fQ.LKsElhVQb7kY4Xek5SvoTwTpZ1rsuWbjSBX7-SlMP9k',
  },

  // Paystack
  paystack: {
    secretKey: process.env.PAYSTACK_SECRET_KEY || 'sk_test_cib_ghana_paystack_secret_key',
    publicKey: process.env.PAYSTACK_PUBLIC_KEY || 'pk_test_cib_ghana_paystack_public_key',
  },

  // Email Service (Resend or SMTP via Nodemailer)
  email: {
    apiKey: process.env.RESEND_API_KEY || '',
    fromEmail: process.env.FROM_EMAIL || 'CIB Ghana <cibghevent@resend.dev>',
    replyTo: process.env.REPLY_TO_EMAIL || 'cibghevent@cibghana.org',
    smtp: {
      host: process.env.SMTP_HOST || '',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
      from: process.env.SMTP_FROM || 'CIB Ghana <cibghevent@cibghana.org>',
    },
  },
};

