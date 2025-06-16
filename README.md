# 🛒 Teekbom Store

 Teekbom Store é uma aplicação de e-commerce moderna e completa, desenvolvida para fornecer uma experiência de compra otimizada para clientes e uma plataforma robusta de gestão para administradores.

## 📋 Sobre o Projeto
O Teekbom Store é uma solução de e-commerce que combina uma loja virtual moderna com um painel administrativo completo. O sistema oferece funcionalidades avançadas como montador de PC personalizado, gestão de estoque em tempo real, sistema de carrinho e favoritos, além de uma interface administrativa intuitiva para gerenciar produtos, pedidos, clientes e usuários.

## 🏗️ Arquitetura
O projeto segue uma arquitetura baseada em componentes React com elementos do padrão MVC (Model-View-Controller) adaptado para aplicações front-end modernas:

Models: Camada de acesso a dados via Supabase
Views: Componentes React de apresentação
Controllers: Lógica de negócios e manipulação de estado
Context API: Gerenciamento de estado global
Hooks Pattern: Encapsulamento de lógica reutilizável
Principais Padrões Arquiteturais:
Component-Based Architecture (React)
Context Pattern para estado global
Custom Hooks Pattern para lógica reutilizável
Container/Presentation Pattern
Feature-Based Organization
Backend-as-a-Service (BaaS) com Supabase


## 🚀 Tecnologias Utilizadas
Frontend Core
React 18.3.1 - Biblioteca para construção de interfaces
TypeScript - Tipagem estática para JavaScript
Vite - Build tool e dev server ultrarrápido
React Router DOM 6.26.2 - Roteamento client-side


## UI/UX
Tailwind CSS 3.4.11 - Framework CSS utility-first
Shadcn/UI - Componentes de interface baseados em Radix UI
Radix UI - Primitivos de UI acessíveis e sem estilo
Framer Motion 12.9.4 - Animações e transições
Lucide React - Biblioteca de ícones
Next Themes - Suporte a temas claro/escuro


## Estado e Dados
TanStack React Query 5.56.2 - Gerenciamento de estado servidor
React Hook Form 7.53.0 - Gerenciamento de formulários
Zod 3.23.8 - Validação de esquemas TypeScript-first
Context API - Estado global da aplicação

## Backend e Banco de Dados
Supabase - Backend-as-a-Service completo
Autenticação
Banco de dados PostgreSQL
Storage de arquivos
Row Level Security (RLS)
Edge Functions
Utilitários
Date-fns 3.6.0 - Manipulação de datas
Recharts 2.12.7 - Gráficos e visualizações
Sonner 1.5.0 - Sistema de notificações toast
UUID - Geração de identificadores únicos
Class Variance Authority - Utilitário para variantes de classe

# 🎯 Funcionalidades Principais

🏪 Loja Virtual (Frontend)
Catálogo de Produtos com filtros avançados
Sistema de Carrinho completo
Lista de Favoritos
Montador de PC Personalizado com verificação de compatibilidade
Sistema de Categorias organizadas
Busca e Filtros por preço, categoria e características
Paginação de produtos
Interface Responsiva para todos os dispositivos
Tema Claro/Escuro

🔐 Autenticação e Usuários
Sistema de Login/Registro
Recuperação de Senha via email
Perfis de Usuário (Admin/Cliente)
Autenticação Protegida com Context API
Row Level Security no banco de dados

## 👨‍💼 Painel Administrativo
Dashboard com métricas e estatísticas
Gestão de Produtos (CRUD completo)
Gestão de Estoque em tempo real
Gestão de Categorias
Gestão de Pedidos e status
Gestão de Clientes
Gestão de Usuários administrativos
Marketing - Gestão de banners e promoções
Configurações do sistema

## 🛠️ Recursos Avançados
Build PC System - Montador inteligente de computadores
Verificação de Compatibilidade entre componentes
Gestão de Estoque com alertas de produtos em falta
Sistema de Filtros avançados
Upload de Imagens para produtos
Notificações Toast em tempo real
