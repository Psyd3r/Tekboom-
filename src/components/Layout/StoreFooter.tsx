
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, CreditCard, Truck, ShieldCheck, HeadphonesIcon, Store } from "lucide-react";

export const StoreFooter = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Advantages bar */}
      <div className="bg-[#F5F9FF] py-6 border-b border-gray-200">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-[#1E88E5] mr-3" />
              <div>
                <h4 className="text-sm font-semibold">Parcele suas compras</h4>
                <p className="text-xs text-gray-600">Até 12x sem juros</p>
              </div>
            </div>
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-[#1E88E5] mr-3" />
              <div>
                <h4 className="text-sm font-semibold">Frete grátis</h4>
                <p className="text-xs text-gray-600">Em compras acima de R$199</p>
              </div>
            </div>
            <div className="flex items-center">
              <ShieldCheck className="h-8 w-8 text-[#1E88E5] mr-3" />
              <div>
                <h4 className="text-sm font-semibold">Compra garantida</h4>
                <p className="text-xs text-gray-600">Seus dados protegidos</p>
              </div>
            </div>
            <div className="flex items-center">
              <HeadphonesIcon className="h-8 w-8 text-[#1E88E5] mr-3" />
              <div>
                <h4 className="text-sm font-semibold">Atendimento</h4>
                <p className="text-xs text-gray-600">Suporte 24h</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main footer content - simplificado conforme solicitado */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Store className="h-6 w-6 text-[#1E88E5]" />
              <span className="font-bold text-xl">Teekbom</span>
            </div>
            <p className="text-gray-600 mb-6">
              Sua loja online com os melhores produtos e preços.
            </p>
            <div className="flex justify-center space-x-4">
              <a href="#" className="text-gray-500 hover:text-[#1E88E5] transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-[#1E88E5] transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-[#1E88E5] transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-[#1E88E5] transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex justify-center items-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Teekbom. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
