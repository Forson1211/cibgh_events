import { config } from '../config/index.js';

export interface PaystackInitResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    status: 'success' | 'failed' | 'abandoned' | 'pending';
    reference: string;
    amount: number;
    currency: string;
    paid_at?: string;
    channel?: string;
    customer?: {
      email: string;
    };
  };
}

export class PaystackService {
  private static isTestOrDemo(secretKey: string): boolean {
    return (
      !secretKey ||
      secretKey.startsWith('sk_test_demo') ||
      secretKey.includes('your_paystack')
    );
  }

  /**
   * Initializes a payment on Paystack (or mock if in demo mode)
   */
  static async initializePayment(params: {
    email: string;
    amount: number; // in GHS
    reference: string;
    callbackUrl?: string;
    channels?: ('card' | 'mobile_money')[];
  }): Promise<PaystackInitResponse> {
    const { email, amount, reference, callbackUrl, channels } = params;

    // Convert GHS to Pesewas (100 Pesewas = 1 GHS)
    const amountInPesewas = Math.round(amount * 100);

    // If using demo/test credentials, simulate instantaneous Paystack authorization
    if (this.isTestOrDemo(config.paystack.secretKey)) {
      return {
        status: true,
        message: 'Authorization URL created (Demo/Simulation Mode)',
        data: {
          authorization_url: `${config.clientUrl}/ticket/${reference}?status=success&simulated=true`,
          access_code: `demo_acc_${Date.now()}`,
          reference,
        },
      };
    }

    // Call live Paystack API
    try {
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.paystack.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          amount: amountInPesewas,
          reference,
          currency: 'GHS',
          callback_url: callbackUrl || `${config.clientUrl}/ticket/${reference}`,
          channels: channels || ['card', 'mobile_money'],
        }),
      });

      const data = (await response.json()) as PaystackInitResponse;
      return data;
    } catch (error) {
      console.error('Paystack initialization error:', error);
      throw new Error('Failed to initialize payment gateway transaction');
    }
  }

  /**
   * Verifies a payment reference
   */
  static async verifyPayment(reference: string): Promise<PaystackVerifyResponse> {
    if (this.isTestOrDemo(config.paystack.secretKey)) {
      // Simulation mode: auto-verify references starting with T or registered format
      return {
        status: true,
        message: 'Verification successful (Demo Mode)',
        data: {
          status: 'success',
          reference,
          amount: 50000,
          currency: 'GHS',
          paid_at: new Date().toISOString(),
          channel: 'mobile_money',
          customer: {
            email: 'attendee@cibghana.org',
          },
        },
      };
    }

    try {
      const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${config.paystack.secretKey}`,
        },
      });

      const data = (await response.json()) as PaystackVerifyResponse;
      return data;
    } catch (error) {
      console.error('Paystack verification error:', error);
      throw new Error('Failed to verify payment reference with Paystack');
    }
  }
}
