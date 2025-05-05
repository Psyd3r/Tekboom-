
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(dateStr: string | null | undefined): string {
  // Se for nulo, undefined ou uma string vazia, retorne um valor padrão
  if (!dateStr) return "Data não disponível";
  
  // Tente criar um objeto Date a partir da string
  try {
    const date = new Date(dateStr);
    
    // Verifique se a data é válida
    if (isNaN(date.getTime())) {
      return "Data inválida";
    }
    
    // Se chegou aqui, a data é válida, então formate-a
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return "Erro ao formatar data";
  }
}
