# Canonical Tag Strategy for Midas Technical Solutions

## Overview
Comprehensive canonical tag implementation to prevent duplicate content issues and consolidate SEO value.

## 1. Basic Canonical Implementation

### Standard Canonical Tag
```html
<head>
  <link rel="canonical" href="https://midastechnicalsolutions.com/products/iphone-15-screen/">
</head>
```

### Dynamic Canonical (React/Next.js)
```jsx
const CanonicalLink = ({ url }) => {
  const canonicalUrl = url || `https://midastechnicalsolutions.com${window.location.pathname}`;

  useEffect(() => {
    // Remove existing canonical tags
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }

    // Add new canonical tag
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = canonicalUrl;
    document.head.appendChild(link);
  }, [canonicalUrl]);

  return null;
};
```

## 2. URL Parameter Handling

### Filter and Sort Parameters
```html
<!-- Original URL -->
<link rel="canonical" href="https://midastechnicalsolutions.com/iphone-parts/">

<!-- Filtered URLs - canonical to base -->
<link rel="canonical" href="https://midastechnicalsolutions.com/iphone-parts/">
<!-- URL: /iphone-parts/?brand=apple&sort=price -->

<link rel="canonical" href="https://midastechnicalsolutions.com/iphone-parts/">
<!-- URL: /iphone-parts/?category=screens&price=100-500 -->
```

### Pagination Canonical
```html
<!-- Page 1 - canonical to base -->
<link rel="canonical" href="https://midastechnicalsolutions.com/iphone-parts/">
<!-- URL: /iphone-parts/ -->

<!-- Page 2+ - self-referencing canonical -->
<link rel="canonical" href="https://midastechnicalsolutions.com/iphone-parts/page/2/">
<!-- URL: /iphone-parts/page/2/ -->

<!-- Alternative: rel="prev/next" for pagination -->
<link rel="prev" href="https://midastechnicalsolutions.com/iphone-parts/">
<link rel="next" href="https://midastechnicalsolutions.com/iphone-parts/page/3/">
```

## 3. Cross-Domain Canonical Strategy

### Subdomain Handling
```html
<!-- If using blog subdomain -->
<link rel="canonical" href="https://blog.midastechnicalsolutions.com/iphone-repair-guide/">
<!-- URL: https://blog.midastechnicalsolutions.com/iphone-repair-guide/ -->

<!-- If using www/non-www -->
<link rel="canonical" href="https://midastechnicalsolutions.com/products/iphone-screen/">
<!-- URL: https://www.midastechnicalsolutions.com/products/iphone-screen/ -->
```

### Protocol Handling
```html
<!-- Always HTTPS -->
<link rel="canonical" href="https://midastechnicalsolutions.com/products/iphone-screen/">
<!-- Never HTTP -->
<!-- <link rel="canonical" href="http://midastechnicalsolutions.com/products/iphone-screen/"> -->
```

## 4. E-commerce Specific Canonical Rules

### Product Variations
```html
<!-- Base product page -->
<link rel="canonical" href="https://midastechnicalsolutions.com/products/iphone-15-screen/">
<!-- URL: /products/iphone-15-screen/ -->

<!-- Color/size variations - canonical to base -->
<link rel="canonical" href="https://midastechnicalsolutions.com/products/iphone-15-screen/">
<!-- URL: /products/iphone-15-screen/?color=black -->

<link rel="canonical" href="https://midastechnicalsolutions.com/products/iphone-15-screen/">
<!-- URL: /products/iphone-15-screen/?size=6.1-inch -->
```

### Category Pages with Filters
```html
<!-- Base category -->
<link rel="canonical" href="https://midastechnicalsolutions.com/iphone-parts/">
<!-- URL: /iphone-parts/ -->

<!-- Filtered category - canonical to base -->
<link rel="canonical" href="https://midastechnicalsolutions.com/iphone-parts/">
<!-- URL: /iphone-parts/?brand=apple&price=min-100 -->

<!-- Separate filtered page (if substantial content difference) -->
<link rel="canonical" href="https://midastechnicalsolutions.com/iphone-parts/apple-screens/">
<!-- URL: /iphone-parts/apple-screens/ -->
```

## 5. Local SEO Canonical Strategy

### City-Specific Pages
```html
<!-- Base city page -->
<link rel="canonical" href="https://midastechnicalsolutions.com/los-angeles/">
<!-- URL: /los-angeles/ -->

<!-- City service page -->
<link rel="canonical" href="https://midastechnicalsolutions.com/los-angeles/iphone-parts-wholesale/">
<!-- URL: /los-angeles/iphone-parts-wholesale/ -->

<!-- Avoid duplicate city content -->
<link rel="canonical" href="https://midastechnicalsolutions.com/los-angeles/">
<!-- URL: /los-angeles/cell-phone-parts-supplier/ -->
```

### Service Area Variations
```html
<!-- Primary service area -->
<link rel="canonical" href="https://midastechnicalsolutions.com/california/">
<!-- URL: /california/ -->

<!-- City variations - canonical to state if similar content -->
<link rel="canonical" href="https://midastechnicalsolutions.com/california/">
<!-- URL: /los-angeles/ -->
```

## 6. Dynamic Canonical Implementation

### JavaScript-Based Canonical (Advanced)
```javascript
function setCanonical(url) {
  // Remove existing canonical
  const existing = document.querySelector('link[rel="canonical"]');
  if (existing) existing.remove();

  // Add new canonical
  const link = document.createElement('link');
  link.rel = 'canonical';
  link.href = url;
  document.head.appendChild(link);
}

