
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const StoreFooter = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Store className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Teekbom</span>
            </div>
            <p className="text-gray-600 mb-4">
              Sua loja online com os melhores produtos e preços.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-500 hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-gray-600">
              <li><Link to="/store/sobre" className="hover:text-primary">Sobre Nós</Link></li>
              <li><Link to="/store/contato" className="hover:text-primary">Contato</Link></li>
              <li><Link to="/store/politica-privacidade" className="hover:text-primary">Política de Privacidade</Link></li>
              <li><Link to="/store/termos" className="hover:text-primary">Termos de Uso</Link></li>
              <li><Link to="/store/faq" className="hover:text-primary">Perguntas Frequentes</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Contato</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-primary shrink-0 mt-0.5" />
                <span>Rua Exemplo, 123, São Paulo - SP</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-primary" />
                <span>(11) 1234-5678</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-primary" />
                <span>contato@teekbom.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Newsletter</h3>
            <p className="text-gray-600 mb-4">
              Inscreva-se para receber nossas ofertas e novidades.
            </p>
            <div className="flex flex-col space-y-2">
              <Input 
                type="email" 
                placeholder="Seu e-mail"
                className="border-gray-200" 
              />
              <Button className="w-full">Inscrever</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-12 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Teekbom. Todos os direitos reservados.
            </p>
            <div className="flex space-x-4 mt-3 md:mt-0">
              <img src="https://placehold.co/40x25" alt="Visa" className="h-6" />
              <img src="https://placehold.co/40x25" alt="Mastercard" className="h-6" />
              <img src="https://placehold.co/40x25" alt="PayPal" className="h-6" />
              <img src="https://placehold.co/40x25" alt="Pix" className="h-6" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
