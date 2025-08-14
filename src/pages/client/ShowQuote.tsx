import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { mockRequests, getStatusColor, getStatusText } from '@/data/mockData';
import { ArrowLeft, Check, X, DollarSign, Package, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ShowQuote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const request = mockRequests.find(req => req.id === id);

  if (!request || request.status !== 'ORÇADA') {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Orçamento não encontrado ou não disponível</p>
        <Button onClick={() => navigate('/client')} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold">Orçamento</h1>
          <p className="text-muted-foreground">
            Analise o orçamento e escolha aprovar ou rejeitar
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{request.equipment}</CardTitle>
              <CardDescription>
                Orçamento #{request.id}
              </CardDescription>
            </div>
            <Badge className={getStatusColor(request.status)}>
              {getStatusText(request.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Request Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Data da solicitação</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(request.createdAt), "dd/MM/yyyy", { locale: ptBR })}
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
            <div className="flex items-center gap-2 col-span-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Técnico responsável</p>
                <p className="text-sm text-muted-foreground">{request.assignedEmployee}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Defect Description */}
          <div>
            <h3 className="font-medium mb-2">Problema relatado</h3>
            <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
              {request.defectDescription}
            </p>
          </div>

          <Separator />

          {/* Price Highlight */}
          <div className="text-center py-6">
            <div className="inline-flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl p-6">
              <DollarSign className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Valor do orçamento</p>
                <p className="text-4xl font-bold text-primary">R$ {request.price?.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="gap-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => navigate(`/client/reject/${request.id}`)}
            >
              <X className="h-4 w-4" />
              Rejeitar Orçamento
            </Button>
            <Button
              className="gap-2 bg-success hover:bg-success/90"
              onClick={() => navigate(`/client/approve/${request.id}`)}
            >
              <Check className="h-4 w-4" />
              Aprovar Orçamento
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Após aprovação, a manutenção será iniciada. O pagamento só será solicitado após a conclusão do serviço.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowQuote;