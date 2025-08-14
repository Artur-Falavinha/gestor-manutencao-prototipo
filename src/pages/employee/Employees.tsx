import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { mockEmployees, Employee } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, User, Mail, Phone, Wrench } from 'lucide-react';

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([...mockEmployees]);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: ''
  });
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: ''
  });
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddEmployee = async () => {
    if (!newEmployee.name.trim() || !newEmployee.email.trim() || !newEmployee.phone.trim() || !newEmployee.specialization.trim()) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(newEmployee.email)) {
      toast({
        title: "Erro",
        description: "Email inválido",
        variant: "destructive",
      });
      return;
    }

    if (employees.some(emp => emp.email.toLowerCase() === newEmployee.email.toLowerCase())) {
      toast({
        title: "Erro",
        description: "Já existe um funcionário com este email",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const employee: Employee = {
      id: (employees.length + 10).toString(),
      name: newEmployee.name.trim(),
      email: newEmployee.email.trim(),
      phone: newEmployee.phone.trim(),
      specialization: newEmployee.specialization.trim()
    };

    setEmployees([...employees, employee]);
    setNewEmployee({ name: '', email: '', phone: '', specialization: '' });
    setDialogOpen(false);
    setLoading(false);

    toast({
      title: "Funcionário adicionado",
      description: `${employee.name} foi cadastrado com sucesso`,
    });
  };

  const handleEditEmployee = async () => {
    if (!editData.name.trim() || !editData.email.trim() || !editData.phone.trim() || !editData.specialization.trim()) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(editData.email)) {
      toast({
        title: "Erro",
        description: "Email inválido",
        variant: "destructive",
      });
      return;
    }

    if (employees.some(emp => emp.id !== editingEmployee?.id && emp.email.toLowerCase() === editData.email.toLowerCase())) {
      toast({
        title: "Erro",
        description: "Já existe um funcionário com este email",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    setEmployees(employees.map(emp => 
      emp.id === editingEmployee?.id 
        ? { 
            ...emp, 
            name: editData.name.trim(),
            email: editData.email.trim(),
            phone: editData.phone.trim(),
            specialization: editData.specialization.trim()
          }
        : emp
    ));

    setEditingEmployee(null);
    setEditData({ name: '', email: '', phone: '', specialization: '' });
    setEditDialogOpen(false);
    setLoading(false);

    toast({
      title: "Funcionário atualizado",
      description: `Os dados de ${editData.name} foram atualizados`,
    });
  };

  const handleDeleteEmployee = async (employee: Employee) => {
    if (!confirm(`Tem certeza que deseja excluir o funcionário "${employee.name}"?`)) {
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    setEmployees(employees.filter(emp => emp.id !== employee.id));
    setLoading(false);

    toast({
      title: "Funcionário excluído",
      description: `${employee.name} foi removido do sistema`,
      variant: "destructive",
    });
  };

  const openEditDialog = (employee: Employee) => {
    setEditingEmployee(employee);
    setEditData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      specialization: employee.specialization
    });
    setEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Funcionários</h1>
          <p className="text-muted-foreground">
            Gerencie a equipe técnica de manutenção
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Funcionário
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Funcionário</DialogTitle>
              <DialogDescription>
                Cadastre um novo técnico na equipe
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  placeholder="Nome do funcionário"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  placeholder="(11) 99999-9999"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Especialização</Label>
                <Input
                  id="specialization"
                  placeholder="Ex: Eletrônicos e Informática"
                  value={newEmployee.specialization}
                  onChange={(e) => setNewEmployee({...newEmployee, specialization: e.target.value})}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAddEmployee}
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? 'Adicionando...' : 'Adicionar'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {employees.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Nenhum funcionário cadastrado
              </p>
              <Button onClick={() => setDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Cadastrar primeiro funcionário
              </Button>
            </CardContent>
          </Card>
        ) : (
          employees.map((employee) => (
            <Card key={employee.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <div>
                        <CardTitle className="text-xl">{employee.name}</CardTitle>
                        <CardDescription>ID: {employee.id}</CardDescription>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{employee.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{employee.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Wrench className="h-4 w-4 text-muted-foreground" />
                          <span>{employee.specialization}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditDialog(employee)}
                      disabled={loading}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteEmployee(employee)}
                      disabled={loading}
                      className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Funcionário</DialogTitle>
            <DialogDescription>
              Altere os dados do funcionário
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editName">Nome completo</Label>
              <Input
                id="editName"
                placeholder="Nome do funcionário"
                value={editData.name}
                onChange={(e) => setEditData({...editData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editEmail">Email</Label>
              <Input
                id="editEmail"
                type="email"
                placeholder="email@exemplo.com"
                value={editData.email}
                onChange={(e) => setEditData({...editData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editPhone">Telefone</Label>
              <Input
                id="editPhone"
                placeholder="(11) 99999-9999"
                value={editData.phone}
                onChange={(e) => setEditData({...editData, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editSpecialization">Especialização</Label>
              <Input
                id="editSpecialization"
                placeholder="Ex: Eletrônicos e Informática"
                value={editData.specialization}
                onChange={(e) => setEditData({...editData, specialization: e.target.value})}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                className="flex-1"
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleEditEmployee}
                className="flex-1"
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="text-center text-sm text-muted-foreground">
        Total de funcionários: {employees.length}
      </div>
    </div>
  );
};

export default Employees;