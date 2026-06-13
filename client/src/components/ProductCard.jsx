// Encabezado del archivo (importaciones)
import React, { memo, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Heart } from 'lucide-react';

// Componente ProductCard (Estilo Clásico Boutique)
const ProductCard = memo(function ProductCard({ prod }) {
  const product = prod;
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  if (!product) return null;

  const formattedPrice = useMemo(() =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(product?.precio ?? 0),
    [product?.precio]
  );

  const isOutOfStock = useMemo(() => Number(product?.stock ?? 0) <= 0, [product?.stock]);

  const [mainImg, hoverImg] = useMemo(() => {
    const processImg = (src) => {
      if (!src) return '/vite.svg';
      if (/^(https?:)?\/\//.test(src) || src.startsWith('data:')) return src;
      if (src.startsWith('/uploads')) return src;
      return `/uploads/${src}`;
    };
    const first = processImg(product?.imagenes?.[0]);
    const second = product?.imagenes?.[1] ? processImg(product?.imagenes?.[1]) : first;
    return [first, second];
  }, [product?.imagenes]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const Content = (
    <div
      className="relative group bg-white border border-gray-100 rounded-sm hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Contenedor de Imagen */}
      <div className="relative overflow-hidden aspect-[4/5] bg-gray-50 border-b border-gray-100">
        <img
          src={mainImg}
          alt={`Imagen de ${product?.nombre}`}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-in-out transform group-hover:scale-105 ${isHovered && mainImg !== hoverImg ? 'opacity-0' : 'opacity-100'}`}
          loading="lazy"
        />
        <img
          src={hoverImg}
          alt={`Vista alternativa de ${product?.nombre}`}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-in-out transform group-hover:scale-105 ${isHovered && mainImg !== hoverImg ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
        />

        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 p-2 rounded-full bg-white/50 hover:bg-white text-gray-800 transition-all duration-300">
          <Heart size={18} strokeWidth={1.5} />
        </button>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product?.seccion === 'mas-lanzamientos' && (
            <span className="bg-white text-black text-[10px] px-3 py-1 uppercase tracking-widest border border-black font-medium">
              Nuevo
            </span>
          )}
          {product?.seccion === 'nuevo-lanzamiento' && (
            <span className="bg-black text-white text-[10px] px-3 py-1 uppercase tracking-widest font-medium">
              Lanzamiento
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-red-700 text-white text-[10px] px-3 py-1 uppercase tracking-widest font-medium">
              Agotado
            </span>
          )}
        </div>
      </div>

      {/* Información del Producto */}
      <div className="p-5 text-center space-y-3">
        {/* Categoría */}
        <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">
          {product?.categoria || 'Joyería'}
        </p>

        {/* Nombre en Serif para elegancia */}
        <h3 className="text-lg text-gray-900 font-serif tracking-wide group-hover:text-black transition-colors px-2 truncate">
          {product?.nombre || 'Producto Exclusivo'}
        </h3>

        {/* Precio */}
        <p className="text-sm font-medium text-gray-600">
          {formattedPrice}
        </p>

        {/* Botón */}
        <div className="pt-2">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-3 px-4 text-xs uppercase tracking-widest font-bold transition-all duration-300 border
                ${isOutOfStock
                ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed'
                : 'border-black text-black hover:bg-black hover:text-white group-hover:bg-black group-hover:text-white'
              }`}
          >
            {isOutOfStock ? 'Agotado' : 'Agregar a Solicitud'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <article className="h-full">
      {product?._id ? (
        <Link to={`/producto/${product._id}`} className="block h-full focus:outline-none">
          {Content}
        </Link>
      ) : (
        <div className="block h-full cursor-default">
          {Content}
        </div>
      )}
    </article>
  );
});

ProductCard.displayName = 'ProductCard';
export default ProductCard;
