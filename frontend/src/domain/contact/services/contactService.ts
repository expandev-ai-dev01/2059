import { publicClient } from '@/core/lib/api';
import type { ContactFormOutput, ContactSubmitResponse } from '../types';

/**
 * @service ContactService
 * @domain contact
 * @type REST
 */
export const contactService = {
  /**
   * Submit contact form data
   * @param data - Contact form data
   * @returns Promise with submission response
   */
  async submit(data: ContactFormOutput): Promise<ContactSubmitResponse> {
    const response = await publicClient.post<{ success: boolean; data: ContactSubmitResponse }>(
      '/contact',
      data
    );
    return response.data.data;
  },
};
