import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockRequests, getStatusColor, getStatusText } from '@/data/mockData';
import { DollarSign, Eye, Calendar, Package } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  
  // Filter open requests that need quotes
  const openRequests = mockRequests.filter(req => req.status === 'ABERTA');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Painel do Funcionário</h1>
          <p className="text-muted-foreground">
            Solicitações aguardando orçamento
          </p>
        </div>
        <Button onClick={() => navigate('/employee/requests')} variant="outline">
          Ver todas as solicitações
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-status-open rounded-full"></div>
              <p className="text-sm font-medium">Abertas</p>
            </div>
            <p className="text-2xl font-bold">
              {mockRequests.filter(r => r.status === 'ABERTA').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-status-quoted rounded-full"></div>
              <p className="text-sm font-medium">Orçadas</p>
            </div>
            <p className="text-2xl font-bold">
              {mockRequests.filter(r => r.status === 'ORÇADA').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-status-approved rounded-full"></div>
              <p className="text-sm font-medium">Aprovadas</p>
            </div>
            <p className="text-2xl font-bold">
              {mockRequests.filter(r => r.status === 'APROVADA').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-status-finalized rounded-full"></div>
              <p className="text-sm font-medium">Finalizadas</p>
            </div>
            <p className="text-2xl font-bold">
              {mockRequests.filter(r => r.status === 'FINALIZADA').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Open Requests */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Solicitações Abertas</h2>
        
        {openRequests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                Não há solicitações abertas no momento
              </p>
              <Button onClick={() => navigate('/employee/requests')} variant="outline">
                Ver todas as solicitações
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {openRequests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{request.equipment}</CardTitle>
                      <CardDescription>
                        Cliente: {request.clientName} • {format(new Date(request.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(request.status)}>
                      {getStatusText(request.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Categoria</p>
                          <p className="text-sm text-muted-foreground">{request.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Solicitado em</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(request.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-1">Problema relatado:</p>
                      <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                        {request.defectDescription}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/employee/requests`)}
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Ver detalhes
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => navigate(`/employee/quote/${request.id}`)}
                        className="gap-2"
                      >
                        <DollarSign className="h-4 w-4" />
                        Efetuar Orçamento
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;