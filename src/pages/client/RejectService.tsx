import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { mockRequests } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, X, AlertTriangle } from 'lucide-react';

const RejectService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  
  const request = mockRequests.find(req => req.id === id);

  if (!request || request.status !== 'ORÇADA') {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Solicitação não encontrada ou não disponível para rejeição</p>
        <Button onClick={() => navigate('/client')} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update request status (in real app, would be done via API)
    const requestIndex = mockRequests.findIndex(req => req.id === id);
    if (requestIndex !== -1) {
      mockRequests[requestIndex].status = 'REJEITADA';
      mockRequests[requestIndex].rejectionReason = reason;
    }

    toast({
      title: "Orçamento rejeitado",
      description: "O orçamento foi rejeitado. Você pode resgatar a solicitação quando desejar.",
      variant: "destructive",
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
          <h1 className="text-2xl font-bold">Rejeitar Orçamento</h1>
          <p className="text-muted-foreground">
            Informe o motivo da rejeição do orçamento
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <X className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-xl">Rejeitar Orçamento</CardTitle>
          <CardDescription>
            Você está prestes a rejeitar o orçamento de R$ {request.price?.toFixed(2)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleReject} className="space-y-6">
            <div className="bg-muted p-4 rounded-lg">
              <div className="space-y-2">
                <p className="text-sm font-medium">Equipamento: {request.equipment}</p>
                <p className="text-sm text-muted-foreground">Técnico: {request.assignedEmployee}</p>
                <p className="text-sm text-muted-foreground">Valor: R$ {request.price?.toFixed(2)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Motivo da rejeição *</Label>
              <Textarea
                id="reason"
                placeholder="Informe o motivo da rejeição do orçamento..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                rows={4}
                maxLength={300}
              />
              <p className="text-xs text-muted-foreground">
                {reason.length}/300 caracteres
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-900 mb-1">Atenção</h3>
                  <p className="text-sm text-amber-800">
                    Após rejeitar, você poderá resgatar esta solicitação futuramente se desejar.
                    O equipamento ficará disponível para novo orçamento.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/client/quote/${id}`)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="destructive"
                className="gap-2"
                disabled={loading || !reason.trim()}
              >
                <X className="h-4 w-4" />
                {loading ? 'Rejeitando...' : 'Confirmar Rejeição'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RejectService;