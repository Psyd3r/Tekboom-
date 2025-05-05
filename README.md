
# Teekbom Store

Aplicação de e-commerce desenvolvida com React, Vite, Tailwind CSS e Supabase.

## Funcionalidades

- Gerenciamento de produtos e categorias
- Painel administrativo
- Loja virtual para clientes
- Autenticação de usuários
- Montagem de PC personalizado
- Carrinho de compras

## Implantação na Vercel

Este projeto está configurado para ser facilmente implantado na Vercel. Siga os passos abaixo:

### Método 1: Implantação Direta via GitHub

1. Crie uma conta na [Vercel](https://vercel.com/signup) caso ainda não tenha.
2. Conecte sua conta GitHub à Vercel.
3. Importe o repositório deste projeto.
4. Configure as variáveis de ambiente (se necessário):
   - `VITE_SUPABASE_URL`: URL do seu projeto Supabase
   - `VITE_SUPABASE_ANON_KEY`: Chave anônima do seu projeto Supabase
5. Clique em "Deploy" e aguarde a conclusão da implantação.

### Método 2: Usando Vercel CLI

1. Instale o Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Faça login na sua conta Vercel:
   ```bash
   vercel login
   ```
3. Na raiz do projeto, execute:
   ```bash
   vercel
   ```
4. Siga as instruções na tela para concluir a implantação.

### Configurações adicionais

O arquivo `vercel.json` na raiz do projeto já contém as configurações necessárias para garantir o funcionamento correto das rotas da aplicação na Vercel.

## Ambiente de desenvolvimento

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
