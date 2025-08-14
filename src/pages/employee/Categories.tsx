import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { mockCategories, Category } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([...mockCategories]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState('');
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Erro",
        description: "Nome da categoria é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (categories.some(cat => cat.name.toLowerCase() === newCategoryName.toLowerCase())) {
      toast({
        title: "Erro",
        description: "Já existe uma categoria com este nome",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newCategory: Category = {
      id: (categories.length + 1).toString(),
      name: newCategoryName.trim()
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName('');
    setDialogOpen(false);
    setLoading(false);

    toast({
      title: "Categoria adicionada",
      description: `A categoria "${newCategory.name}" foi criada com sucesso`,
    });
  };

  const handleEditCategory = async () => {
    if (!editName.trim() || !editingCategory) {
      toast({
        title: "Erro",
        description: "Nome da categoria é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (categories.some(cat => cat.id !== editingCategory.id && cat.name.toLowerCase() === editName.toLowerCase())) {
      toast({
        title: "Erro",
        description: "Já existe uma categoria com este nome",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    setCategories(categories.map(cat => 
      cat.id === editingCategory.id 
        ? { ...cat, name: editName.trim() }
        : cat
    ));

    setEditingCategory(null);
    setEditName('');
    setEditDialogOpen(false);
    setLoading(false);

    toast({
      title: "Categoria atualizada",
      description: `A categoria foi renomeada para "${editName.trim()}"`,
    });
  };

  const handleDeleteCategory = async (category: Category) => {
    if (!confirm(`Tem certeza que deseja excluir a categoria "${category.name}"?`)) {
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    setCategories(categories.filter(cat => cat.id !== category.id));
    setLoading(false);

    toast({
      title: "Categoria excluída",
      description: `A categoria "${category.name}" foi removida`,
      variant: "destructive",
    });
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setEditName(category.name);
    setEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Categorias de Equipamento</h1>
          <p className="text-muted-foreground">
            Gerencie as categorias disponíveis para classificar equipamentos
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Categoria</DialogTitle>
              <DialogDescription>
                Crie uma nova categoria para classificar equipamentos
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da categoria</Label>
                <Input
                  id="name"
                  placeholder="Ex: Eletrônicos, Eletrodomésticos..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  maxLength={50}
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
                  onClick={handleAddCategory}
                  className="flex-1"
                  disabled={loading || !newCategoryName.trim()}
                >
                  {loading ? 'Adicionando...' : 'Adicionar'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {categories.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Nenhuma categoria cadastrada
              </p>
              <Button onClick={() => setDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Criar primeira categoria
              </Button>
            </CardContent>
          </Card>
        ) : (
          categories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Tag className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <CardDescription>ID: {category.id}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditDialog(category)}
                      disabled={loading}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteCategory(category)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Categoria</DialogTitle>
            <DialogDescription>
              Altere o nome da categoria
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editName">Nome da categoria</Label>
              <Input
                id="editName"
                placeholder="Ex: Eletrônicos, Eletrodomésticos..."
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                maxLength={50}
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
                onClick={handleEditCategory}
                className="flex-1"
                disabled={loading || !editName.trim()}
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="text-center text-sm text-muted-foreground">
        Total de categorias: {categories.length}
      </div>
    </div>
  );
};

export default Categories;