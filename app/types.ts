export type Product = {
  id: number;
  title: string;
  category: string;
};

export type ProductsResponse = {
  products: Product[];
};

export type SortOption = 'relevance' | 'title-asc' | 'title-desc';