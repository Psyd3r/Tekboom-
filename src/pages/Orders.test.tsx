import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Orders from './Orders';
import { useOrders } from '@/hooks/useOrders';
import { toast } from '@/components/ui/sonner';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock de `useOrders` sem tipar explicitamente o tipo `Order`
jest.mock('@/hooks/useOrders', () => ({
  useOrders: jest.fn(),
}));

describe('Orders Component', () => {
  const mockHandleUpdateStatus = jest.fn();
  const mockHandleDeleteOrder = jest.fn();

  beforeEach(() => {
    // Mock de useOrders com objetos simples e propriedades completas, incluindo `total_amount`
    (useOrders as jest.Mock).mockReturnValue({
      orders: [
        {
          id: '1',
          customer: { full_name: 'John Doe', email: 'john@example.com' },
          status: 'pending',
          created_at: new Date().toISOString(),
          total_amount: 100.50,  // Definindo total_amount
          items_count: 3, // Adicionei também o items_count como exemplo
        },
        {
          id: '2',
          customer: { full_name: 'Jane Doe', email: 'jane@example.com' },
          status: 'shipped',
          created_at: new Date().toISOString(),
          total_amount: 200.75,  // Definindo total_amount
          items_count: 2,
        },
        {
          id: '3',
          customer: { full_name: 'Bill Gates', email: 'bill@example.com' },
          status: 'delivered',
          created_at: new Date().toISOString(),
          total_amount: 150.00,  // Definindo total_amount
          items_count: 5,
        },
      ],
      loading: false,
      handleUpdateStatus: mockHandleUpdateStatus,
      handleDeleteOrder: mockHandleDeleteOrder,
    });
  });

  test('deve renderizar corretamente o componente', () => {
    render(
      <Router>
        <Orders />
      </Router>
    );

    expect(screen.getByText('Gerenciamento de Pedidos')).toBeInTheDocument();
    expect(screen.getByText('Todos os Pedidos')).toBeInTheDocument();
    expect(screen.getByText('Últimos 7 dias')).toBeInTheDocument();
    expect(screen.getByText('Pendentes')).toBeInTheDocument();
  });

  // Adicione os outros testes conforme necessário...
});
