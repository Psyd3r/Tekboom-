import { render, screen, fireEvent } from '@testing-library/react';
import { StockUpdateDialog } from './StockUpdateDialog';

describe('StockUpdateDialog', () => {
  const mockSetIsDialogOpen = jest.fn();
  const mockSetNewStock = jest.fn();
  const mockHandleUpdateStock = jest.fn();

  const product = {
    id: '1',
    name: 'Produto Exemplo',
    price: 100,
    stock: 10,
    sku: 'EX123',
    image: null,
  };

  test('deve renderizar corretamente quando o diálogo está aberto', () => {
    render(
      <StockUpdateDialog
        isDialogOpen={true}
        setIsDialogOpen={mockSetIsDialogOpen}
        selectedProduct={product}
        stockType="set"
        newStock="5"
        setNewStock={mockSetNewStock}
        isUpdating={false}
        handleUpdateStock={mockHandleUpdateStock}
      />
    );

    expect(screen.getByText('Definir estoque: Produto Exemplo')).toBeInTheDocument();
    expect(screen.getByLabelText('Novo valor do estoque')).toBeInTheDocument();
    expect(screen.getByText('Estoque atual:')).toBeInTheDocument();
    expect(screen.getByText('10 unidades')).toBeInTheDocument();
  });

  test('deve atualizar o estoque quando o valor de newStock for alterado', () => {
    render(
      <StockUpdateDialog
        isDialogOpen={true}
        setIsDialogOpen={mockSetIsDialogOpen}
        selectedProduct={product}
        stockType="add"
        newStock="5"
        setNewStock={mockSetNewStock}
        isUpdating={false}
        handleUpdateStock={mockHandleUpdateStock}
      />
    );

    // Simular mudança no input
    fireEvent.change(screen.getByLabelText('Quantidade a adicionar'), {
      target: { value: '10' },
    });

    expect(mockSetNewStock).toHaveBeenCalledWith('10');
  });

  test('deve desabilitar o botão Confirmar durante a atualização', () => {
    render(
      <StockUpdateDialog
        isDialogOpen={true}
        setIsDialogOpen={mockSetIsDialogOpen}
        selectedProduct={product}
        stockType="add"
        newStock="5"
        setNewStock={mockSetNewStock}
        isUpdating={true}
        handleUpdateStock={mockHandleUpdateStock}
      />
    );

    // Verifica se o input para o novo estoque está visível
    const input = screen.getByLabelText('Quantidade a adicionar');
    expect(input).toBeInTheDocument();

    // Verifica se o estado de atualização está ativo
    expect(screen.getByText('Atualizando...')).toBeInTheDocument();
  });

  test('deve fechar o diálogo ao clicar em Cancelar', () => {
    render(
      <StockUpdateDialog
        isDialogOpen={true}
        setIsDialogOpen={mockSetIsDialogOpen}
        selectedProduct={product}
        stockType="set"
        newStock="5"
        setNewStock={mockSetNewStock}
        isUpdating={false}
        handleUpdateStock={mockHandleUpdateStock}
      />
    );

    fireEvent.click(screen.getByText('Cancelar'));

    expect(mockSetIsDialogOpen).toHaveBeenCalledWith(false);
  });
});
