import { getSearchOnlyIndex, AlgoliaProduct } from '../../../lib/algolia';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category');
  const brand = searchParams.get('brand');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const page = parseInt(searchParams.get('page') || '0');
  const hitsPerPage = parseInt(searchParams.get('hitsPerPage') || '20');

  try {
    const index = getSearchOnlyIndex();

    // Build Algolia search parameters
    const searchParams: any = {
      page,
      hitsPerPage,
    };

    // Add filters
    const filters = [];

    if (category) {
      filters.push(`category:"${category}"`);
    }

    if (brand) {
      filters.push(`brand:"${brand}"`);
    }

    if (minPrice || maxPrice) {
      const priceFilters = [];
      if (minPrice) {
        priceFilters.push(`price >= ${parseFloat(minPrice)}`);
      }
      if (maxPrice) {
        priceFilters.push(`price <= ${parseFloat(maxPrice)}`);
      }
      if (priceFilters.length > 0) {
        filters.push(priceFilters.join(' AND '));
      }
    }

    if (filters.length > 0) {
      searchParams.filters = filters.join(' AND ');
    }

    // Perform search
    const results = await index.search(q, searchParams);

    // Transform results to match expected format
    const products = results.hits.map((hit: any) => ({
      id: hit.id,
      name: hit.name,
      description: hit.description,
      category: hit.category,
      brand: hit.brand,
      price: hit.price,
      originalPrice: hit.originalPrice,
      discount_percentage: hit.discount_percentage,
      image: hit.image,
      images: hit.images,
      inStock: hit.inStock,
      tags: hit.tags,
    }));

    return Response.json({
      products,
      totalHits: results.nbHits,
      totalPages: results.nbPages,
      currentPage: results.page,
      hitsPerPage: results.hitsPerPage,
    });
  } catch (error) {
    console.error('Search error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
