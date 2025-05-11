import { render, screen } from '@testing-library/react';
import StockManagementPage from '@/pages/StockManagement'; // Caminho para o seu arquivo de página
import { StockManagement } from '@/components/Products/StockManagement'; // Caminho do componente StockManagement

jest.mock('@/components/Products/StockManagement', () => ({
  StockManagement: jest.fn(() => <div>StockManagement Component</div>),
}));

describe('StockManagementPage', () => {
  test('deve renderizar o componente StockManagement', () => {
    render(<StockManagementPage />);
    
    // Verifica se o componente StockManagement foi renderizado corretamente
    expect(screen.getByText('StockManagement Component')).toBeInTheDocument();
  });
});
