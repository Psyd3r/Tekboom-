
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
      className="group block relative rounded-lg overflow-hidden bg-gray-900 aspect-square"
    >
      <img 
        src={imageUrl || "https://placehold.co/300x300"} 
        alt={name}
        className="w-full h-full object-cover opacity-80 transition-all duration-500 group-hover:opacity-60 group-hover:scale-105"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
        <h3 className="text-xl md:text-2xl font-bold mb-2">{name}</h3>
        <p className="text-sm">{productCount} produtos</p>
      </div>
    </Link>
  );
};
