import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockRequests } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Check, DollarSign } from 'lucide-react';

const ApproveService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const request = mockRequests.find(req => req.id === id);

  if (!request || request.status !== 'ORÇADA') {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Solicitação não encontrada ou não disponível para aprovação</p>
        <Button onClick={() => navigate('/client')} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  const handleApprove = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update request status (in real app, would be done via API)
    const requestIndex = mockRequests.findIndex(req => req.id === id);
    if (requestIndex !== -1) {
      mockRequests[requestIndex].status = 'APROVADA';
    }

    toast({
      title: "Orçamento aprovado com sucesso",
      description: "A manutenção será iniciada em breve. Você será notificado quando concluída.",
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
          onClick={() => navigate(`/client/quote/${id}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Aprovar Orçamento</h1>
          <p className="text-muted-foreground">
            Confirme a aprovação do orçamento para iniciar a manutenção
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-success" />
          </div>
          <CardTitle className="text-xl">Confirmar Aprovação</CardTitle>
          <CardDescription>
            Você está prestes a aprovar o orçamento para a manutenção
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-4 rounded-lg space-y-3">
            <div>
              <p className="text-sm font-medium">Equipamento</p>
              <p className="text-sm text-muted-foreground">{request.equipment}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Técnico responsável</p>
              <p className="text-sm text-muted-foreground">{request.assignedEmployee}</p>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Valor aprovado</p>
                <p className="text-lg font-bold text-primary">R$ {request.price?.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">O que acontece após a aprovação?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• A manutenção será iniciada pelo técnico responsável</li>
              <li>• Você receberá atualizações sobre o progresso</li>
              <li>• O pagamento só será solicitado após a conclusão</li>
              <li>• Você poderá acompanhar o status na página inicial</li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => navigate(`/client/quote/${id}`)}
              disabled={loading}
            >
              Voltar
            </Button>
            <Button
              className="gap-2 bg-success hover:bg-success/90"
              onClick={handleApprove}
              disabled={loading}
            >
              <Check className="h-4 w-4" />
              {loading ? 'Aprovando...' : 'Confirmar Aprovação'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApproveService;