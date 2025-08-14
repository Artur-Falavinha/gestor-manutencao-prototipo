import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { mockRequests } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle, Package, User, DollarSign, Wrench, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const FinalizeRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const request = mockRequests.find(req => req.id === id);

  if (!request || request.status !== 'PAGA') {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Solicitação não encontrada ou não disponível para finalização</p>
        <Button onClick={() => navigate('/employee/requests')} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  const handleFinalize = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update request status to finalized (in real app, would be done via API)
    const requestIndex = mockRequests.findIndex(req => req.id === id);
    if (requestIndex !== -1) {
      mockRequests[requestIndex].status = 'FINALIZADA';
      mockRequests[requestIndex].finalizedAt = new Date().toISOString();
    }

    toast({
      title: "Solicitação finalizada com sucesso",
      description: "O serviço foi marcado como concluído definitivamente",
    });

    setLoading(false);
    navigate('/employee/requests');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate('/employee/requests')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Finalizar Solicitação</h1>
          <p className="text-muted-foreground">
            Confirme a finalização definitiva do serviço
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <CardTitle className="text-xl">Serviço Pago e Concluído</CardTitle>
          <CardDescription>
            O cliente já efetuou o pagamento. Confirme a finalização.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Request Summary */}
          <div className="bg-muted p-4 rounded-lg space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Equipamento</p>
                  <p className="text-sm text-muted-foreground">{request.equipment}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Cliente</p>
                  <p className="text-sm text-muted-foreground">{request.clientName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Técnico</p>
                  <p className="text-sm text-muted-foreground">{request.assignedEmployee}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Valor pago</p>
                  <p className="text-sm font-semibold text-success">R$ {request.price?.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            {request.paidAt && (
              <div className="flex items-center gap-2 pt-2 border-t">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Pagamento realizado em</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(request.paidAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Service Details */}
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Problema original</h3>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                {request.defectDescription}
              </p>
            </div>

            {request.maintenanceDescription && (
              <div>
                <h3 className="font-medium mb-2">Manutenção realizada</h3>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                  {request.maintenanceDescription}
                </p>
              </div>
            )}

            {request.orientations && (
              <div>
                <h3 className="font-medium mb-2">Orientações fornecidas</h3>
                <p className="text-sm text-muted-foreground bg-blue-50 border border-blue-200 p-3 rounded">
                  {request.orientations}
                </p>
              </div>
            )}
          </div>

          <Separator />

          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <h3 className="font-medium text-green-900 mb-2">Finalização do serviço</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• O cliente já efetuou o pagamento do serviço</li>
              <li>• A manutenção foi realizada com sucesso</li>
              <li>• Esta ação marcará a solicitação como definitivamente concluída</li>
              <li>• Não será possível reverter esta operação</li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/employee/requests')}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleFinalize}
              disabled={loading}
              className="gap-2 bg-success hover:bg-success/90"
            >
              <CheckCircle className="h-4 w-4" />
              {loading ? 'Finalizando...' : 'Finalizar Solicitação'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinalizeRequest;