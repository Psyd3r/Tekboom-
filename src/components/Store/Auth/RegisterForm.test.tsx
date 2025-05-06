import { render, screen, fireEvent, waitFor, RenderResult } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { RegisterForm } from './RegisterForm';

// Mock do contexto de autenticação
const signUpMock = jest.fn().mockResolvedValue(true);

// Mock do toast dentro do jest.mock
jest.mock('@/components/ui/sonner', () => {
  return {
    toast: {
      error: jest.fn(),
      success: jest.fn(),
    },
  };
});

jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    signUp: signUpMock,
  }),
}));

const renderWithRouter = (ui: React.ReactElement): RenderResult => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

// Importa os mocks após a definição
import { toast } from '@/components/ui/sonner';

describe('RegisterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza todos os campos', () => {
    renderWithRouter(<RegisterForm />);
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^senha$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar senha/i)).toBeInTheDocument();
  });

  test('mostra erro se as senhas forem diferentes', () => {
    renderWithRouter(<RegisterForm />);
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'João' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'joao@email.com' } });
    fireEvent.change(screen.getByLabelText(/^senha$/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), { target: { value: 'diferente' } });

    fireEvent.click(screen.getByRole('button', { name: /criar conta de cliente/i }));

    expect(toast.error).toHaveBeenCalledWith("As senhas não coincidem.");
  });

  test('chama signUp corretamente com dados válidos', async () => {
    renderWithRouter(<RegisterForm />);

    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'João' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'joao@email.com' } });
    fireEvent.change(screen.getByLabelText(/^senha$/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), { target: { value: '123456' } });

    fireEvent.click(screen.getByRole('button', { name: /criar conta de cliente/i }));

    await waitFor(() => {
      expect(signUpMock).toHaveBeenCalledWith(
        'joao@email.com',
        '123456',
        'João',
        'customer'
      );
    });
  });
});
