import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function SearchAutocomplete() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef();

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    clearTimeout(debounceRef.current);
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, description, price, sku')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,sku.ilike.%${query}%`)
        .order('name')
        .limit(5);

      if (error) console.error('Search error:', error);
      else setResults(data || []);
      setLoading(false);
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search Midas Parts & Tools"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gold"  // Gold #D4AF37
      />
      {loading && <div className="absolute top-full left-0 w-full bg-white shadow-lg p-2">Searching...</div>}
      {results.length > 0 && (
        <ul className="absolute top-full left-0 w-full bg-white shadow-lg border border-gray-200 max-h-60 overflow-y-auto z-50">
          {results.map((product) => (
            <li key={product.id} className="p-2 hover:bg-gray-100 cursor-pointer flex items-center">
              <div className="flex-1">
                <div className="font-medium">{product.name}</div>
                <div className="text-sm text-gray-600">${product.price} {product.sku && `• SKU: ${product.sku}`}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
