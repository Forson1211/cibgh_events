import { EventItem, Registration, DigitalTicket, CreateRegistrationRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export class ApiClient {
  private static async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.message || `Request failed with status ${response.status}`);
      }
      return json;
    } catch (error) {
      console.warn(`[ApiClient] Failed to reach ${url}:`, error);
      throw error;
    }
  }

  // Health check
  static async checkHealth(): Promise<{ status: string; service: string; version: string; uptime: number }> {
    return this.request('/health');
  }

  // Events
  static async getEvents(params?: { category?: string; search?: string; status?: string }): Promise<{
    success: boolean;
    data: EventItem[];
  }> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.status) query.append('status', params.status);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request(`/events${qs}`);
  }

  static async getEvent(slugOrId: string): Promise<{ success: boolean; data: EventItem }> {
    return this.request(`/events/${encodeURIComponent(slugOrId)}`);
  }

  // Registrations & Digital Passes
  static async createRegistration(payload: CreateRegistrationRequest): Promise<{
    success: boolean;
    data: {
      registration: Registration;
      ticket: DigitalTicket;
    };
  }> {
    return this.request('/registrations', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  static async getRegistration(identifier: string): Promise<{
    success: boolean;
    data: {
      registration: Registration;
      ticket?: DigitalTicket;
    };
  }> {
    return this.request(`/registrations/${encodeURIComponent(identifier)}`);
  }

  static async getTicket(identifier: string): Promise<{ success: boolean; data: DigitalTicket }> {
    return this.request(`/tickets/${encodeURIComponent(identifier)}`);
  }

  static async verifyQrPass(qrData: string, eventId?: string): Promise<{
    success: boolean;
    valid: boolean;
    data: DigitalTicket;
    message?: string;
  }> {
    return this.request('/tickets/verify-qr', {
      method: 'POST',
      body: JSON.stringify({ qr_data: qrData, event_id: eventId }),
    });
  }

  static async checkInAttendee(ticketIdentifier: string): Promise<{
    success: boolean;
    message: string;
    data?: DigitalTicket;
  }> {
    return this.request(`/tickets/${encodeURIComponent(ticketIdentifier)}/check-in`, {
      method: 'POST',
    });
  }

  // Payments (Paystack)
  static async initializePayment(params: {
    registration_id: string;
    email: string;
    amount: number;
    channels?: ('card' | 'mobile_money')[];
    callback_url?: string;
  }): Promise<{
    success: boolean;
    data: {
      authorization_url: string;
      access_code: string;
      reference: string;
    };
  }> {
    return this.request('/payments/initialize', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  static async verifyPayment(reference: string): Promise<{
    success: boolean;
    message: string;
    data: any;
  }> {
    return this.request(`/payments/verify/${encodeURIComponent(reference)}`);
  }

  // Admin stats
  static async getAdminStats(): Promise<{
    success: boolean;
    data: {
      total_events: number;
      active_events: number;
      total_registrations: number;
      paid_registrations: number;
      total_revenue_ghs: number;
      checked_in_attendees: number;
    };
  }> {
    return this.request('/admin/stats');
  }
}
