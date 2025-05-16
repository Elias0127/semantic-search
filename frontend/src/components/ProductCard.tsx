import { Product } from '../utils/types';
import { motion } from 'framer-motion';

const ProductCard: React.FC<{ p: Product }> = ({ p }) => {
  const apiBase = import.meta.env.VITE_API_URL;
  const imageSrc = `${apiBase}/img-proxy?url=${encodeURIComponent(p.imageUrl)}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="rounded-xl overflow-hidden bg-white shadow-sm border"
    >
      <div className="relative h-40 w-full overflow-hidden bg-gray-100">
        <img
          src={imageSrc}
          alt={p.name}
          className="object-cover h-full w-full transition-transform duration-300 hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src =
              'https://via.placeholder.com/300x200?text=Image+Unavailable';
          }}
        />
        <span className="absolute top-2 right-2 bg-brand-500 text-white text-xs px-2 py-0.5 rounded-full shadow">
          ${p.price.toFixed(2)}
        </span>
      </div>
      <div className="p-3">
        <h4 className="font-medium mb-0.5 truncate">{p.name}</h4>
        <p className="text-xs text-gray-500 line-clamp-2">{p.description}</p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
