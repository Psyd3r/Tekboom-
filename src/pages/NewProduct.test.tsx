import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NewProduct from './NewProduct';

jest.mock('@/components/Products/ProductForm', () => ({
  ProductForm: () => <div data-testid="product-form">Formulário de Produto</div>,
}));

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('NewProduct', () => {
  test('renderiza o ProductForm', () => {
    renderWithRouter(<NewProduct />);
    expect(screen.getByTestId('product-form')).toBeInTheDocument();
  });
});
