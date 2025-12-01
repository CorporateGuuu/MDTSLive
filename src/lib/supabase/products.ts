import { supabase } from '../supabase';

export async function getProductsBySubcategory(subcategory: string) {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('subcategory', subcategory)
    .eq('published', true)
    .order('position', { ascending: true });
  return data || [];
}

export async function getProductsByModel(model: string) {
  const { data } = await supabase
    .from('products')
    .select('*')
    .ilike('model', `%${model}%`)
    .eq('published', true)
    .order('title');
  return data || [];
}

export async function getRecentProducts(limit: number = 48) {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(limit);
  return data || [];
}
