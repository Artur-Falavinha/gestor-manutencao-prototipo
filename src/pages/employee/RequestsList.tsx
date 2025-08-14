import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { mockRequests, getStatusColor, getStatusText } from '@/data/mockData';
import { DollarSign, Wrench, CheckCircle, Calendar, Search, Filter } from 'lucide-react';
import { format, isToday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const RequestsList = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('TODAS');
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const getFilteredRequests = () => {
    let filtered = [...mockRequests];

    // Filter by status
    if (filter !== 'TODAS') {
      if (filter === 'HOJE') {
        filtered = filtered.filter(req => isToday(parseISO(req.createdAt)));
      } else {
        filtered = filtered.filter(req => req.status === filter);
      }
    }

    // Filter by search
    if (search) {
      filtered = filtered.filter(req => 
        req.equipment.toLowerCase().includes(search.toLowerCase()) ||
        req.clientName.toLowerCase().includes(search.toLowerCase()) ||
        req.category.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by date
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter(req => {
        const reqDate = new Date(req.createdAt);
        return reqDate.toDateString() === filterDate.toDateString();
      });
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getActionButton = (request: any) => {
    switch (request.status) {
      case 'ABERTA':
        return (
          <Button 
            size="sm" 
            onClick={() => navigate(`/employee/quote/${request.id}`)}
            className="gap-2"
          >
            <DollarSign className="h-4 w-4" />
            Efetuar Orçamento
          </Button>
        );
      case 'APROVADA':
      case 'REDIRECIONADA':
        return (
          <Button 
            size="sm" 
            onClick={() => navigate(`/employee/maintenance/${request.id}`)}
            className="gap-2"
          >
            <Wrench className="h-4 w-4" />
            Efetuar Manutenção
          </Button>
        );
      case 'PAGA':
        return (
          <Button 
            size="sm" 
            className="gap-2 bg-success hover:bg-success/90"
            onClick={() => navigate(`/employee/finalize/${request.id}`)}
          >
            <CheckCircle className="h-4 w-4" />
            Finalizar Solicitação
          </Button>
        );
      default:
        return null;
    }
  };

  const filteredRequests = getFilteredRequests();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Todas as Solicitações</h1>
        <p className="text-muted-foreground">
          Gerencie todas as solicitações de manutenção
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="TODAS">Todas</SelectItem>
                  <SelectItem value="HOJE">Hoje</SelectItem>
                  <SelectItem value="ABERTA">Aberta</SelectItem>
                  <SelectItem value="ORÇADA">Orçada</SelectItem>
                  <SelectItem value="REJEITADA">Rejeitada</SelectItem>
                  <SelectItem value="APROVADA">Aprovada</SelectItem>
                  <SelectItem value="REDIRECIONADA">Redirecionada</SelectItem>
                  <SelectItem value="ARRUMADA">Arrumada</SelectItem>
                  <SelectItem value="PAGA">Paga</SelectItem>
                  <SelectItem value="FINALIZADA">Finalizada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Data específica</label>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Equipamento, cliente, categoria..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Resultados</label>
              <div className="flex items-center h-10 px-3 bg-muted rounded-md">
                <span className="text-sm font-medium">{filteredRequests.length} solicitações</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <div className="grid gap-4">
        {filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Nenhuma solicitação encontrada com os filtros aplicados
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredRequests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{request.equipment}</CardTitle>
                    <CardDescription>
                      #{request.id} • Cliente: {request.clientName}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(request.status)}>
                    {getStatusText(request.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium">Categoria</p>
                      <p className="text-sm text-muted-foreground">{request.category}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Data</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(request.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                    {request.price && (
                      <div>
                        <p className="text-sm font-medium">Valor</p>
                        <p className="text-sm font-semibold text-primary">R$ {request.price.toFixed(2)}</p>
                      </div>
                    )}
                  </div>
                  
                  {request.assignedEmployee && (
                    <div>
                      <p className="text-sm font-medium">Técnico responsável</p>
                      <p className="text-sm text-muted-foreground">{request.assignedEmployee}</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm font-medium">Problema</p>
                    <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                      {request.defectDescription}
                    </p>
                  </div>
                  
                  {request.rejectionReason && (
                    <div>
                      <p className="text-sm font-medium text-destructive">Motivo da rejeição</p>
                      <p className="text-sm text-muted-foreground bg-destructive/5 border border-destructive/20 p-2 rounded">
                        {request.rejectionReason}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    {getActionButton(request)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default RequestsList;