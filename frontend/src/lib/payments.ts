import { PaymentStatus } from '../types';

export interface PaystackTransaction {
  reference: string;
  registrationId: string;
  amount: number;
  currency: string;
  email: string;
  status: PaymentStatus;
  channel: 'card' | 'mobile_money' | 'bank_transfer';
  paidAt?: string;
  gatewayResponse?: string;
}

export const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_cib_ghana_demo_mode_active';

export async function processPaystackPayment(params: {
  amount: number;
  email: string;
  registrationId: string;
  channel: 'card' | 'mobile_money';
  phone?: string;
  mobileNetwork?: 'MTN' | 'VODAFONE' | 'AIRTELTIGO';
}): Promise<PaystackTransaction> {
  // Simulate network latency for payment gateway communication
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const reference = `T${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    reference,
    registrationId: params.registrationId,
    amount: params.amount,
    currency: 'GHS',
    email: params.email,
    status: 'SUCCESSFUL',
    channel: params.channel,
    paidAt: new Date().toISOString(),
    gatewayResponse: 'Approved via CIB Ghana Paystack Gateway Simulator',
  };
}
