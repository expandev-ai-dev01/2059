/**
 * @summary
 * Type definitions for Contact Form entity.
 *
 * @module services/contactForm/contactFormTypes
 */

/**
 * @interface ContactFormEntity
 * @description Represents a contact form submission
 */
export interface ContactFormEntity {
  id: number;
  tipo_pessoa: 'Física' | 'Jurídica';
  nome_completo: string;
  email: string;
  telefone: string;
  cpf: string | null;
  cnpj: string | null;
  razao_social: string | null;
  area_juridica: string;
  descricao_necessidade: string;
  nivel_urgencia: 'Baixa' | 'Média' | 'Alta' | 'Emergencial';
  preferencia_contato: 'Telefone' | 'Email' | 'WhatsApp' | 'Presencial';
  horario_preferencial: 'Manhã (8h-12h)' | 'Tarde (12h-18h)' | 'Noite (18h-20h)';
  aceite_termos: boolean;
  aceite_newsletter: boolean;
  data_submissao: string;
  ip_usuario: string;
  origem: string;
  protocolo: string;
}

/**
 * @interface ContactFormSubmitRequest
 * @description Request payload for submitting contact form
 */
export interface ContactFormSubmitRequest {
  tipo_pessoa: 'Física' | 'Jurídica';
  nome_completo: string;
  email: string;
  telefone: string;
  cpf?: string | null;
  cnpj?: string | null;
  razao_social?: string | null;
  area_juridica: string;
  descricao_necessidade: string;
  nivel_urgencia: 'Baixa' | 'Média' | 'Alta' | 'Emergencial';
  preferencia_contato: 'Telefone' | 'Email' | 'WhatsApp' | 'Presencial';
  horario_preferencial: 'Manhã (8h-12h)' | 'Tarde (12h-18h)' | 'Noite (18h-20h)';
  aceite_termos: boolean;
  aceite_newsletter?: boolean;
  captcha: string;
}

/**
 * @interface ContactFormSubmitResponse
 * @description Response structure for form submission
 */
export interface ContactFormSubmitResponse {
  message: string;
  protocol: string;
  redirectUrl: string;
}
