
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MessageCircle, Mail, ChevronRight } from "lucide-react";

const HelpCenterPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const commonQuestions = [
    {
      id: "q1",
      question: "Como rastrear meu pedido?",
      answer: "Você pode rastrear seu pedido acessando 'Minha Conta' > 'Meus Pedidos' e clicando no botão de rastreamento do pedido específico."
    },
    {
      id: "q2",
      question: "Como trocar ou devolver um produto?",
      answer: "Para solicitar uma troca ou devolução, acesse 'Minha Conta' > 'Meus Pedidos', selecione o pedido correspondente e clique em 'Solicitar Devolução'. Você tem até 7 dias após receber o produto para fazer esta solicitação."
    },
    {
      id: "q3",
      question: "Quais são as formas de pagamento aceitas?",
      answer: "Aceitamos cartões de crédito, débito, boleto bancário, PIX e pagamento via PayPal. Para compras parceladas, oferecemos até 12x sem juros em cartões selecionados."
    },
    {
      id: "q4",
      question: "Qual o prazo de entrega?",
      answer: "O prazo de entrega varia de acordo com sua localização e o tipo de envio escolhido. Após a confirmação do pagamento, o prazo médio é de 3 a 10 dias úteis. Na página do produto e no checkout você pode consultar uma estimativa mais precisa."
    },
    {
      id: "q5",
      question: "O que fazer se o produto chegar com defeito?",
      answer: "Se seu produto chegar com defeito, entre em contato com nosso suporte em até 7 dias através do formulário de contato ou pelo e-mail suporte@teekbom.com. Envie fotos do produto e da embalagem para agilizar o processo."
    }
  ];
  
  const helpCategories = [
    { 
      title: "Pedidos e Entregas", 
      icon: "📦", 
      description: "Rastreamento, prazos e status",
      path: "/store/ajuda/pedidos"
    },
    { 
      title: "Pagamentos", 
      icon: "💳", 
      description: "Métodos, reembolsos e faturas",
      path: "/store/ajuda/pagamentos"
    },
    { 
      title: "Produtos", 
      icon: "🔧", 
      description: "Especificações e compatibilidade",
      path: "/store/ajuda/produtos"
    },
    { 
      title: "Trocas e Devoluções", 
      icon: "🔄", 
      description: "Políticas e procedimentos",
      path: "/store/ajuda/devolucoes"
    },
    { 
      title: "Garantia", 
      icon: "🛡️", 
      description: "Termos e condições",
      path: "/store/ajuda/garantia"
    },
  ];
  
  const filteredQuestions = searchQuery 
    ? commonQuestions.filter(q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : commonQuestions;
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Central de Ajuda</h1>
      
      {/* Search */}
      <div className="relative mb-8">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar na Central de Ajuda"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-6 text-lg w-full"
            />
          </div>
          <Button className="bg-primary py-6 px-8">
            <Search className="mr-2 h-5 w-5" /> 
            Buscar
          </Button>
        </div>
      </div>
      
      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {helpCategories.map((category) => (
          <Link 
            to={category.path} 
            key={category.title} 
            className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start">
              <div className="text-4xl mr-4">{category.icon}</div>
              <div>
                <h3 className="font-medium text-lg">{category.title}</h3>
                <p className="text-sm text-gray-500">{category.description}</p>
              </div>
            </div>
            <div className="mt-3 flex justify-end text-primary text-sm font-medium">
              Ver artigos <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </Link>
        ))}
      </div>
      
      {/* FAQ */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-10">
        <h2 className="text-xl font-semibold mb-4">Perguntas frequentes</h2>
        <Accordion type="single" collapsible className="w-full">
          {filteredQuestions.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        {filteredQuestions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              Nenhum resultado encontrado para "{searchQuery}".
            </p>
            <Button variant="outline" className="mt-3" onClick={() => setSearchQuery("")}>
              Limpar busca
            </Button>
          </div>
        )}
      </div>
      
      {/* Contact options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <div className="flex items-center mb-3">
            <MessageCircle className="h-6 w-6 mr-2 text-blue-600" />
            <h3 className="text-lg font-semibold">Chat ao vivo</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Converse com nossa equipe em tempo real para resolver suas dúvidas rapidamente.
          </p>
          <Button>Iniciar chat</Button>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
          <div className="flex items-center mb-3">
            <Mail className="h-6 w-6 mr-2 text-purple-600" />
            <h3 className="text-lg font-semibold">E-mail</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Envie sua dúvida por e-mail. Responderemos em até 24 horas úteis.
          </p>
          <Button variant="outline" className="border-purple-300">
            suporte@teekbom.com
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
