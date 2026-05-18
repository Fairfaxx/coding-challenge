'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';

type Product = {
  id: number;
  title: string;
  category: string;
};

type ProductsResponse = {
  products: Product[];
};

type SortOption = 'relevance' | 'title-asc' | 'title-desc';

export default function Page() {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('relevance');

  useEffect(() => {
    if (!debouncedSearch.trim()) return;
    const controller = new AbortController();
    const signal = controller.signal;

    async function searchProducts(query: string, signal: AbortSignal) {
      try {
        setError('');
        setLoading(true);
        const result = await axios.get<ProductsResponse>(
          `https://dummyjson.com/products/search?q=${query}`,
          { signal },
        );
        setProducts(result.data.products);
      } catch (error) {
        if (axios.isCancel(error)) {
          return;
        }

        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Something went wrong');
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    }

    searchProducts(debouncedSearch, signal);

    return () => controller.abort();
  }, [debouncedSearch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);
  const shouldSearch = search.trim().length > 0;

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === 'title-asc') {
      return a.title.localeCompare(b.title);
    }

    if (sortOption === 'title-desc') {
      return b.title.localeCompare(a.title);
    }

    return 0;
  });

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value as SortOption);
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Product Search</h1>

      <input
        className="border p-2 mt-4"
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {error && <p>{error}</p>}
      {loading && <p>Loading...</p>}
      {debouncedSearch && !error && !loading && sortedProducts.length < 1 && (
        <p>No products available</p>
      )}

      <select
        name="sorted"
        id="sorted"
        value={sortOption}
        onChange={handleChange}
      >
        <option value="relevance">relevance</option>
        <option value="title-asc">title-asc</option>
        <option value="title-desc">title-desc</option>
      </select>
      <ul className="mt-4">
        {shouldSearch &&
          sortedProducts.map((product) => (
            <li key={product.id}>{product.title}</li>
          ))}
      </ul>
    </main>
  );
}
