
import { Link } from "react-router-dom";

interface CategoryCardProps {
  id: string;
  name: string;
  imageUrl: string;
  productCount: number;
}

export const CategoryCard = ({ id, name, imageUrl, productCount }: CategoryCardProps) => {
  return (
    <Link 
      to={`/store/categoria/${id}`} 
      className="group block relative rounded-lg overflow-hidden aspect-square shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D47A1] to-transparent opacity-70 z-10"></div>
      <img 
        src={imageUrl || "https://placehold.co/300x300"} 
        alt={name}
        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-x-0 bottom-0 p-4 text-white z-20">
        <h3 className="text-lg font-bold mb-1">{name}</h3>
        <p className="text-sm opacity-90">{productCount} {productCount === 1 ? 'produto' : 'produtos'}</p>
      </div>
    </Link>
  );
};
