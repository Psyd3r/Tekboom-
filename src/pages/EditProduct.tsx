
import { useParams } from "react-router-dom";
import { ProductForm } from "@/components/Products/ProductForm";

const EditProduct = () => {
  const { id } = useParams();
  
  return <ProductForm editMode productId={id} />;
};

export default EditProduct;
