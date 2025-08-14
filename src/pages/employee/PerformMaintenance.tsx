import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { mockRequests } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Wrench, Save, UserPlus, Package, User, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PerformMaintenance = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [maintenanceDescription, setMaintenanceDescription] = useState('');
  const [orientations, setOrientations] = useState('');
  const [loading, setLoading] = useState(false);
  
  const request = mockRequests.find(req => req.id === id);

  if (!request || !['APROVADA', 'REDIRECIONADA'].includes(request.status)) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Solicitação não encontrada ou não disponível para manutenção</p>
        <Button onClick={() => navigate('/employee/requests')} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  const handleSave = async () => {
    if (!maintenanceDescription.trim()) {
      toast({
        title: "Erro",
        description: "Descrição da manutenção é obrigatória",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update request with maintenance details (in real app, would be done via API)
    const requestIndex = mockRequests.findIndex(req => req.id === id);
    if (requestIndex !== -1) {
      mockRequests[requestIndex].status = 'ARRUMADA';
      mockRequests[requestIndex].maintenanceDescription = maintenanceDescription;
      mockRequests[requestIndex].orientations = orientations;
    }

    toast({
      title: "Manutenção concluída",
      description: "O cliente será notificado e poderá efetuar o pagamento",
    });

    setLoading(false);
    navigate('/employee/requests');
  };

  const handleRedirect = () => {
    navigate(`/employee/redirect/${id}`);
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
          <h1 className="text-2xl font-bold">Efetuar Manutenção</h1>
          <p className="text-muted-foreground">
            Realize a manutenção e documente o serviço
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Dados da Solicitação</CardTitle>
          <CardDescription>
            Informações do equipamento e orçamento aprovado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Request Summary */}
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
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Valor aprovado</p>
                <p className="text-sm font-semibold text-primary">R$ {request.price?.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Responsável</p>
                <p className="text-sm text-muted-foreground">{request.assignedEmployee}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Problem Description */}
          <div>
            <h3 className="font-medium mb-2">Problema relatado</h3>
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">{request.defectDescription}</p>
            </div>
          </div>

          <Separator />

          {/* Maintenance Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maintenance">Descrição da manutenção realizada *</Label>
              <Textarea
                id="maintenance"
                placeholder="Descreva detalhadamente os procedimentos realizados..."
                value={maintenanceDescription}
                onChange={(e) => setMaintenanceDescription(e.target.value)}
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                {maintenanceDescription.length}/500 caracteres
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="orientations">Orientações para o cliente</Label>
              <Textarea
                id="orientations"
                placeholder="Orientações sobre uso, cuidados, prevenção..."
                value={orientations}
                onChange={(e) => setOrientations(e.target.value)}
                rows={3}
                maxLength={300}
              />
              <p className="text-xs text-muted-foreground">
                {orientations.length}/300 caracteres
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
            <h3 className="font-medium text-amber-900 mb-2">Não consegue realizar a manutenção?</h3>
            <p className="text-sm text-amber-800 mb-3">
              Se não possui as ferramentas ou conhecimento necessário, você pode redirecionar para outro técnico.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRedirect}
              className="gap-2 border-amber-300 text-amber-800 hover:bg-amber-100"
            >
              <UserPlus className="h-4 w-4" />
              Redirecionar para outro técnico
            </Button>
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
              onClick={handleSave}
              disabled={loading || !maintenanceDescription.trim()}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Salvando...' : 'Salvar e Finalizar'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformMaintenance;