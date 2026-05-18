import React from 'react';
import { SortOption } from '../types';


interface Props {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  categories: string[];
  sortOption: string;
  setSortOption: (value: SortOption) => void;
}

const ProductControls = ({
  categories,
  sortOption,
  selectedCategory,
  setSelectedCategory,
  setSortOption,
}: Props) => {
  return (
    <div>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="all">All categories</option>

        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <select
        name="sorted"
        id="sorted"
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value as SortOption)}
      >
        <option value="relevance">relevance</option>
        <option value="title-asc">title-asc</option>
        <option value="title-desc">title-desc</option>
      </select>
    </div>
  );
};

export default ProductControls;
