# Image Optimization Rules for Midas Technical Solutions

## Overview
Complete image optimization strategy to improve Core Web Vitals (LCP/CLS) and overall site performance.

## 1. Format Optimization

### Primary Format: WebP
```html
<!-- Modern browsers -->
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description" loading="lazy">
</picture>
```

### Fallback Chain
```html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <source srcset="image.jpg" type="image/jpeg">
  <img src="image.jpg" alt="Description" width="800" height="600" loading="lazy">
</picture>
```

## 2. Responsive Images with Srcset

### Product Images (E-commerce)
```html
<img srcset="
  /images/product-mobile.jpg 480w,
  /images/product-tablet.jpg 768w,
  /images/product-desktop.jpg 1024w,
  /images/product-large.jpg 1920w"
  sizes="(max-width: 480px) 100vw,
         (max-width: 768px) 50vw,
         (max-width: 1024px) 33vw,
         25vw"
  src="/images/product-desktop.jpg"
  alt="iPhone 15 Screen"
  width="800"
  height="600"
  loading="lazy">
```

### Hero Banner Images
```html
<img srcset="
  /images/hero-mobile.webp 480w,
  /images/hero-tablet.webp 768w,
  /images/hero-desktop.webp 1200w"
  sizes="(max-width: 768px) 100vw, 1200px"
  src="/images/hero-desktop.webp"
  alt="Wholesale Cell Phone Parts"
  width="1200"
  height="400"
  fetchpriority="high">
```

## 3. Lazy Loading Implementation

### Native Lazy Loading (Recommended)
```html
<!-- Above the fold - no lazy loading -->
<img src="hero-image.webp" alt="Hero" width="1200" height="400" fetchpriority="high">

<!-- Below the fold - lazy loading -->
<img src="product-image.webp" alt="Product" width="400" height="400" loading="lazy" decoding="async">
```

### Intersection Observer (Advanced)
```javascript
const images = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.remove('lazy');
      imageObserver.unobserve(img);
    }
  });
});

images.forEach(img => imageObserver.observe(img));
```

## 4. Compression and Quality Settings

### Compression Levels by Use Case
- **Hero images**: 80-85% quality (balance between size and visual quality)
- **Product images**: 85-90% quality (high detail required)
- **Thumbnail images**: 70-80% quality (smaller file sizes acceptable)
- **Background images**: 60-70% quality (less critical for user experience)

### Automated Optimization Commands
```bash
# ImageMagick for batch processing
mogrify -quality 85% -format webp *.jpg
mogrify -resize 1920x1920\> -quality 80% *.jpg

# Sharp (Node.js)
const sharp = require('sharp');
await sharp('input.jpg')
  .resize(800, 600, { fit: 'inside' })
  .webp({ quality: 85 })
  .toFile('output.webp');
```

## 5. CDN and Delivery Optimization

### Netlify Image CDN (Recommended)
```html
<!-- Automatic optimization -->
<img src="/images/product.jpg?nf_resize=fit&w=800&h=600" alt="Product" width="800" height="600" loading="lazy">

<!-- Multiple formats -->
<img src="/images/product.jpg?nf_resize=fit&w=800&h=600&format=webp" alt="Product" width="800" height="600" loading="lazy">
```

### Custom Image Component (React)
```jsx
const OptimizedImage = ({ src, alt, width, height, priority = false }) => {
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  const avifSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.avif');

  return (
    <picture>
      <source srcSet={avifSrc} type="image/avif" />
      <source srcSet={webpSrc} type="image/webp" />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        fetchpriority={priority ? "high" : "auto"}
        decoding="async"
      />
    </picture>
  );
};
```

## 6. Aspect Ratio and Layout Shift Prevention

### CSS Aspect Ratio (Modern)
```css
.product-image {
  aspect-ratio: 4 / 3;
  width: 100%;
  height: auto;
  object-fit: cover;
}
```

### Padding Technique (Legacy Support)
```css
.aspect-ratio-box {
  position: relative;
  width: 100%;
  padding-bottom: 75%; /* 4:3 aspect ratio */
}

.aspect-ratio-box img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

## 7. Performance Monitoring

### Image Performance Metrics
```javascript
// Monitor Largest Contentful Paint
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.element.tagName === 'IMG') {
      console.log('LCP Image:', entry.element.src, entry.startTime);
    }
  }
}).observe({ entryTypes: ['largest-contentful-paint'] });
```

### Automated Image Optimization CI/CD
```yaml
# GitHub Actions workflow
name: Optimize Images
on:
  push:
    paths:
      - 'public/images/**'

jobs:
  optimize:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Optimize Images
        uses: calibreapp/image-actions@main
        with:
          jpegQuality: 85
          pngQuality: 85
          webpQuality: 85
```

## 8. Image SEO Best Practices

### Alt Text Optimization
```html
<!-- Good alt text -->
<img src="iphone-15-screen.webp" alt="iPhone 15 Pro Max OLED screen replacement part" width="400" height="400" loading="lazy">

<!-- Bad alt text -->
<img src="screen.jpg" alt="image" width="400" height="400" loading="lazy">
```

### Structured Data for Images
```json
{
  "@context": "https://schema.org",
  "@type": "ImageObject",
  "contentUrl": "https://midastechnicalsolutions.com/images/iphone-15-screen.jpg",
  "url": "https://midastechnicalsolutions.com/images/iphone-15-screen.jpg",
  "name": "iPhone 15 Pro Max Screen",
  "description": "OEM quality OLED screen replacement for iPhone 15 Pro Max",
  "width": 800,
  "height": 600,
  "representativeOfPage": true
}
```

## 9. Implementation Checklist

### Phase 1: Immediate Optimizations
- [ ] Convert existing images to WebP format
- [ ] Add width/height attributes to prevent CLS
- [ ] Implement lazy loading on below-fold images
- [ ] Set up responsive images with srcset

### Phase 2: Advanced Optimizations
- [ ] Implement automated image optimization pipeline
- [ ] Add AVIF format support for modern browsers
- [ ] Set up image CDN with automatic resizing
- [ ] Implement proper alt text for all images

### Phase 3: Monitoring and Maintenance
- [ ] Set up image performance monitoring
- [ ] Create automated optimization workflows
- [ ] Implement image quality assurance checks
- [ ] Regular audit of image performance impact

## 10. Tools and Resources

### Optimization Tools
- **ImageMagick**: Command-line image processing
- **Sharp**: Node.js image processing library
- **Squoosh**: Google's online image optimizer
- **TinyPNG**: Lossy PNG/JPEG optimization

### CDN Solutions
- **Netlify Image CDN**: Automatic optimization and resizing
- **Cloudinary**: Advanced image management and optimization
- **Imgix**: Real-time image processing and optimization
- **Akamai Image Manager**: Enterprise image optimization

### Testing Tools
- **Google PageSpeed Insights**: Image optimization recommendations
- **Lighthouse**: Image performance auditing
- **WebPageTest**: Image loading performance analysis
- **GTmetrix**: Image optimization scoring

This comprehensive image optimization strategy ensures fast loading times, excellent Core Web Vitals scores, and optimal user experience across all devices.
