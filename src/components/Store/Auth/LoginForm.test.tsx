import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { LoginForm } from './LoginForm';

// Mock do contexto de autenticação
jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    signIn: jest.fn().mockResolvedValue(true),
  }),
}));

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('LoginForm', () => {
  test('renderiza campos de e-mail e senha', () => {
    renderWithRouter(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
  });

  test('envia o formulário corretamente', () => {
    renderWithRouter(<LoginForm />);

    const emailInput = screen.getByPlaceholderText('seu@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /entrar como cliente/i });

    fireEvent.change(emailInput, { target: { value: 'teste@teste.com' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled(); // simula isLoading true
  });
});
