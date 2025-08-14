import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockRequests } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { Download, DollarSign, BarChart3, Calendar, TrendingUp } from 'lucide-react';
import { format, parseISO, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Reports = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { toast } = useToast();

  // Get paid and finalized requests for revenue calculation
  const paidRequests = mockRequests.filter(req => 
    ['PAGA', 'FINALIZADA'].includes(req.status) && req.price
  );

  const getFilteredRequests = () => {
    if (!startDate || !endDate) return paidRequests;

    return paidRequests.filter(req => {
      const reqDate = parseISO(req.createdAt);
      return isWithinInterval(reqDate, {
        start: new Date(startDate),
        end: new Date(endDate)
      });
    });
  };

  const getRevenueByCategory = () => {
    const filtered = getFilteredRequests();
    const revenueByCategory: { [key: string]: number } = {};

    filtered.forEach(req => {
      if (req.price) {
        revenueByCategory[req.category] = (revenueByCategory[req.category] || 0) + req.price;
      }
    });

    return Object.entries(revenueByCategory).map(([category, revenue]) => ({
      category,
      revenue,
      count: filtered.filter(req => req.category === category).length
    }));
  };

  const handleExportPDF = (reportType: string) => {
    toast({
      title: "Exportação simulada",
      description: `Em um sistema real, o relatório de ${reportType} seria exportado para PDF`,
    });
  };

  const filteredRequests = getFilteredRequests();
  const totalRevenue = filteredRequests.reduce((sum, req) => sum + (req.price || 0), 0);
  const revenueByCategory = getRevenueByCategory();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Relatórios</h1>
        <p className="text-muted-foreground">
          Análise de receitas e performance do negócio
        </p>
      </div>

      {/* Date Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Filtro por Período
          </CardTitle>
          <CardDescription>
            Selecione o período para análise dos relatórios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="startDate">Data inicial</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Data final</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                }}
                className="w-full"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
          {startDate && endDate && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                Período selecionado: {format(new Date(startDate), "dd/MM/yyyy", { locale: ptBR })} até {format(new Date(endDate), "dd/MM/yyyy", { locale: ptBR })}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="revenue">Receitas Totais</TabsTrigger>
          <TabsTrigger value="category">Receitas por Categoria</TabsTrigger>
        </TabsList>

        {/* Total Revenue Report */}
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Relatório de Receitas
                  </CardTitle>
                  <CardDescription>
                    Receitas de serviços pagos e finalizados
                  </CardDescription>
                </div>
                <Button
                  onClick={() => handleExportPDF('receitas')}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Exportar PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Receita Total</p>
                      <p className="text-2xl font-bold text-primary">R$ {totalRevenue.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium">Serviços Pagos</p>
                  <p className="text-2xl font-bold">{filteredRequests.length}</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium">Ticket Médio</p>
                  <p className="text-2xl font-bold">
                    R$ {filteredRequests.length > 0 ? (totalRevenue / filteredRequests.length).toFixed(2) : '0,00'}
                  </p>
                </div>
              </div>

              {/* Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Equipamento</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <p className="text-muted-foreground">
                            Nenhum serviço pago encontrado no período selecionado
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">#{request.id}</TableCell>
                          <TableCell>{request.clientName}</TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {request.equipment}
                          </TableCell>
                          <TableCell>{request.category}</TableCell>
                          <TableCell>
                            {format(parseISO(request.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            R$ {request.price?.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue by Category Report */}
        <TabsContent value="category" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Receitas por Categoria
                  </CardTitle>
                  <CardDescription>
                    Análise de receitas agrupadas por categoria de equipamento
                  </CardDescription>
                </div>
                <Button
                  onClick={() => handleExportPDF('receitas por categoria')}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Exportar PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Summary */}
              <div className="mb-6">
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 inline-block">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Total de Categorias</p>
                      <p className="text-2xl font-bold text-primary">{revenueByCategory.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Categoria</TableHead>
                      <TableHead className="text-center">Quantidade</TableHead>
                      <TableHead className="text-right">Receita Total</TableHead>
                      <TableHead className="text-right">Receita Média</TableHead>
                      <TableHead className="text-right">% do Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {revenueByCategory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <p className="text-muted-foreground">
                            Nenhuma receita encontrada no período selecionado
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      revenueByCategory
                        .sort((a, b) => b.revenue - a.revenue)
                        .map((item) => (
                          <TableRow key={item.category}>
                            <TableCell className="font-medium">{item.category}</TableCell>
                            <TableCell className="text-center">{item.count}</TableCell>
                            <TableCell className="text-right font-semibold">
                              R$ {item.revenue.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right">
                              R$ {(item.revenue / item.count).toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right">
                              {totalRevenue > 0 ? ((item.revenue / totalRevenue) * 100).toFixed(1) : '0'}%
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;