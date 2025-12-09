import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/card';
import { Button } from '@/core/components/button';
import { CheckCircle2, Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import { useNavigation } from '@/core/hooks/useNavigation';

function ThankYouPage() {
  const [searchParams] = useSearchParams();
  const { navigate } = useNavigation();
  const [prazoRetorno, setPrazoRetorno] = useState('48 horas úteis');

  const protocol = searchParams.get('protocol') || 'N/A';
  const name = searchParams.get('name') || 'Cliente';
  const urgency = searchParams.get('urgency') || 'Média';

  useEffect(() => {
    switch (urgency) {
      case 'Emergencial':
        setPrazoRetorno('4 horas úteis');
        break;
      case 'Alta':
        setPrazoRetorno('24 horas úteis');
        break;
      case 'Média':
        setPrazoRetorno('48 horas úteis');
        break;
      case 'Baixa':
        setPrazoRetorno('72 horas úteis');
        break;
      default:
        setPrazoRetorno('48 horas úteis');
    }
  }, [urgency]);

  return (
    <div className="container mx-auto flex min-h-[80vh] items-center justify-center py-12">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold">
            Obrigado, {decodeURIComponent(name)}!
          </CardTitle>
          <CardDescription className="text-base">
            Recebemos sua solicitação e entraremos em contato em breve.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Protocol Info */}
          <div className="bg-muted rounded-lg p-4 text-center">
            <p className="text-muted-foreground text-sm">Número do Protocolo</p>
            <p className="text-2xl font-bold">{protocol}</p>
          </div>

          {/* Return Time */}
          <div className="border-primary/20 bg-primary/5 rounded-lg border-2 p-6 text-center">
            <p className="text-muted-foreground mb-2 text-sm">Prazo de Retorno</p>
            <p className="text-primary text-xl font-semibold">Retornaremos em até {prazoRetorno}</p>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-center text-lg font-semibold">Informações de Contato</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="hover:border-primary flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-all hover:shadow-md">
                <Phone className="text-primary h-6 w-6" />
                <p className="text-sm font-medium">Telefone</p>
                <p className="text-muted-foreground text-xs">(00) 0000-0000</p>
              </div>
              <div className="hover:border-primary flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-all hover:shadow-md">
                <Mail className="text-primary h-6 w-6" />
                <p className="text-sm font-medium">Email</p>
                <p className="text-muted-foreground text-xs">contato@panadvocacias.com</p>
              </div>
              <div className="hover:border-primary flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-all hover:shadow-md">
                <MapPin className="text-primary h-6 w-6" />
                <p className="text-sm font-medium">Endereço</p>
                <p className="text-muted-foreground text-xs">Rua Exemplo, 123 - Centro</p>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-center text-lg font-semibold">Siga-nos nas Redes Sociais</h3>
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="hover:border-primary hover:bg-primary h-12 w-12 rounded-full transition-all hover:scale-110 hover:text-white"
                onClick={() => window.open('https://facebook.com', '_blank')}
              >
                <Facebook className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="hover:border-primary hover:bg-primary h-12 w-12 rounded-full transition-all hover:scale-110 hover:text-white"
                onClick={() => window.open('https://instagram.com', '_blank')}
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="hover:border-primary hover:bg-primary h-12 w-12 rounded-full transition-all hover:scale-110 hover:text-white"
                onClick={() => window.open('https://linkedin.com', '_blank')}
              >
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Back Button */}
          <div className="flex justify-center pt-4">
            <Button onClick={() => navigate('/')} variant="outline" size="lg">
              Voltar para o Início
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export { ThankYouPage };
