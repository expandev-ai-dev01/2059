/**
 * @summary
 * API controller for Contact Form submission.
 * Handles lead capture from potential clients.
 *
 * @module api/external/contact/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import { contactFormSubmit } from '@/services/contactForm';

/**
 * @api {post} /api/external/contact Submit Contact Form
 * @apiName SubmitContactForm
 * @apiGroup ContactForm
 *
 * @apiBody {String} tipo_pessoa Person type (Física | Jurídica)
 * @apiBody {String} nome_completo Full name (5-100 chars)
 * @apiBody {String} email Email address
 * @apiBody {String} telefone Phone number (BR format)
 * @apiBody {String} [cpf] CPF (only for Física)
 * @apiBody {String} [cnpj] CNPJ (only for Jurídica)
 * @apiBody {String} [razao_social] Company name (only for Jurídica)
 * @apiBody {String} area_juridica Legal area of interest
 * @apiBody {String} descricao_necessidade Description (20-2000 chars)
 * @apiBody {String} nivel_urgencia Urgency level (Baixa | Média | Alta | Emergencial)
 * @apiBody {String} preferencia_contato Contact preference (Telefone | Email | WhatsApp | Presencial)
 * @apiBody {String} horario_preferencial Preferred time (Manhã (8h-12h) | Tarde (12h-18h) | Noite (18h-20h))
 * @apiBody {Boolean} aceite_termos Terms acceptance (required)
 * @apiBody {Boolean} [aceite_newsletter] Newsletter opt-in
 * @apiBody {String} captcha Captcha validation token
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.message Confirmation message
 * @apiSuccess {String} data.protocol Protocol number
 * @apiSuccess {String} data.redirectUrl Thank you page URL
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR | CAPTCHA_ERROR | SUBMISSION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function submitHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await contactFormSubmit(req.body, req.ip || 'unknown');
    res.status(201).json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
