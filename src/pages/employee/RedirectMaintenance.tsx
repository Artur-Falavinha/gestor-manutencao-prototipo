import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { mockRequests, mockEmployees } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, UserPlus, Package, User, DollarSign } from 'lucide-react';

const RedirectMaintenance = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [loading, setLoading] = useState(false);
  
  const request = mockRequests.find(req => req.id === id);
  const availableEmployees = mockEmployees.filter(emp => emp.id !== user?.id);

  if (!request || !['APROVADA', 'REDIRECIONADA'].includes(request.status)) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Solicitação não encontrada ou não disponível para redirecionamento</p>
        <Button onClick={() => navigate('/employee/requests')} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  const handleRedirect = async () => {
    if (!selectedEmployee) {
      toast({
        title: "Erro",
        description: "Selecione um funcionário",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update request with new employee (in real app, would be done via API)
    const requestIndex = mockRequests.findIndex(req => req.id === id);
    const newEmployee = mockEmployees.find(emp => emp.id === selectedEmployee);
    
    if (requestIndex !== -1 && newEmployee) {
      mockRequests[requestIndex].status = 'REDIRECIONADA';
      mockRequests[requestIndex].redirectedEmployee = newEmployee.name;
      mockRequests[requestIndex].assignedEmployee = newEmployee.name;
    }

    toast({
      title: "Solicitação redirecionada",
      description: `A manutenção foi redirecionada para ${newEmployee?.name}`,
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
          onClick={() => navigate(`/employee/maintenance/${id}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Redirecionar Manutenção</h1>
          <p className="text-muted-foreground">
            Transfira a responsabilidade para outro técnico
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Dados da Solicitação</CardTitle>
          <CardDescription>
            Informações do equipamento que será redirecionado
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
            <h3 className="font-medium mb-2">Problema relatado</h3>
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">{request.defectDescription}</p>
            </div>
          </div>

          <Separator />

          {/* Employee Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employee">Selecionar novo responsável *</Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um técnico disponível" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {availableEmployees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-xs text-muted-foreground">{employee.specialization}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedEmployee && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                {(() => {
                  const employee = mockEmployees.find(emp => emp.id === selectedEmployee);
                  return (
                    <div>
                      <h3 className="font-medium text-blue-900 mb-2">Técnico selecionado</h3>
                      <div className="text-sm text-blue-800 space-y-1">
                        <p><strong>Nome:</strong> {employee?.name}</p>
                        <p><strong>Email:</strong> {employee?.email}</p>
                        <p><strong>Especialização:</strong> {employee?.specialization}</p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
            <h3 className="font-medium text-amber-900 mb-2">Importante</h3>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• O novo técnico será notificado sobre a responsabilidade</li>
              <li>• O cliente será informado sobre a mudança</li>
              <li>• O orçamento aprovado será mantido</li>
              <li>• Você não terá mais acesso a esta solicitação</li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => navigate(`/employee/maintenance/${id}`)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleRedirect}
              disabled={loading || !selectedEmployee}
              className="gap-2"
            >
              <UserPlus className="h-4 w-4" />
              {loading ? 'Redirecionando...' : 'Confirmar Redirecionamento'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RedirectMaintenance;