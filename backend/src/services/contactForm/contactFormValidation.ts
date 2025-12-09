/**
 * @summary
 * Validation schemas for Contact Form entity.
 * Centralizes all Zod validation logic for the service.
 *
 * @module services/contactForm/contactFormValidation
 */

import { z } from 'zod';
import { CONTACT_FORM_LIMITS } from '@/constants';

/**
 * CPF validation regex (XXX.XXX.XXX-XX)
 */
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

/**
 * CNPJ validation regex (XX.XXX.XXX/XXXX-XX)
 */
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

/**
 * Brazilian phone regex ((XX) XXXXX-XXXX or (XX) XXXX-XXXX)
 */
const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;

/**
 * Validates CPF checksum
 */
function validateCPF(cpf: string): boolean {
  const numbers = cpf.replace(/\D/g, '');
  if (numbers.length !== 11) return false;
  if (/^(\d)\1+$/.test(numbers)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(numbers.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(numbers.charAt(10))) return false;

  return true;
}

/**
 * Validates CNPJ checksum
 */
function validateCNPJ(cnpj: string): boolean {
  const numbers = cnpj.replace(/\D/g, '');
  if (numbers.length !== 14) return false;
  if (/^(\d)\1+$/.test(numbers)) return false;

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(numbers.charAt(i)) * weights1[i];
  }
  let digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (digit !== parseInt(numbers.charAt(12))) return false;

  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(numbers.charAt(i)) * weights2[i];
  }
  digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (digit !== parseInt(numbers.charAt(13))) return false;

  return true;
}

/**
 * Schema for contact form submission validation
 */
export const submitSchema = z
  .object({
    tipo_pessoa: z.enum(['Física', 'Jurídica']),
    nome_completo: z
      .string()
      .min(CONTACT_FORM_LIMITS.NOME_MIN_LENGTH, 'Por favor, informe seu nome completo')
      .max(CONTACT_FORM_LIMITS.NOME_MAX_LENGTH)
      .refine((val) => val.trim().split(/\s+/).length >= 2, {
        message: 'Informe nome e sobrenome',
      }),
    email: z
      .string()
      .min(1, 'Por favor, informe seu email')
      .email('Por favor, informe um email válido')
      .max(CONTACT_FORM_LIMITS.EMAIL_MAX_LENGTH),
    telefone: z
      .string()
      .min(1, 'Por favor, informe seu telefone')
      .regex(phoneRegex, 'Informe um telefone válido no formato (XX) XXXXX-XXXX'),
    cpf: z
      .string()
      .regex(cpfRegex, 'Informe um CPF válido')
      .refine(validateCPF, 'Informe um CPF válido')
      .nullable()
      .optional(),
    cnpj: z
      .string()
      .regex(cnpjRegex, 'Informe um CNPJ válido')
      .refine(validateCNPJ, 'Informe um CNPJ válido')
      .nullable()
      .optional(),
    razao_social: z
      .string()
      .min(
        CONTACT_FORM_LIMITS.RAZAO_SOCIAL_MIN_LENGTH,
        'Por favor, informe a razão social da empresa'
      )
      .max(CONTACT_FORM_LIMITS.RAZAO_SOCIAL_MAX_LENGTH)
      .nullable()
      .optional(),
    area_juridica: z.string().min(1, 'Por favor, selecione a área jurídica de interesse'),
    descricao_necessidade: z
      .string()
      .min(
        CONTACT_FORM_LIMITS.DESCRICAO_MIN_LENGTH,
        'Por favor, forneça mais detalhes sobre sua necessidade'
      )
      .max(CONTACT_FORM_LIMITS.DESCRICAO_MAX_LENGTH),
    nivel_urgencia: z.enum(['Baixa', 'Média', 'Alta', 'Emergencial']),
    preferencia_contato: z.enum(['Telefone', 'Email', 'WhatsApp', 'Presencial']),
    horario_preferencial: z.enum(['Manhã (8h-12h)', 'Tarde (12h-18h)', 'Noite (18h-20h)']),
    aceite_termos: z.literal(true, {
      errorMap: () => ({
        message: 'É necessário aceitar os termos de uso e política de privacidade',
      }),
    }),
    aceite_newsletter: z.boolean().optional().default(false),
    captcha: z.string().min(1, 'Por favor, complete a verificação de segurança'),
  })
  .refine(
    (data) => {
      if (data.tipo_pessoa === 'Física') {
        return data.cpf !== undefined && data.cpf !== null;
      }
      return true;
    },
    {
      message: 'CPF é obrigatório para pessoa física',
      path: ['cpf'],
    }
  )
  .refine(
    (data) => {
      if (data.tipo_pessoa === 'Jurídica') {
        return data.cnpj !== undefined && data.cnpj !== null;
      }
      return true;
    },
    {
      message: 'CNPJ é obrigatório para pessoa jurídica',
      path: ['cnpj'],
    }
  )
  .refine(
    (data) => {
      if (data.tipo_pessoa === 'Jurídica') {
        return data.razao_social !== undefined && data.razao_social !== null;
      }
      return true;
    },
    {
      message: 'Razão social é obrigatória para pessoa jurídica',
      path: ['razao_social'],
    }
  );

/**
 * Inferred types from schemas
 */
export type SubmitInput = z.infer<typeof submitSchema>;
