import React, { useState } from 'react';
import { Product } from '../types';

interface Props {
  shouldSearch: boolean;
  visibleProducts: Product[];
}

const ProductList = ({ shouldSearch, visibleProducts }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!visibleProducts.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();

      setSelectedIndex((currentIndex) =>
        Math.min(currentIndex + 1, visibleProducts.length - 1),
      );
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();

      setSelectedIndex((currentIndex) => Math.max(currentIndex - 1, 0));
    }

    if (e.key === 'Enter') {
      console.log(visibleProducts[selectedIndex]);
    }
  };

  return (
    <div tabIndex={0} onKeyDown={handleKeyDown} className="outline-none border">
      {' '}
      <ul className="mt-4 ">
        {shouldSearch &&
          visibleProducts.map((product, index) => (
            <li
              key={product.id}
              className={selectedIndex === index ? 'bg-blue-500' : ''}
            >
              {product.title} - {product.title} - {product.category}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ProductList;
