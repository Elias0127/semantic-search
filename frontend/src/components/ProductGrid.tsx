import { useChat } from '../context/ChatContext';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';

const ProductGrid = () => {
  const { lastResults, isTyping } = useChat();

  /* Show skeletons while the AI is “typing” and waiting for results */
  if (isTyping) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (lastResults.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Ask something to see matching products.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {lastResults.map((p) => (
        <ProductCard p={p} key={p._id} />
      ))}
    </div>
  );
};

export default ProductGrid;
