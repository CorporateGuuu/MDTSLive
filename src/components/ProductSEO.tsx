import Head from 'next/head';

interface ProductSEOProps {
  product: {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    discount_percentage?: number;
    stock_quantity?: number;
    thumbnail_url?: string | null;
    images?: string[] | null;
    categories?: {
      name: string;
    } | null;
    brands?: {
      name: string;
    } | null;
    reviews?: {
      count: number;
      averageRating: number;
    };
  };
  canonicalUrl?: string;
}

export default function ProductSEO({ product, canonicalUrl }: ProductSEOProps) {
  const title = `${product.name} - ${product.brands?.name || 'Nexus Tech Hub'}`;
  const description = product.description ||
    `${product.name} - High quality ${product.categories?.name || 'tech parts'} from ${product.brands?.name || 'Nexus Tech Hub'}. ${product.reviews?.count ? `${product.reviews.count} reviews, ${product.reviews.averageRating} stars.` : ''}`;

  const imageUrl = product.thumbnail_url || (product.images && product.images[0]) ||
    'https://nexustechhub.com/default-product-image.jpg';

  const currentPrice = product.price * (1 - (product.discount_percentage || 0) / 100);
  const url = canonicalUrl || `https://nexustechhub.com/products/${product.id}`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={`${product.name}, ${product.categories?.name || ''}, ${product.brands?.name || ''}, tech parts, electronics`} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="product" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Nexus Tech Hub" />
      <meta property="og:locale" content="en_US" />

      {/* Product-specific Open Graph */}
      <meta property="product:price:amount" content={currentPrice.toFixed(2)} />
      <meta property="product:price:currency" content="USD" />
      {product.discount_percentage && product.discount_percentage > 0 && (
        <meta property="product:original_price:amount" content={product.price.toFixed(2)} />
      )}
      {product.brands?.name && (
        <meta property="product:brand" content={product.brands.name} />
      )}
      {product.categories?.name && (
        <meta property="product:category" content={product.categories.name} />
      )}
      {product.reviews && (
        <>
          <meta property="product:review:count" content={product.reviews.count.toString()} />
          <meta property="product:review:rating" content={product.reviews.averageRating.toString()} />
        </>
      )}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={imageUrl} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Nexus Tech Hub" />

      {/* Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "description": description,
            "image": imageUrl,
            "brand": {
              "@type": "Brand",
              "name": product.brands?.name || "Nexus Tech Hub"
            },
            "category": product.categories?.name,
            "offers": {
              "@type": "Offer",
              "price": currentPrice.toFixed(2),
              "priceCurrency": "USD",
              "availability": product.stock_quantity && product.stock_quantity > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
              "seller": {
                "@type": "Organization",
                "name": "Nexus Tech Hub"
              }
            },
            "aggregateRating": product.reviews && product.reviews.count > 0 ? {
              "@type": "AggregateRating",
              "ratingValue": product.reviews.averageRating,
              "reviewCount": product.reviews.count
            } : undefined
          })
        }}
      />
    </Head>
  );
}
