import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { mockRequests, getStatusColor, getStatusText } from '@/data/mockData';
import { Plus, Eye, DollarSign, RefreshCw, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ClientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Filter requests for current user
  const userRequests = mockRequests.filter(req => req.clientId === user?.id);

  const getActionButton = (request: any) => {
    switch (request.status) {
      case 'ORÇADA':
        return (
          <Button 
            size="sm" 
            onClick={() => navigate(`/client/quote/${request.id}`)}
            className="gap-2"
          >
            <DollarSign className="h-4 w-4" />
            Aprovar/Rejeitar
          </Button>
        );
      case 'REJEITADA':
        return (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => navigate(`/client`)}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Resgatar
          </Button>
        );
      case 'ARRUMADA':
        return (
          <Button 
            size="sm" 
            className="gap-2 bg-success hover:bg-success/90"
            onClick={() => navigate(`/client/pay/${request.id}`)}
          >
            <CheckCircle className="h-4 w-4" />
            Pagar
          </Button>
        );
      default:
        return (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => navigate(`/client/request/${request.id}`)}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            Visualizar
          </Button>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Minhas Solicitações</h1>
          <p className="text-muted-foreground">
            Gerencie suas solicitações de manutenção
          </p>
        </div>
        <Button onClick={() => navigate('/client/new-request')} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Solicitação
        </Button>
      </div>

      {userRequests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              Você ainda não possui solicitações de manutenção
            </p>
            <Button onClick={() => navigate('/client/new-request')} className="gap-2">
              <Plus className="h-4 w-4" />
              Criar primeira solicitação
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {userRequests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {request.equipment.length > 30 
                        ? `${request.equipment.substring(0, 30)}...` 
                        : request.equipment
                      }
                    </CardTitle>
                    <CardDescription>
                      {format(new Date(request.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(request.status)}>
                    {getStatusText(request.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Categoria: {request.category}</p>
                    {request.price && (
                      <p className="text-sm text-muted-foreground">
                        Valor: R$ {request.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                  {getActionButton(request)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;