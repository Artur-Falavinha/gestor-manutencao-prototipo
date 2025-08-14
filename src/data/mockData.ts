export interface Category {
  id: string;
  name: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
}

export interface MaintenanceRequest {
  id: string;
  clientId: string;
  clientName: string;
  equipment: string;
  category: string;
  defectDescription: string;
  createdAt: string;
  status: 'ABERTA' | 'ORÇADA' | 'REJEITADA' | 'APROVADA' | 'REDIRECIONADA' | 'ARRUMADA' | 'PAGA' | 'FINALIZADA';
  price?: number;
  rejectionReason?: string;
  maintenanceDescription?: string;
  orientations?: string;
  assignedEmployee?: string;
  redirectedEmployee?: string;
  paidAt?: string;
  finalizedAt?: string;
}

export const mockCategories: Category[] = [
  { id: '1', name: 'Eletrônicos' },
  { id: '2', name: 'Eletrodomésticos' },
  { id: '3', name: 'Informática' },
  { id: '4', name: 'Móveis' },
  { id: '5', name: 'Automotivo' },
];

export const mockEmployees: Employee[] = [
  {
    id: '2',
    name: 'Maria Santos',
    email: 'funcionario@email.com',
    phone: '(11) 99999-9999',
    specialization: 'Eletrônicos e Informática'
  },
  {
    id: '4',
    name: 'Ana Costa',
    email: 'ana@email.com',
    phone: '(11) 88888-8888',
    specialization: 'Eletrodomésticos'
  },
  {
    id: '5',
    name: 'Pedro Almeida',
    email: 'pedro@email.com',
    phone: '(11) 77777-7777',
    specialization: 'Automotivo e Móveis'
  },
];

export const mockRequests: MaintenanceRequest[] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'João Silva',
    equipment: 'Notebook Dell Inspiron 15',
    category: 'Informática',
    defectDescription: 'Notebook não liga, provável problema na fonte de alimentação',
    createdAt: '2024-01-15T10:30:00Z',
    status: 'ORÇADA',
    price: 150.00,
    assignedEmployee: 'Maria Santos'
  },
  {
    id: '2',
    clientId: '3',
    clientName: 'Carlos Oliveira',
    equipment: 'Geladeira Brastemp',
    category: 'Eletrodomésticos',
    defectDescription: 'Geladeira não está resfriando adequadamente',
    createdAt: '2024-01-14T14:15:00Z',
    status: 'APROVADA',
    price: 200.00,
    assignedEmployee: 'Ana Costa'
  },
  {
    id: '3',
    clientId: '1',
    clientName: 'João Silva',
    equipment: 'Smartphone Samsung Galaxy',
    category: 'Eletrônicos',
    defectDescription: 'Tela trincada após queda',
    createdAt: '2024-01-13T09:20:00Z',
    status: 'PAGA',
    price: 120.00,
    assignedEmployee: 'Maria Santos',
    maintenanceDescription: 'Substituição da tela do display',
    orientations: 'Evitar quedas e usar película protetora',
    paidAt: '2024-01-13T16:30:00Z'
  },
  {
    id: '4',
    clientId: '3',
    clientName: 'Carlos Oliveira',
    equipment: 'TV LG 50 polegadas',
    category: 'Eletrônicos',
    defectDescription: 'TV não liga, led de stand-by não acende',
    createdAt: '2024-01-12T11:45:00Z',
    status: 'REJEITADA',
    price: 300.00,
    rejectionReason: 'Preço muito alto para o reparo',
    assignedEmployee: 'Maria Santos'
  },
  {
    id: '5',
    clientId: '1',
    clientName: 'João Silva',
    equipment: 'Mesa de escritório',
    category: 'Móveis',
    defectDescription: 'Gaveta não abre, trava emperrada',
    createdAt: '2024-01-16T08:00:00Z',
    status: 'ABERTA'
  },
  {
    id: '6',
    clientId: '3',
    clientName: 'Carlos Oliveira',
    equipment: 'Ar condicionado Split',
    category: 'Eletrodomésticos',
    defectDescription: 'Não está gelando, possível vazamento de gás',
    createdAt: '2024-01-16T13:30:00Z',
    status: 'FINALIZADA',
    price: 180.00,
    assignedEmployee: 'Ana Costa',
    maintenanceDescription: 'Recarga de gás R410A e limpeza do evaporador',
    orientations: 'Realizar limpeza preventiva a cada 6 meses',
    paidAt: '2024-01-16T17:00:00Z',
    finalizedAt: '2024-01-16T18:30:00Z'
  }
];

export const getStatusColor = (status: MaintenanceRequest['status']) => {
  const statusColors = {
    'ABERTA': 'bg-status-open text-white',
    'ORÇADA': 'bg-status-quoted text-white',
    'REJEITADA': 'bg-status-rejected text-white',
    'APROVADA': 'bg-status-approved text-white',
    'REDIRECIONADA': 'bg-status-redirected text-white',
    'ARRUMADA': 'bg-status-fixed text-white',
    'PAGA': 'bg-status-paid text-white',
    'FINALIZADA': 'bg-status-finalized text-white'
  };
  return statusColors[status];
};

export const getStatusText = (status: MaintenanceRequest['status']) => {
  const statusText = {
    'ABERTA': 'Aberta',
    'ORÇADA': 'Orçada',
    'REJEITADA': 'Rejeitada',
    'APROVADA': 'Aprovada',
    'REDIRECIONADA': 'Redirecionada',
    'ARRUMADA': 'Arrumada',
    'PAGA': 'Paga',
    'FINALIZADA': 'Finalizada'
  };
  return statusText[status];
};