// Usage examples
if (window.location.search.includes('sort=') || window.location.search.includes('filter=')) {
  // Filtered pages canonical to base
  setCanonical(window.location.origin + window.location.pathname);
} else if (window.location.pathname.includes('/page/')) {
  // Pagination pages self-reference
  setCanonical(window.location.href);
} else {
  // Standard pages
  setCanonical(window.location.href);
}
```

### Server-Side Canonical (Next.js)
```jsx
// pages/[...slug].js
export default function DynamicPage({ canonicalUrl }) {
  return (
    <Head>
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  );
}

export async function getServerSideProps({ req, resolvedUrl }) {
  // Logic to determine canonical URL
  let canonicalUrl = `https://midastechnicalsolutions.com${resolvedUrl}`;

  // Remove query parameters for filtered pages
  if (req.url.includes('?')) {
    const url = new URL(req.url, `https://midastechnicalsolutions.com`);
    if (url.searchParams.has('sort') || url.searchParams.has('filter')) {
      canonicalUrl = `https://midastechnicalsolutions.com${url.pathname}`;
    }
  }

  return { props: { canonicalUrl } };
}
```

## 7. Canonical Tag Audit and Monitoring

### Regular Audits
```bash
# Find pages with multiple canonical tags
grep -r "rel=\"canonical\"" public/ | wc -l

# Check for canonical chains
curl -s https://midastechnicalsolutions.com/page/ | grep "canonical"

# Validate canonical URLs exist
curl -s https://midastechnicalsolutions.com/canonical-url/ | head -n 1
```

### Google Search Console Monitoring
- Check for "Duplicate, submitted URL not selected as canonical" issues
- Monitor "Duplicate without user-selected canonical" warnings
- Review "Submitted URL marked 'noindex'" reports

### Automated Canonical Validation
```javascript
// Canonical validation script
function validateCanonicals() {
  const canonicals = document.querySelectorAll('link[rel="canonical"]');

  canonicals.forEach(canonical => {
    fetch(canonical.href, { method: 'HEAD' })
      .then(response => {
        if (!response.ok) {
          console.error('Broken canonical URL:', canonical.href);
        }
      })
      .catch(error => {
        console.error('Canonical validation failed:', error);
      });
  });
}
```

## 8. Common Canonical Mistakes to Avoid

### ❌ Wrong Canonical Implementations
```html
<!-- Don't canonical to HTTP -->
<link rel="canonical" href="http://midastechnicalsolutions.com/page/">

<!-- Don't canonical to different domain -->
<link rel="canonical" href="https://example.com/page/">

<!-- Don't use relative URLs -->
<link rel="canonical" href="/page/">

<!-- Don't canonical filtered pages to themselves -->
<link rel="canonical" href="https://midastechnicalsolutions.com/products/?sort=price">
```

### ✅ Correct Implementations
```html
<!-- Always HTTPS -->
<link rel="canonical" href="https://midastechnicalsolutions.com/products/">

<!-- Same domain -->
<link rel="canonical" href="https://midastechnicalsolutions.com/products/">

<!-- Absolute URLs -->
<link rel="canonical" href="https://midastechnicalsolutions.com/products/">

<!-- Filtered pages canonical to base -->
<link rel="canonical" href="https://midastechnicalsolutions.com/products/">
```

## 9. Canonical Tag Testing Tools

### Manual Testing
- **Browser DevTools**: Check Network tab for canonical headers
- **Screaming Frog**: Crawl and audit canonical tags
- **Sitebulb**: Advanced canonical analysis
- **Google Rich Results Test**: Validate canonical implementation

### Automated Testing
```javascript
// Canonical tag validator
const canonicalValidator = {
  checkCanonical: function() {
    const canonical = document.querySelector('link[rel="canonical"]');

    if (!canonical) {
      console.warn('Missing canonical tag');
      return false;
    }

    if (!canonical.href.startsWith('https://midastechnicalsolutions.com')) {
      console.error('Canonical points to wrong domain:', canonical.href);
      return false;
    }

    if (canonical.href.includes('?')) {
      const url = new URL(canonical.href);
      if (url.searchParams.has('sort') || url.searchParams.has('filter')) {
        console.warn('Canonical includes filter parameters:', canonical.href);
      }
    }

    return true;
  }
};
```

## 10. Implementation Checklist

### Phase 1: Basic Setup
- [ ] Add canonical tags to all pages
- [ ] Implement dynamic canonical for filtered pages
- [ ] Set up canonical for pagination
- [ ] Test canonical implementation

### Phase 2: Advanced Implementation
- [ ] Implement server-side canonical logic
- [ ] Set up canonical monitoring
- [ ] Create canonical audit process
- [ ] Integrate with CMS/dynamic content

### Phase 3: Monitoring and Maintenance
- [ ] Regular canonical audits
- [ ] Monitor for canonical-related issues in GSC
- [ ] Update canonical strategy as site grows
- [ ] Document canonical rules for content team

## 11. Canonical Tag Best Practices Summary

1. **Always use absolute HTTPS URLs**
2. **Canonical filtered/sorted pages to base URLs**
3. **Self-reference pagination pages**
4. **Use one canonical tag per page**
5. **Canonical to the most important version of content**
6. **Regular audit and monitoring**
7. **Test implementation thoroughly**

This canonical strategy ensures proper SEO value consolidation and prevents duplicate content issues across your MobileSentrix clone.
