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
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },

  // Paystack
  paystack: {
    secretKey: process.env.PAYSTACK_SECRET_KEY || 'sk_test_demo_paystack_secret_key',
    publicKey: process.env.PAYSTACK_PUBLIC_KEY || 'pk_test_demo_paystack_public_key',
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

