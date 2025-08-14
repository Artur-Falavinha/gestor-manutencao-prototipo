import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { mockRequests, getStatusColor, getStatusText } from '@/data/mockData';
import { ArrowLeft, Calendar, User, Package, Tag, FileText, DollarSign, Wrench, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ViewRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const request = mockRequests.find(req => req.id === id);

  if (!request) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Solicitação não encontrada</p>
        <Button onClick={() => navigate('/client')} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  const getHistoryItems = () => {
    const history = [
      {
        date: request.createdAt,
        title: 'Solicitação criada',
        description: 'Solicitação enviada para análise',
        icon: FileText
      }
    ];

    if (request.status !== 'ABERTA') {
      history.push({
        date: request.createdAt, // In real app, would have different timestamps
        title: 'Orçamento realizado',
        description: `Valor: R$ ${request.price?.toFixed(2)} - ${request.assignedEmployee}`,
        icon: DollarSign
      });
    }

    if (request.status === 'REJEITADA') {
      history.push({
        date: request.createdAt,
        title: 'Orçamento rejeitado',
        description: `Motivo: ${request.rejectionReason}`,
        icon: MessageSquare
      });
    }

    if (['APROVADA', 'REDIRECIONADA', 'ARRUMADA', 'PAGA', 'FINALIZADA'].includes(request.status)) {
      history.push({
        date: request.createdAt,
        title: 'Orçamento aprovado',
        description: 'Aguardando início da manutenção',
        icon: MessageSquare
      });
    }

    if (['ARRUMADA', 'PAGA', 'FINALIZADA'].includes(request.status)) {
      history.push({
        date: request.createdAt,
        title: 'Manutenção concluída',
        description: request.maintenanceDescription || 'Manutenção realizada com sucesso',
        icon: Wrench
      });
    }

    if (['PAGA', 'FINALIZADA'].includes(request.status)) {
      history.push({
        date: request.paidAt || request.createdAt,
        title: 'Pagamento realizado',
        description: `Valor pago: R$ ${request.price?.toFixed(2)}`,
        icon: DollarSign
      });
    }

    if (request.status === 'FINALIZADA') {
      history.push({
        date: request.finalizedAt || request.createdAt,
        title: 'Solicitação finalizada',
        description: 'Serviço concluído com sucesso',
        icon: FileText
      });
    }

    return history;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate('/client')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Visualizar Solicitação</h1>
          <p className="text-muted-foreground">
            Detalhes e histórico completo da solicitação
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{request.equipment}</CardTitle>
                  <CardDescription>
                    Solicitação #{request.id}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(request.status)}>
                  {getStatusText(request.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Data</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(request.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
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
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Categoria</p>
                    <p className="text-sm text-muted-foreground">{request.category}</p>
                  </div>
                </div>
                {request.assignedEmployee && (
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Responsável</p>
                      <p className="text-sm text-muted-foreground">{request.assignedEmployee}</p>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Descrição do defeito</h3>
                <p className="text-sm text-muted-foreground">{request.defectDescription}</p>
              </div>

              {request.maintenanceDescription && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">Descrição da manutenção</h3>
                    <p className="text-sm text-muted-foreground">{request.maintenanceDescription}</p>
                  </div>
                </>
              )}

              {request.orientations && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">Orientações</h3>
                    <p className="text-sm text-muted-foreground">{request.orientations}</p>
                  </div>
                </>
              )}

              {request.price && (
                <>
                  <Separator />
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm font-medium">Valor do serviço</p>
                    <p className="text-2xl font-bold text-primary">R$ {request.price.toFixed(2)}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* History Timeline */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico</CardTitle>
              <CardDescription>
                Acompanhe o progresso da sua solicitação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getHistoryItems().map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground mb-1">
                          {format(new Date(item.date), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewRequest;