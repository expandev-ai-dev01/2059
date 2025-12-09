/**
 * @summary
 * Default values and constants for Contact Form entity.
 * Provides centralized configuration for validation limits and urgency levels.
 *
 * @module constants/contactForm/contactFormDefaults
 */

/**
 * @interface ContactFormLimitsType
 * @description Validation constraints for Contact Form fields.
 *
 * @property {number} NOME_MIN_LENGTH - Minimum characters for name field (5)
 * @property {number} NOME_MAX_LENGTH - Maximum characters for name field (100)
 * @property {number} EMAIL_MAX_LENGTH - Maximum characters for email field (100)
 * @property {number} RAZAO_SOCIAL_MIN_LENGTH - Minimum characters for company name (5)
 * @property {number} RAZAO_SOCIAL_MAX_LENGTH - Maximum characters for company name (150)
 * @property {number} DESCRICAO_MIN_LENGTH - Minimum characters for description (20)
 * @property {number} DESCRICAO_MAX_LENGTH - Maximum characters for description (2000)
 */
export const CONTACT_FORM_LIMITS = {
  NOME_MIN_LENGTH: 5,
  NOME_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 100,
  RAZAO_SOCIAL_MIN_LENGTH: 5,
  RAZAO_SOCIAL_MAX_LENGTH: 150,
  DESCRICAO_MIN_LENGTH: 20,
  DESCRICAO_MAX_LENGTH: 2000,
} as const;

/** Type representing the CONTACT_FORM_LIMITS constant */
export type ContactFormLimitsType = typeof CONTACT_FORM_LIMITS;

/**
 * @interface ContactFormUrgencyLevelsType
 * @description Available urgency levels for contact form submissions.
 *
 * @property {string} BAIXA - Low urgency level ('Baixa')
 * @property {string} MEDIA - Medium urgency level ('Média')
 * @property {string} ALTA - High urgency level ('Alta')
 * @property {string} EMERGENCIAL - Emergency urgency level ('Emergencial')
 */
export const CONTACT_FORM_URGENCY_LEVELS = {
  BAIXA: 'Baixa',
  MEDIA: 'Média',
  ALTA: 'Alta',
  EMERGENCIAL: 'Emergencial',
} as const;

/** Type representing the CONTACT_FORM_URGENCY_LEVELS constant */
export type ContactFormUrgencyLevelsType = typeof CONTACT_FORM_URGENCY_LEVELS;
