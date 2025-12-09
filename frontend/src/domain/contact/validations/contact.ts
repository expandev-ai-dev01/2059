import { z } from 'zod';

const areasJuridicas = [
  'Direito Civil',
  'Direito Trabalhista',
  'Direito Empresarial',
  'Direito Tributário',
  'Direito Penal',
  'Direito de Família',
  'Direito Imobiliário',
  'Outro',
] as const;

const niveisUrgencia = ['Baixa', 'Média', 'Alta', 'Emergencial'] as const;

const preferenciasContato = ['Telefone', 'Email', 'WhatsApp', 'Presencial'] as const;

const horariosPreferenciais = ['Manhã (8h-12h)', 'Tarde (12h-18h)', 'Noite (18h-20h)'] as const;

const validateCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned.charAt(10))) return false;

  return true;
};

const validateCNPJ = (cnpj: string): boolean => {
  const cleaned = cnpj.replace(/\D/g, '');
  if (cleaned.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cleaned)) return false;

  let sum = 0;
  let pos = 5;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleaned.charAt(i)) * pos;
    pos = pos === 2 ? 9 : pos - 1;
  }
  let digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (digit !== parseInt(cleaned.charAt(12))) return false;

  sum = 0;
  pos = 6;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleaned.charAt(i)) * pos;
    pos = pos === 2 ? 9 : pos - 1;
  }
  digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (digit !== parseInt(cleaned.charAt(13))) return false;

  return true;
};

export const contactFormSchema = z
  .object({
    tipo_pessoa: z.enum(['Física', 'Jurídica'], 'Selecione o tipo de pessoa'),
    nome_completo: z
      .string('Por favor, informe seu nome completo')
      .min(5, 'Informe nome e sobrenome')
      .max(100, 'Nome muito longo'),
    email: z
      .string('Por favor, informe seu email')
      .email('Por favor, informe um email válido')
      .max(100, 'Email muito longo'),
    telefone: z
      .string('Por favor, informe seu telefone')
      .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Informe um telefone válido no formato (XX) XXXXX-XXXX'),
    cpf: z
      .string()
      .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'Informe um CPF válido')
      .refine((val) => validateCPF(val), 'Informe um CPF válido')
      .optional(),
    cnpj: z
      .string()
      .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'Informe um CNPJ válido')
      .refine((val) => validateCNPJ(val), 'Informe um CNPJ válido')
      .optional(),
    razao_social: z
      .string()
      .min(5, 'Razão social muito curta')
      .max(150, 'Razão social muito longa')
      .optional(),
    area_juridica: z.enum(areasJuridicas, 'Por favor, selecione a área jurídica de interesse'),
    descricao_necessidade: z
      .string('Por favor, descreva sua necessidade jurídica')
      .min(20, 'Por favor, forneça mais detalhes sobre sua necessidade')
      .max(2000, 'Descrição muito longa'),
    nivel_urgencia: z.enum(niveisUrgencia, 'Por favor, selecione o nível de urgência'),
    preferencia_contato: z.enum(
      preferenciasContato,
      'Por favor, selecione sua preferência de contato'
    ),
    horario_preferencial: z.enum(
      horariosPreferenciais,
      'Por favor, selecione o horário preferencial para contato'
    ),
    aceite_termos: z
      .boolean()
      .refine(
        (val) => val === true,
        'É necessário aceitar os termos de uso e política de privacidade'
      ),
    aceite_newsletter: z.boolean().default(false),
    captcha: z.string('Por favor, complete a verificação de segurança').min(1),
  })
  .refine(
    (data) => {
      if (data.tipo_pessoa === 'Física') {
        return !!data.cpf;
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
        return !!data.cnpj && !!data.razao_social;
      }
      return true;
    },
    {
      message: 'CNPJ e Razão Social são obrigatórios para pessoa jurídica',
      path: ['cnpj'],
    }
  );
