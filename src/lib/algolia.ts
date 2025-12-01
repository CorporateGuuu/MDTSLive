import { algoliasearch } from 'algoliasearch';

const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const algoliaAdminApiKey = process.env.ALGOLIA_ADMIN_API_KEY;
const algoliaSearchApiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY;
const algoliaIndexName = process.env.ALGOLIA_INDEX_NAME || 'products';

// Admin client for indexing (server-side only)
export const getAlgoliaAdminClient = () => {
  if (!algoliaAppId || !algoliaAdminApiKey) {
    throw new Error('Algolia configuration is missing. Please check your environment variables.');
  }
  return algoliasearch(algoliaAppId, algoliaAdminApiKey);
};

// Search client for frontend (client-side)
export const getAlgoliaSearchClient = () => {
  if (!algoliaAppId || !algoliaSearchApiKey) {
    throw new Error('Algolia search configuration is missing. Please check your environment variables.');
  }
  return algoliasearch(algoliaAppId, algoliaSearchApiKey);
};

// Get the products index
export const getProductsIndex = () => {
  return algoliasearch(algoliaAppId!, algoliaAdminApiKey!).initIndex(algoliaIndexName);
};

// Search-only index for frontend
export const getSearchOnlyIndex = () => {
  return algoliasearch(algoliaAppId!, algoliaSearchApiKey!).initIndex(algoliaIndexName);
};

// Product interface for Algolia indexing
export interface AlgoliaProduct {
  objectID: string;
  id: string;
  name: string;
  description?: string;
  category: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discount_percentage?: number;
  image?: string;
  images?: string[];
  inStock: boolean;
  tags?: string[];
  _tags?: string[]; // Algolia internal tags
}

// Transform Supabase product to Algolia format
export const transformProductForAlgolia = (product: any): AlgoliaProduct => {
  return {
    objectID: product.id.toString(),
    id: product.id.toString(),
    name: product.name,
    description: product.description,
    category: product.category,
    brand: product.brand,
    price: product.price,
    originalPrice: product.originalPrice,
    discount_percentage: product.discount_percentage,
    image: product.image,
    images: product.images,
    inStock: product.inStock !== false, // Default to true if not specified
    tags: product.tags || [],
    _tags: [
      product.category,
      product.brand,
      ...(product.tags || [])
    ].filter(Boolean)
  };
};

// Index products to Algolia
export const indexProductsToAlgolia = async (products: any[]) => {
  const index = getProductsIndex();

  const algoliaProducts = products.map(transformProductForAlgolia);

  try {
    const result = await index.saveObjects(algoliaProducts);
    console.log(`Indexed ${algoliaProducts.length} products to Algolia`);
    return result;
  } catch (error) {
    console.error('Error indexing products to Algolia:', error);
    throw error;
  }
};

// Update a single product in Algolia
export const updateProductInAlgolia = async (product: any) => {
  const index = getProductsIndex();
  const algoliaProduct = transformProductForAlgolia(product);

  try {
    const result = await index.saveObject(algoliaProduct);
    console.log(`Updated product ${product.id} in Algolia`);
    return result;
  } catch (error) {
    console.error('Error updating product in Algolia:', error);
    throw error;
  }
};

// Delete a product from Algolia
export const deleteProductFromAlgolia = async (productId: string) => {
  const index = getProductsIndex();

  try {
    const result = await index.deleteObject(productId);
    console.log(`Deleted product ${productId} from Algolia`);
    return result;
  } catch (error) {
    console.error('Error deleting product from Algolia:', error);
    throw error;
  }
};

// Clear the entire index
export const clearAlgoliaIndex = async () => {
  const index = getProductsIndex();

  try {
    const result = await index.clearObjects();
    console.log('Cleared Algolia index');
    return result;
  } catch (error) {
    console.error('Error clearing Algolia index:', error);
    throw error;
  }
};
