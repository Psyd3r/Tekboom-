import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { StockManagement } from './StockManagement';
import * as StockManagementModule from './Stock/useStockManagement';

// ✅ Mocks dos componentes internos com exportação nomeada
jest.mock('./Stock/StockHeader', () => ({
  StockHeader: () => <div>StockHeader</div>, // Mock da exportação nomeada
}));
jest.mock('./Stock/StockFilterButtons', () => ({
  StockFilterButtons: () => <div>StockFilterButtons</div>, // Mock da exportação nomeada
}));
jest.mock('./Stock/StockTable', () => ({
  StockTable: () => <div>StockTable</div>, // Mock da exportação nomeada
}));
jest.mock('./Stock/StockUpdateDialog', () => ({
  StockUpdateDialog: () => <div>StockUpdateDialog</div>, // Mock da exportação nomeada
}));

// ✅ Mock do hook useStockManagement com exportação nomeada
jest.mock('./Stock/useStockManagement', () => ({
  ...jest.requireActual('./Stock/useStockManagement'),
  useStockManagement: jest.fn(),
}));

describe('StockManagement', () => {
  test('deve renderizar corretamente os componentes internos', () => {
    (StockManagementModule.useStockManagement as jest.Mock).mockReturnValue({
      products: [],
      isLoading: false,
      isUpdating: false,
      selectedProduct: null,
      isDialogOpen: false,
      setIsDialogOpen: jest.fn(),
      newStock: 0,
      setNewStock: jest.fn(),
      stockType: 'all',
      stockFilter: 'all',
      setStockFilter: jest.fn(),
      handleOpenDialog: jest.fn(),
      handleUpdateStock: jest.fn(),
    });

    render(
      <MemoryRouter>
        <StockManagement />
      </MemoryRouter>
    );

    expect(screen.getByText(/StockHeader/i)).toBeInTheDocument();
    expect(screen.getByText(/StockFilterButtons/i)).toBeInTheDocument();
    expect(screen.getByText(/StockTable/i)).toBeInTheDocument();
  });

  test('deve renderizar StockUpdateDialog quando selectedProduct estiver definido', () => {
    (StockManagementModule.useStockManagement as jest.Mock).mockReturnValue({
      products: [],
      isLoading: false,
      isUpdating: false,
      selectedProduct: { id: 1, name: 'Produto Exemplo' },
      isDialogOpen: true,
      setIsDialogOpen: jest.fn(),
      newStock: 0,
      setNewStock: jest.fn(),
      stockType: 'all',
      stockFilter: 'all',
      setStockFilter: jest.fn(),
      handleOpenDialog: jest.fn(),
      handleUpdateStock: jest.fn(),
    });

    render(
      <MemoryRouter>
        <StockManagement />
      </MemoryRouter>
    );

    expect(screen.getByText(/StockUpdateDialog/i)).toBeInTheDocument();
  });
});
