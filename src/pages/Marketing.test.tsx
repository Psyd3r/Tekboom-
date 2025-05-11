import { render, screen } from '@testing-library/react';
import Marketing from './Marketing';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Criação de uma instância de QueryClient
const queryClient = new QueryClient();

describe('Marketing Component', () => {
  test('deve renderizar corretamente o componente e seus elementos principais', () => {
    render(
      <Router>
        <QueryClientProvider client={queryClient}>
          <Marketing />
        </QueryClientProvider>
      </Router>
    );

    // Verifica se o título está presente
    expect(screen.getByText('Marketing')).toBeInTheDocument();

    // Verifica se as abas estão presentes
    expect(screen.getByText('Banners')).toBeInTheDocument();
    expect(screen.getByText('Logo')).toBeInTheDocument();
  });
});
