import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';

// Mocks de dependências
const signInMock = jest.fn().mockResolvedValue(true);
const navigateMock = jest.fn();

// Mock do AuthContext
jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    signIn: signInMock,
    user: null,
    userRole: null,
  }),
}));

// Mock do useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => navigateMock,
}));

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza os campos de email e senha', () => {
    renderWithRouter(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar no sistema/i })).toBeInTheDocument();
  });

  test('submete o formulário com dados válidos', async () => {
    renderWithRouter(<Login />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'admin@email.com' },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByRole('button', { name: /entrar no sistema/i }));

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalledWith('admin@email.com', '123456');
    });
  });

  test('botão de login fica desativado enquanto carrega', async () => {
    renderWithRouter(<Login />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'admin@email.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: '123456' } });

    const button = screen.getByRole('button', { name: /entrar no sistema/i });
    fireEvent.click(button);

    expect(button).toBeDisabled();
  });
});
