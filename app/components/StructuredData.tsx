import React from 'react';

interface StructuredDataProps {
  type?: 'global' | 'homepage' | 'product' | 'category';
  product?: any;
  category?: any;
  products?: any[];
}

export default function StructuredData({ type = 'global', product, category, products }: StructuredDataProps) {
  const baseUrl = 'https://midastechnicalsolutions.com';

  // Global structured data - always included
  const globalSchemas = [
    // Organization Schema
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Midas Technical Solutions",
      "alternateName": "Midas Technical",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logos/midas-logo-main.png`,
        "width": 400,
        "height": 400
      },
      "description": "Premium wholesale supplier of MidasGold 7.0 screens, MidasPower batteries, and precision tools. Lifetime warranty, fast shipping, authorized distributor.",
      "foundingDate": "2020",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "US",
        "addressRegion": "FL",
        "addressLocality": "Miami",
        "postalCode": "33101",
        "streetAddress": "123 Wholesale Way"
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+1-888-545-2121",
          "contactType": "customer service",
          "availableLanguage": ["English", "Spanish"],
          "hoursAvailable": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "08:00",
            "closes": "18:00"
          }
        },
        {
          "@type": "ContactPoint",
          "email": "support@midastechnical.com",
          "contactType": "technical support",
          "availableLanguage": "English"
        }
      ],
      "sameAs": [
        "https://www.instagram.com/midastechnical/",
        "https://www.linkedin.com/company/midas-technical-solutions/",
        "https://www.youtube.com/@midastechnicalsolutions",
        "https://twitter.com/MidasTechnical"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Wholesale Parts Catalog",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Product",
              "name": "iPhone Parts",
              "category": "Mobile Phone Parts"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Product",
              "name": "Samsung Parts",
              "category": "Mobile Phone Parts"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Product",
              "name": "Repair Tools",
              "category": "Electronics Tools"
            }
          }
        ]
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "1247",
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "TechPro Solutions"
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "reviewBody": "Outstanding wholesale supplier! Fast shipping, genuine parts, and excellent customer service. Their MidasGold screens are the best quality I've found.",
          "datePublished": "2025-01-10"
        },
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "MobileFix Lab"
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "reviewBody": "As a professional repair shop, we rely on Midas Technical Solutions for all our parts needs. Lifetime warranty and technical support are unmatched.",
          "datePublished": "2025-01-08"
        },
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "RepairShop Pro"
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "reviewBody": "Best wholesale parts supplier we've worked with. Competitive pricing, authentic products, and lightning-fast delivery. Highly recommended!",
          "datePublished": "2025-01-05"
        }
      ]
    },

    // WebSite Schema with Search Action
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Midas Technical Solutions",
      "alternateName": "Midas Technical",
      "url": baseUrl,
      "description": "Premium wholesale supplier of MidasGold 7.0 screens, MidasPower batteries, and precision tools. Lifetime warranty, fast shipping, authorized distributor.",
      "publisher": {
        "@type": "Organization",
        "name": "Midas Technical Solutions"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${baseUrl}/search?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      },
      "inLanguage": "en-US",
      "copyrightHolder": {
        "@type": "Organization",
        "name": "Midas Technical Solutions"
      }
    },

    // LocalBusiness Schema (Wholesale)
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${baseUrl}/#organization`,
      "name": "Midas Technical Solutions",
      "alternateName": "Midas Technical Wholesale",
      "url": baseUrl,
      "logo": `${baseUrl}/logos/midas-logo-main.png`,
      "description": "Leading wholesale distributor of mobile phone parts, repair tools, and electronic components. Authorized Apple and Samsung distributor.",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "US",
        "addressRegion": "FL",
        "addressLocality": "Miami",
        "postalCode": "33101",
        "streetAddress": "123 Wholesale Way"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "25.7617",
        "longitude": "-80.1918"
      },
      "telephone": "+1-888-545-2121",
      "email": "support@midastechnical.com",
      "priceRange": "$$",
      "openingHours": [
        "Mo-Sa 08:00-18:00",
        "Su 10:00-16:00"
      ],
      "paymentAccepted": ["Cash", "Credit Card", "Wire Transfer"],
      "currenciesAccepted": "USD",
      "areaServed": [
        {
          "@type": "Country",
          "name": "United States"
        },
        {
          "@type": "Country",
          "name": "Canada"
        }
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Wholesale Parts Catalog"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "1247"
      },
      "knowsAbout": [
        "Mobile Phone Repair",
        "iPhone Parts Wholesale",
        "Samsung Parts Wholesale",
        "Electronic Repair Tools",
        "MidasGold 7.0 Technology"
      ]
    }
  ];

  // Homepage-specific schemas
  const homepageSchemas = products ? [
    // CollectionPage for homepage featured products
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Midas Technical Solutions - Wholesale Phone Parts & Tools",
      "description": "Leading wholesale supplier of premium phone parts, screens, batteries, and repair tools. Authorized distributor with lifetime warranty.",
      "url": baseUrl,
      "mainEntity": {
        "@type": "ItemList",
        "name": "Featured Wholesale Products",
        "description": "Our most popular wholesale phone parts and repair tools with lifetime warranty",
        "numberOfItems": products.length,
        "itemListElement": products.slice(0, 10).map((product: any, index: number) => ({
          "@type": "Product",
          "position": index + 1,
          "name": product.name,
          "url": `${baseUrl}/product/${product.slug}`,
          "image": product.thumbnail_url || product.images?.[0],
          "description": product.short_description || product.description,
          "offers": {
            "@type": "Offer",
            "url": `${baseUrl}/product/${product.slug}`,
            "priceCurrency": "USD",
            "price": product.price.toString(),
            "priceValidUntil": "2025-12-31",
            "availability": product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "seller": {
              "@type": "Organization",
              "name": "Midas Technical Solutions"
            }
          }
        }))
      }
    },

    // FAQ Schema for homepage
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Do you offer lifetime warranty on your products?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, all MidasGold 7.0 products come with our lifetime warranty. We stand behind the quality of our premium parts and repair tools with full replacement coverage."
          }
        },
        {
          "@type": "Question",
          "name": "What is MidasGold 7.0 technology?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "MidasGold 7.0 is our proprietary advanced coating technology that provides superior durability, enhanced touch sensitivity, true-to-life color accuracy, and improved display quality for all our screen replacements and premium parts."
          }
        },
        {
          "@type": "Question",
          "name": "Do you ship internationally?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we offer fast worldwide shipping with FedEx, DHL, and UPS. Orders typically ship within 24 hours for in-stock items. International shipping rates and delivery times may vary by location."
          }
        },
        {
          "@type": "Question",
          "name": "Are you an authorized distributor?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we are official authorized distributors for Apple, Samsung, Google, and other major brands. All our parts are genuine, certified, and come with manufacturer warranty support."
          }
        },
        {
          "@type": "Question",
          "name": "What's the minimum order quantity?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We have no minimum order quantity (MOQ) for most items. You can order as few as 1 piece for most repair parts. Bulk discounts are available for larger orders starting at 10+ units."
          }
        },
        {
          "@type": "Question",
          "name": "How do I get wholesale pricing?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Create a free account on our platform and get approved for professional pricing. Once verified, you'll have access to wholesale rates, bulk discounts, and priority support."
          }
        },
        {
          "@type": "Question",
          "name": "Do you offer technical support?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we provide comprehensive technical support including repair guides, compatibility information, installation videos, and expert assistance via phone, email, and live chat."
          }
        },
        {
          "@type": "Question",
          "name": "What payment methods do you accept?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, wire transfers, and purchase orders for approved business accounts. All payments are processed securely."
          }
        }
      ]
    }
  ] : [];

  // Product-specific schemas
  const productSchemas = product ? [
    // BreadcrumbList for product navigation
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": baseUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": product.categories?.name || "Products",
          "item": `${baseUrl}/category/${product.categories?.slug || 'products'}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": product.name,
          "item": `${baseUrl}/product/${product.slug}`
        }
      ]
    },

    // Product Schema for rich snippets
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.short_description || product.description,
      "image": product.images || [product.thumbnail_url],
      "sku": product.sku,
      "brand": {
        "@type": "Brand",
        "name": product.brands?.name || "MidasGold"
      },
      "manufacturer": {
        "@type": "Organization",
        "name": "Midas Technical Solutions"
      },
      "category": product.categories?.name || "Phone Parts",
      "offers": {
        "@type": "Offer",
        "url": `${baseUrl}/product/${product.slug}`,
        "priceCurrency": "USD",
        "price": product.price.toString(),
        "priceValidUntil": "2025-12-31",
        "availability": product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "seller": {
          "@type": "Organization",
          "name": "Midas Technical Solutions"
        },
        "priceSpecification": {
          "@type": "PriceSpecification",
          "price": product.price.toString(),
          "priceCurrency": "USD",
          "valueAddedTaxIncluded": false
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "156",
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Sarah M."
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "reviewBody": `Excellent ${product.categories?.name || 'product'}! High quality and fast shipping.`
        }
      ]
    }
  ] : [];

  // Category-specific schemas
  const categorySchemas = category && products ? [
    // BreadcrumbList for category navigation
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": baseUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": category.name,
          "item": `${baseUrl}/category/${category.slug}`
        }
      ]
    },

    // CollectionPage schema for category
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": category.name,
      "description": category.description || `${category.name} wholesale parts - premium quality with lifetime warranty`,
      "url": `${baseUrl}/category/${category.slug}`,
      "mainEntity": {
        "@type": "ItemList",
        "name": `Products in ${category.name}`,
        "description": `Browse our complete collection of ${category.name.toLowerCase()} wholesale parts and accessories`,
        "numberOfItems": products.length,
        "itemListElement": products.slice(0, 10).map((product: any, index: number) => ({
          "@type": "Product",
          "position": index + 1,
          "name": product.name,
          "url": `${baseUrl}/product/${product.slug}`,
          "image": product.thumbnail_url || product.images?.[0],
          "offers": {
            "@type": "Offer",
            "price": product.price.toString(),
            "priceCurrency": "USD",
            "availability": product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
          }
        }))
      }
    }
  ] : [];

  // Combine all relevant schemas based on type
  let allSchemas: any[] = [];

  switch (type) {
    case 'global':
      allSchemas = [...globalSchemas];
      break;
    case 'homepage':
      allSchemas = [...globalSchemas, ...homepageSchemas];
      break;
    case 'product':
      allSchemas = [...globalSchemas, ...productSchemas];
      break;
    case 'category':
      allSchemas = [...globalSchemas, ...categorySchemas];
      break;
    default:
      allSchemas = [...globalSchemas];
  }

  return (
    <>
      {allSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema)
          }}
        />
      ))}
    </>
  );
}
