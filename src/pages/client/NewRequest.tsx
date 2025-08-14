import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { mockCategories, mockRequests } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Send } from 'lucide-react';

const NewRequest = () => {
  const [equipment, setEquipment] = useState('');
  const [category, setCategory] = useState('');
  const [defectDescription, setDefectDescription] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create new request (in real app, this would be sent to API)
    const newRequest = {
      id: (mockRequests.length + 1).toString(),
      clientId: user?.id || '',
      clientName: user?.name || '',
      equipment,
      category,
      defectDescription,
      createdAt: new Date().toISOString(),
      status: 'ABERTA' as const,
    };

    // Add to mock data (in real app, would be handled by API)
    mockRequests.push(newRequest);

    toast({
      title: "Solicitação criada com sucesso",
      description: "Sua solicitação foi enviada e será analisada em breve",
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
          onClick={() => navigate('/client')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Nova Solicitação</h1>
          <p className="text-muted-foreground">
            Descreva seu equipamento e o problema encontrado
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados da Solicitação</CardTitle>
          <CardDescription>
            Preencha todos os campos para criar sua solicitação de manutenção
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="equipment">Descrição do equipamento</Label>
              <Input
                id="equipment"
                placeholder="Ex: Notebook Dell Inspiron 15, TV Samsung 50 polegadas..."
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                required
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground">
                {equipment.length}/100 caracteres
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria do equipamento" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {mockCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defect">Descrição do defeito</Label>
              <Textarea
                id="defect"
                placeholder="Descreva detalhadamente o problema encontrado no equipamento..."
                value={defectDescription}
                onChange={(e) => setDefectDescription(e.target.value)}
                required
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                {defectDescription.length}/500 caracteres
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/client')}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading || !equipment || !category || !defectDescription}
                className="flex-1 gap-2"
              >
                <Send className="h-4 w-4" />
                {loading ? 'Enviando...' : 'Enviar Solicitação'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewRequest;