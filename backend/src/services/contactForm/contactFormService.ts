/**
 * @summary
 * Business logic for Contact Form entity.
 * Handles form submission, validation, email notifications, and lead storage.
 *
 * @module services/contactForm/contactFormService
 */

import { contactFormStore } from '@/instances';
import { ServiceError } from '@/utils';
import { ContactFormEntity, ContactFormSubmitResponse } from './contactFormTypes';
import { submitSchema } from './contactFormValidation';

/**
 * Generates a unique protocol number
 */
function generateProtocol(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `PAN-${timestamp}-${random}`;
}

/**
 * Determines return deadline based on urgency level
 */
function getReturnDeadline(urgency: string): string {
  switch (urgency) {
    case 'Emergencial':
      return 'até 4 horas úteis';
    case 'Alta':
      return 'até 24 horas úteis';
    case 'Média':
      return 'até 48 horas úteis';
    case 'Baixa':
      return 'até 72 horas úteis';
    default:
      return 'em breve';
  }
}

/**
 * Simulates captcha validation
 * In production, this would call a real captcha service (reCAPTCHA, hCaptcha, etc.)
 */
function validateCaptcha(token: string): boolean {
  // Simulate validation - in production, call external service
  return token.length > 0;
}

/**
 * Simulates sending confirmation email to client
 * In production, this would integrate with email service
 */
async function sendConfirmationEmail(
  email: string,
  name: string,
  protocol: string,
  urgency: string,
  formData: any
): Promise<void> {
  /**
   * @rule {be-email-integration}
   * Email service integration would go here
   * Example: await emailService.send({ to: email, template: 'confirmation', data: {...} })
   */
  console.log(`[EMAIL] Confirmation sent to ${email}`);
  console.log(`[EMAIL] Protocol: ${protocol}`);
  console.log(`[EMAIL] Return deadline: ${getReturnDeadline(urgency)}`);
}

/**
 * Simulates sending notification email to office team
 * In production, this would integrate with email service
 */
async function sendTeamNotification(formData: ContactFormEntity): Promise<void> {
  /**
   * @rule {be-email-integration}
   * Email service integration would go here
   * Example: await emailService.send({ to: teamEmails, template: 'new-lead', data: {...} })
   */
  console.log(`[EMAIL] Team notification sent`);
  console.log(`[EMAIL] Lead urgency: ${formData.nivel_urgencia}`);
  console.log(`[EMAIL] Legal area: ${formData.area_juridica}`);
}

/**
 * Simulates CRM integration
 * In production, this would send data to CRM or spreadsheet
 */
async function sendToCRM(formData: ContactFormEntity): Promise<void> {
  /**
   * @rule {be-crm-integration}
   * CRM integration would go here
   * Example: await crmService.createLead({ name, email, phone, ... })
   */
  console.log(`[CRM] Lead created:`);
  console.log(`[CRM] Name: ${formData.nome_completo}`);
  console.log(`[CRM] Email: ${formData.email}`);
  console.log(`[CRM] Phone: ${formData.telefone}`);
  console.log(`[CRM] Legal area: ${formData.area_juridica}`);
  console.log(`[CRM] Urgency: ${formData.nivel_urgencia}`);
}

/**
 * @summary
 * Processes contact form submission with validation, storage, and notifications.
 *
 * @function contactFormSubmit
 * @module services/contactForm
 *
 * @param {unknown} body - Raw request body to validate
 * @param {string} ipAddress - Client IP address
 * @returns {Promise<ContactFormSubmitResponse>} Submission confirmation with protocol and redirect URL
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When body fails schema validation
 * @throws {ServiceError} CAPTCHA_ERROR (400) - When captcha validation fails
 * @throws {ServiceError} SUBMISSION_ERROR (500) - When submission processing fails
 *
 * @example
 * const result = await contactFormSubmit({
 *   tipo_pessoa: 'Física',
 *   nome_completo: 'João Silva',
 *   email: 'joao@example.com',
 *   telefone: '(11) 98765-4321',
 *   cpf: '123.456.789-00',
 *   area_juridica: 'Direito Civil',
 *   descricao_necessidade: 'Preciso de orientação sobre contrato de locação...',
 *   nivel_urgencia: 'Média',
 *   preferencia_contato: 'Email',
 *   horario_preferencial: 'Tarde (12h-18h)',
 *   aceite_termos: true,
 *   captcha: 'valid-token'
 * }, '192.168.1.1');
 * // Returns: { message: '...', protocol: 'PAN-1234567890-1234', redirectUrl: '/obrigado?p=...' }
 */
export async function contactFormSubmit(
  body: unknown,
  ipAddress: string
): Promise<ContactFormSubmitResponse> {
  /**
   * @validation Validate request body against schema
   * @throws {ServiceError} VALIDATION_ERROR
   */
  const validation = submitSchema.safeParse(body);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const params = validation.data;

  /**
   * @validation Validate captcha token
   * @throws {ServiceError} CAPTCHA_ERROR
   */
  if (!validateCaptcha(params.captcha)) {
    throw new ServiceError('CAPTCHA_ERROR', 'Por favor, complete a verificação de segurança', 400);
  }

  try {
    const now = new Date().toISOString();
    const protocol = generateProtocol();
    const id = contactFormStore.getNextId();

    /**
     * @rule {be-business-rule-001} Store form data with system-generated fields
     */
    const formData: ContactFormEntity = {
      id,
      tipo_pessoa: params.tipo_pessoa,
      nome_completo: params.nome_completo,
      email: params.email,
      telefone: params.telefone,
      cpf: params.cpf || null,
      cnpj: params.cnpj || null,
      razao_social: params.razao_social || null,
      area_juridica: params.area_juridica,
      descricao_necessidade: params.descricao_necessidade,
      nivel_urgencia: params.nivel_urgencia,
      preferencia_contato: params.preferencia_contato,
      horario_preferencial: params.horario_preferencial,
      aceite_termos: params.aceite_termos,
      aceite_newsletter: params.aceite_newsletter || false,
      data_submissao: now,
      ip_usuario: ipAddress,
      origem: 'landing-page',
      protocolo: protocol,
    };

    contactFormStore.add(formData);

    /**
     * @rule {be-business-rule-007} Send confirmation email to client
     */
    await sendConfirmationEmail(
      formData.email,
      formData.nome_completo,
      protocol,
      formData.nivel_urgencia,
      formData
    );

    /**
     * @rule {be-business-rule-008} Send notification to office team
     */
    await sendTeamNotification(formData);

    /**
     * @rule {be-business-rule-003} Send lead data to CRM
     */
    await sendToCRM(formData);

    /**
     * @rule {be-business-rule-019} Return redirect URL for thank you page
     */
    const redirectUrl = `/obrigado?p=${encodeURIComponent(protocol)}&n=${encodeURIComponent(
      formData.nome_completo.split(' ')[0]
    )}&u=${encodeURIComponent(formData.nivel_urgencia)}`;

    return {
      message: 'Formulário enviado com sucesso',
      protocol,
      redirectUrl,
    };
  } catch (error: any) {
    throw new ServiceError(
      'SUBMISSION_ERROR',
      'Erro ao processar formulário. Tente novamente.',
      500
    );
  }
}
