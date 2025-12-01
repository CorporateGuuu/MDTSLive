import { supabase } from './supabase';

export interface SearchResult {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discount_percentage?: number;
  image: string;
  images?: string[];
  inStock: boolean;
  tags: string[];
}

export interface SearchResponse {
  products: SearchResult[];
  totalHits: number;
  totalPages: number;
  currentPage: number;
  hitsPerPage: number;
}

export interface SearchFilters {
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: number;
  hitsPerPage?: number;
}

class SearchService {
  private baseUrl = '/api/search';

  async search(query: string, filters: SearchFilters = {}): Promise<SearchResponse> {
    try {
      const params = new URLSearchParams();

      if (query.trim()) {
        params.append('q', query.trim());
      }

      if (filters.category) params.append('category', filters.category);
      if (filters.brand) params.append('brand', filters.brand);
      if (filters.minPrice) params.append('minPrice', filters.minPrice!);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice!);
      if (filters.page !== undefined) params.append('page', filters.page.toString());
      if (filters.hitsPerPage) params.append('hitsPerPage', filters.hitsPerPage.toString());

      const response = await fetch(`${this.baseUrl}?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Search service error, falling back to Supabase:', error);

      // Fallback to Supabase when API fails
      try {
        const limit = filters.hitsPerPage || 20;
        const { data, error: supabaseError } = await supabase
          .from('products')
          .select('*')
          .limit(limit);

        if (supabaseError) {
          console.error('Supabase fallback error:', supabaseError);
          return {
            products: [],
            totalHits: 0,
            totalPages: 1,
            currentPage: 0,
            hitsPerPage: limit
          };
        }

        let products = data || [];

        // Apply search query
        if (query.trim()) {
          const searchTerm = query.toLowerCase();
          products = products.filter((product: any) =>
            product.name?.toLowerCase().includes(searchTerm) ||
            product.brand?.toLowerCase().includes(searchTerm) ||
            product.category?.toLowerCase().includes(searchTerm) ||
            product.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm))
          );
        }

        // Apply filters
        if (filters.category && filters.category !== 'all') {
          products = products.filter((product: any) => product.category === filters.category);
        }

        if (filters.brand && filters.brand !== 'all') {
          products = products.filter((product: any) => product.brand === filters.brand);
        }

        if (filters.minPrice) {
          const minPrice = parseFloat(filters.minPrice);
          products = products.filter((product: any) => product.price >= minPrice);
        }

        if (filters.maxPrice) {
          const maxPrice = parseFloat(filters.maxPrice);
          products = products.filter((product: any) => product.price <= maxPrice);
        }

        // Convert to SearchResult format
        const searchResults = products.slice(0, limit).map((product: any) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          category: product.category,
          brand: product.brand,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          inStock: product.inStock,
          tags: product.tags || []
        }));

        return {
          products: searchResults,
          totalHits: searchResults.length,
          totalPages: 1,
          currentPage: 0,
          hitsPerPage: searchResults.length
        };
      } catch (supabaseError) {
        console.error('Supabase fallback query error:', supabaseError);
        return {
          products: [],
          totalHits: 0,
          totalPages: 1,
          currentPage: 0,
          hitsPerPage: filters.hitsPerPage || 20
        };
      }
    }
  }



  async getSuggestions(query: string, limit: number = 5): Promise<SearchResult[]> {
    if (!query.trim()) return [];

    try {
      const results = await this.search(query, { hitsPerPage: limit });
      return results.products;
    } catch (error) {
      console.error('Suggestions error:', error);
      return [];
    }
  }
}

export const searchService = new SearchService();
