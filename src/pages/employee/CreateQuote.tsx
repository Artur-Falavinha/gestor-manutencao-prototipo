import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { mockRequests } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, DollarSign, Package, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const CreateQuote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  
  const request = mockRequests.find(req => req.id === id);

  if (!request || request.status !== 'ABERTA') {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Solicitação não encontrada ou não disponível para orçamento</p>
        <Button onClick={() => navigate('/employee')} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      toast({
        title: "Erro",
        description: "Informe um valor válido",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update request with quote (in real app, would be done via API)
    const requestIndex = mockRequests.findIndex(req => req.id === id);
    if (requestIndex !== -1) {
      mockRequests[requestIndex].status = 'ORÇADA';
      mockRequests[requestIndex].price = priceValue;
      mockRequests[requestIndex].assignedEmployee = user?.name;
    }

    toast({
      title: "Orçamento criado com sucesso",
      description: "O cliente será notificado e poderá aprovar ou rejeitar o orçamento",
    });

    setLoading(false);
    navigate('/employee');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate('/employee')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Efetuar Orçamento</h1>
          <p className="text-muted-foreground">
            Analise a solicitação e defina o valor do serviço
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Dados da Solicitação</CardTitle>
          <CardDescription>
            Revise os detalhes antes de criar o orçamento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Request Details */}
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
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Data da solicitação</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(request.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Categoria</p>
                <p className="text-sm text-muted-foreground">{request.category}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Problem Description */}
          <div>
            <h3 className="font-medium mb-2">Problema relatado pelo cliente</h3>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">{request.defectDescription}</p>
            </div>
          </div>

          <Separator />

          {/* Quote Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="price">Valor do orçamento (R$) *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Informe o valor total para a manutenção do equipamento
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Informações importantes</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• O cliente receberá uma notificação sobre o orçamento</li>
                <li>• Ele poderá aprovar ou rejeitar o valor proposto</li>
                <li>• Após aprovação, você poderá iniciar a manutenção</li>
                <li>• O pagamento só será solicitado após conclusão do serviço</li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/employee')}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="gap-2"
                disabled={loading || !price}
              >
                <DollarSign className="h-4 w-4" />
                {loading ? 'Criando...' : 'Criar Orçamento'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateQuote;