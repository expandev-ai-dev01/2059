import { useMutation } from '@tanstack/react-query';
import { contactService } from '../../services/contactService';
import type { ContactFormOutput } from '../../types';

export const useContactSubmit = () => {
  return useMutation({
    mutationFn: (data: ContactFormOutput) => contactService.submit(data),
  });
};
