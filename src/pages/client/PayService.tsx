import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { mockRequests } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CreditCard, DollarSign, Check, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PayService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const request = mockRequests.find(req => req.id === id);

  if (!request || request.status !== 'ARRUMADA') {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Solicitação não encontrada ou não disponível para pagamento</p>
        <Button onClick={() => navigate('/client')} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  const handlePayment = async () => {
    setLoading(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update request status (in real app, would be done via API)
    const requestIndex = mockRequests.findIndex(req => req.id === id);
    if (requestIndex !== -1) {
      mockRequests[requestIndex].status = 'PAGA';
      mockRequests[requestIndex].paidAt = new Date().toISOString();
    }

    toast({
      title: "Pagamento realizado com sucesso",
      description: "Obrigado! Sua manutenção foi paga e será finalizada em breve.",
    });

    setLoading(false);
    navigate('/client');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate('/client')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Pagamento do Serviço</h1>
          <p className="text-muted-foreground">
            Sua manutenção foi concluída. Efetue o pagamento para finalizar
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-success" />
          </div>
          <CardTitle className="text-xl">Manutenção Concluída</CardTitle>
          <CardDescription>
            Seu equipamento foi reparado com sucesso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Service Summary */}
          <div className="bg-muted p-4 rounded-lg space-y-3">
            <div>
              <p className="text-sm font-medium">Equipamento</p>
              <p className="text-sm text-muted-foreground">{request.equipment}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Técnico responsável</p>
              <p className="text-sm text-muted-foreground">{request.assignedEmployee}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Data da solicitação</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(request.createdAt), "dd/MM/yyyy", { locale: ptBR })}
              </p>
            </div>
          </div>

          <Separator />

          {/* Maintenance Details */}
          {request.maintenanceDescription && (
            <>
              <div>
                <h3 className="font-medium mb-2">Serviço realizado</h3>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                  {request.maintenanceDescription}
                </p>
              </div>
            </>
          )}

          {request.orientations && (
            <>
              <div>
                <h3 className="font-medium mb-2">Orientações</h3>
                <p className="text-sm text-muted-foreground bg-blue-50 border border-blue-200 p-3 rounded-lg">
                  {request.orientations}
                </p>
              </div>
            </>
          )}

          <Separator />

          {/* Payment Amount */}
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl p-6">
              <DollarSign className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Valor a pagar</p>
                <p className="text-4xl font-bold text-primary">R$ {request.price?.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Payment Method (Simulated) */}
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-medium">Método de pagamento</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Este é um protótipo. Em um sistema real, aqui seria integrado com um gateway de pagamento 
              (cartão, PIX, boleto, etc.)
            </p>
          </div>

          {/* Confirmation Button */}
          <Button
            className="w-full gap-2 bg-success hover:bg-success/90 py-6 text-lg"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                Processando pagamento...
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5" />
                Confirmar Pagamento
              </>
            )}
          </Button>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Após o pagamento, você receberá uma confirmação e a solicitação será finalizada.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayService;