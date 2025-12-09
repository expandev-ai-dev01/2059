import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DOMPurify from 'dompurify';
import { contactFormSchema } from '../../validations/contact';
import type { ContactFormInput, ContactFormOutput } from '../../types';
import { useContactSubmit } from '../../hooks/useContactSubmit';
import { Button } from '@/core/components/button';
import { Input } from '@/core/components/input';
import { Textarea } from '@/core/components/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/select';
import { Checkbox } from '@/core/components/checkbox';
import { Label } from '@/core/components/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/card';
import { Alert, AlertDescription } from '@/core/components/alert';
import { Loader2, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useNavigation } from '@/core/hooks/useNavigation';
import { toast } from 'sonner';

type AreaJuridica =
  | 'Direito Civil'
  | 'Direito Trabalhista'
  | 'Direito Empresarial'
  | 'Direito Tributário'
  | 'Direito Penal'
  | 'Direito de Família'
  | 'Direito Imobiliário'
  | 'Outro';

function ContactForm() {
  const { navigate } = useNavigation();
  const [showSuccess, setShowSuccess] = useState(false);
  const { mutateAsync: submitContact, isPending } = useContactSubmit();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContactFormInput, unknown, ContactFormOutput>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onBlur',
    defaultValues: {
      tipo_pessoa: 'Física',
      nivel_urgencia: 'Média',
      preferencia_contato: 'Email',
      horario_preferencial: 'Tarde (12h-18h)',
      aceite_termos: false,
      aceite_newsletter: false,
      captcha: '',
    },
  });

  const tipoPessoa = watch('tipo_pessoa');

  const onSubmit = async (data: ContactFormOutput) => {
    try {
      const sanitizedData = {
        ...data,
        descricao_necessidade: DOMPurify.sanitize(data.descricao_necessidade),
        razao_social: data.razao_social ? DOMPurify.sanitize(data.razao_social) : undefined,
      };

      const response = await submitContact(sanitizedData);

      setShowSuccess(true);
      toast.success('Formulário enviado com sucesso!', {
        description: `Protocolo: ${response.protocol}`,
      });

      setTimeout(() => {
        navigate(
          `/obrigado?protocol=${response.protocol}&name=${encodeURIComponent(
            data.nome_completo
          )}&urgency=${data.nivel_urgencia}`
        );
      }, 2000);
    } catch (error) {
      toast.error('Erro ao enviar formulário', {
        description: 'Por favor, tente novamente mais tarde.',
      });
    }
  };

  if (showSuccess) {
    return (
      <Card className="mx-auto w-full max-w-2xl">
        <CardContent className="flex flex-col items-center justify-center gap-4 py-12">
          <CheckCircle2 className="h-16 w-16 text-green-600" />
          <h2 className="text-2xl font-bold">Formulário Enviado!</h2>
          <p className="text-muted-foreground text-center">
            Redirecionando para página de agradecimento...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-4xl shadow-lg">
      <CardHeader className="space-y-2">
        <CardTitle className="text-3xl font-bold">Entre em Contato</CardTitle>
        <CardDescription className="text-base">
          Preencha o formulário abaixo e nossa equipe entrará em contato em breve.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Tipo de Pessoa */}
          <div className="space-y-2">
            <Label htmlFor="tipo_pessoa">Tipo de Pessoa *</Label>
            <Select
              value={tipoPessoa}
              onValueChange={(value) => setValue('tipo_pessoa', value as 'Física' | 'Jurídica')}
            >
              <SelectTrigger id="tipo_pessoa" className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Física">Pessoa Física</SelectItem>
                <SelectItem value="Jurídica">Pessoa Jurídica</SelectItem>
              </SelectContent>
            </Select>
            {errors.tipo_pessoa && (
              <p className="text-destructive text-sm">{errors.tipo_pessoa.message}</p>
            )}
          </div>

          {/* Nome Completo */}
          <div className="space-y-2">
            <Label htmlFor="nome_completo">Nome Completo *</Label>
            <Input
              id="nome_completo"
              {...register('nome_completo')}
              placeholder="Digite seu nome completo"
              aria-invalid={!!errors.nome_completo}
            />
            {errors.nome_completo && (
              <p className="text-destructive text-sm">{errors.nome_completo.message}</p>
            )}
          </div>

          {/* Email e Telefone */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="seu@email.com"
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                {...register('telefone')}
                placeholder="(00) 00000-0000"
                aria-invalid={!!errors.telefone}
              />
              {errors.telefone && (
                <p className="text-destructive text-sm">{errors.telefone.message}</p>
              )}
            </div>
          </div>

          {/* CPF ou CNPJ/Razão Social */}
          {tipoPessoa === 'Física' ? (
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                {...register('cpf')}
                placeholder="000.000.000-00"
                aria-invalid={!!errors.cpf}
              />
              {errors.cpf && <p className="text-destructive text-sm">{errors.cpf.message}</p>}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input
                  id="cnpj"
                  {...register('cnpj')}
                  placeholder="00.000.000/0000-00"
                  aria-invalid={!!errors.cnpj}
                />
                {errors.cnpj && <p className="text-destructive text-sm">{errors.cnpj.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="razao_social">Razão Social *</Label>
                <Input
                  id="razao_social"
                  {...register('razao_social')}
                  placeholder="Nome da empresa"
                  aria-invalid={!!errors.razao_social}
                />
                {errors.razao_social && (
                  <p className="text-destructive text-sm">{errors.razao_social.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Área Jurídica */}
          <div className="space-y-2">
            <Label htmlFor="area_juridica">Área Jurídica de Interesse *</Label>
            <Select onValueChange={(value) => setValue('area_juridica', value as AreaJuridica)}>
              <SelectTrigger id="area_juridica" className="w-full">
                <SelectValue placeholder="Selecione a área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Direito Civil">Direito Civil</SelectItem>
                <SelectItem value="Direito Trabalhista">Direito Trabalhista</SelectItem>
                <SelectItem value="Direito Empresarial">Direito Empresarial</SelectItem>
                <SelectItem value="Direito Tributário">Direito Tributário</SelectItem>
                <SelectItem value="Direito Penal">Direito Penal</SelectItem>
                <SelectItem value="Direito de Família">Direito de Família</SelectItem>
                <SelectItem value="Direito Imobiliário">Direito Imobiliário</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
              </SelectContent>
            </Select>
            {errors.area_juridica && (
              <p className="text-destructive text-sm">{errors.area_juridica.message}</p>
            )}
          </div>

          {/* Descrição da Necessidade */}
          <div className="space-y-2">
            <Label htmlFor="descricao_necessidade">Descrição da Necessidade Jurídica *</Label>
            <Textarea
              id="descricao_necessidade"
              {...register('descricao_necessidade')}
              placeholder="Descreva detalhadamente sua necessidade jurídica..."
              className="min-h-32"
              aria-invalid={!!errors.descricao_necessidade}
            />
            {errors.descricao_necessidade && (
              <p className="text-destructive text-sm">{errors.descricao_necessidade.message}</p>
            )}
          </div>

          {/* Nível de Urgência */}
          <div className="space-y-2">
            <Label htmlFor="nivel_urgencia">Nível de Urgência *</Label>
            <Select
              onValueChange={(value) =>
                setValue('nivel_urgencia', value as ContactFormInput['nivel_urgencia'])
              }
            >
              <SelectTrigger id="nivel_urgencia" className="w-full">
                <SelectValue placeholder="Média" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Baixa">Baixa</SelectItem>
                <SelectItem value="Média">Média</SelectItem>
                <SelectItem value="Alta">Alta</SelectItem>
                <SelectItem value="Emergencial">Emergencial</SelectItem>
              </SelectContent>
            </Select>
            {errors.nivel_urgencia && (
              <p className="text-destructive text-sm">{errors.nivel_urgencia.message}</p>
            )}
          </div>

          {/* Preferências de Contato */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="preferencia_contato">Preferência de Contato *</Label>
              <Select
                onValueChange={(value) =>
                  setValue('preferencia_contato', value as ContactFormInput['preferencia_contato'])
                }
              >
                <SelectTrigger id="preferencia_contato" className="w-full">
                  <SelectValue placeholder="Email" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Telefone">Telefone</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="Presencial">Presencial</SelectItem>
                </SelectContent>
              </Select>
              {errors.preferencia_contato && (
                <p className="text-destructive text-sm">{errors.preferencia_contato.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="horario_preferencial">Horário Preferencial *</Label>
              <Select
                onValueChange={(value) =>
                  setValue(
                    'horario_preferencial',
                    value as ContactFormInput['horario_preferencial']
                  )
                }
              >
                <SelectTrigger id="horario_preferencial" className="w-full">
                  <SelectValue placeholder="Tarde (12h-18h)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manhã (8h-12h)">Manhã (8h-12h)</SelectItem>
                  <SelectItem value="Tarde (12h-18h)">Tarde (12h-18h)</SelectItem>
                  <SelectItem value="Noite (18h-20h)">Noite (18h-20h)</SelectItem>
                </SelectContent>
              </Select>
              {errors.horario_preferencial && (
                <p className="text-destructive text-sm">{errors.horario_preferencial.message}</p>
              )}
            </div>
          </div>

          {/* Captcha Placeholder */}
          <div className="space-y-2">
            <Label htmlFor="captcha">Verificação de Segurança *</Label>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Implementação de captcha/reCAPTCHA será adicionada aqui.
              </AlertDescription>
            </Alert>
            <Input
              id="captcha"
              {...register('captcha')}
              placeholder="Token de verificação"
              className="hidden"
            />
            {errors.captcha && <p className="text-destructive text-sm">{errors.captcha.message}</p>}
          </div>

          {/* Termos e Newsletter */}
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <Checkbox
                id="aceite_termos"
                checked={watch('aceite_termos')}
                onCheckedChange={(checked) => setValue('aceite_termos', checked as boolean)}
                aria-invalid={!!errors.aceite_termos}
              />
              <Label htmlFor="aceite_termos" className="text-sm leading-relaxed">
                Aceito os termos de uso e política de privacidade *
              </Label>
            </div>
            {errors.aceite_termos && (
              <p className="text-destructive text-sm">{errors.aceite_termos.message}</p>
            )}

            <div className="flex items-start gap-2">
              <Checkbox
                id="aceite_newsletter"
                checked={watch('aceite_newsletter')}
                onCheckedChange={(checked) => setValue('aceite_newsletter', checked as boolean)}
              />
              <Label htmlFor="aceite_newsletter" className="text-sm leading-relaxed">
                Desejo receber newsletter e conteúdo educativo
              </Label>
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isPending} className="w-full" size="lg">
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Enviar Formulário
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export { ContactForm };
