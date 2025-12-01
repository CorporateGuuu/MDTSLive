import ProductDetail from 'src/components/Product/ProductDetail';
import { supabaseServer } from '../../../../lib/supabase/server';
import { Product } from 'src/types';
import { notFound } from 'next/navigation';

// Get product from Supabase
async function getProduct(id: string): Promise<Product | null> {
  const { data: product, error } = await supabaseServer
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !product) return null;

  const prod = product as any;

  // Convert Supabase product to Product format
  return {
    _id: prod.id,
    id: prod.id,
    name: prod.name,
    price: prod.price,
    originalPrice: prod.original_price || undefined,
    image: prod.thumbnail_url || prod.images?.[0] || '/placeholder.png',
    gallery: prod.images || [prod.thumbnail_url],
    category: prod.category_id || 'parts',
    brand: prod.brand_id || 'Apple',
    inStock: prod.stock_quantity > 0,
    description: prod.description || prod.short_description || '',
  };
}

export async function generateStaticParams() {
  try {
    // Query Supabase for product IDs
    const { data: products, error } = await supabaseServer
      .from('products')
      .select('id')
      .limit(50); // Limit to prevent too many static pages

    if (error) {
      console.error('Error fetching product IDs for static params:', error);
      return [];
    }

    return products?.map((product: any) => ({
      id: product.id.toString()
    })) || [];
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [];
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  return <ProductDetail product={product} />;
}
