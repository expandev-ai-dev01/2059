import { z } from 'zod';
import { contactFormSchema } from '../validations/contact';

export type ContactFormInput = z.input<typeof contactFormSchema>;
export type ContactFormOutput = z.output<typeof contactFormSchema>;

export interface ContactFormData {
  tipo_pessoa: 'Física' | 'Jurídica';
  nome_completo: string;
  email: string;
  telefone: string;
  cpf?: string;
  cnpj?: string;
  razao_social?: string;
  area_juridica: string;
  descricao_necessidade: string;
  nivel_urgencia: 'Baixa' | 'Média' | 'Alta' | 'Emergencial';
  preferencia_contato: 'Telefone' | 'Email' | 'WhatsApp' | 'Presencial';
  horario_preferencial: 'Manhã (8h-12h)' | 'Tarde (12h-18h)' | 'Noite (18h-20h)';
  aceite_termos: boolean;
  aceite_newsletter?: boolean;
  captcha: string;
}

export interface ContactSubmitResponse {
  message: string;
  protocol: string;
  redirectUrl: string;
}
