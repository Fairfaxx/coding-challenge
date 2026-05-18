'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { SearchInput } from './components/SearchInput';
import ProductControls from './components/ProductControls';
import ProductList from './components/ProductList';
import { Product, SortOption, ProductsResponse } from './types';

export default function Page() {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('relevance');
  const [selectedCategory, setSelectedCategory] = useState('all');
  

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
        setSelectedCategory('all');
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

  const categories = Array.from(
    new Set(products.map((product) => product.category)),
  );

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const visibleProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'title-asc') {
      return a.title.localeCompare(b.title);
    }

    if (sortOption === 'title-desc') {
      return b.title.localeCompare(a.title);
    }

    return 0;
  });

  console.log(typeof visibleProducts);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Product Search</h1>

      <SearchInput search={search} setSearch={setSearch} />
      {error && <p>{error}</p>}
      {loading && <p>Loading...</p>}
      {debouncedSearch && !error && !loading && visibleProducts.length < 1 && (
        <p>No products available</p>
      )}

      <ProductControls
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      <ProductList
        shouldSearch={shouldSearch}
        visibleProducts={visibleProducts}
      />
    </main>
  );
}
