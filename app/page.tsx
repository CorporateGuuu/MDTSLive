import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';

// Dynamic metadata for homepage
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Create server Supabase client
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Fetch product count
    const { count: productCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // Fetch featured products for Open Graph image and structured data
    const { data: featuredProducts } = await supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        price,
        images,
        thumbnail_url,
        short_description,
        description,
        categories (name, slug)
      `)
      .eq('is_featured', true)
      .eq('is_active', true)
      .limit(10);

    // Get featured products with review data for structured data
    const featuredProductsWithReviews = featuredProducts ? await Promise.all(
      featuredProducts.slice(0, 10).map(async (product) => {
        const { data: reviewsData } = await supabase
          .from('reviews')
          .select('rating')
          .eq('product_id', product.id);

        let aggregateRating = null;
        if (reviewsData && reviewsData.length > 0) {
          const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0);
          const averageRating = totalRating / reviewsData.length;

          aggregateRating = {
            "@type": "AggregateRating",
            "ratingValue": Math.round(averageRating * 10) / 10,
            "reviewCount": reviewsData.length,
            "bestRating": 5,
            "worstRating": 1
          };
        }

        return {
          ...product,
          aggregateRating
        };
      })
    ) : [];

    const heroImage = featuredProducts?.[0]?.images?.[0] ||
                      featuredProducts?.[0]?.thumbnail_url ||
                      '/logos/midas-homepage-hero.jpg';

    const title = `Midas Technical Solutions | Premium Wholesale Phone Parts & Tools (${productCount || 0} SKUs)`;
    const description = `Leading wholesale supplier of MidasGold 7.0 screens, 2025 iPhone parts bulk, Samsung screen replacements, and professional repair tools. Authorized distributor with lifetime warranty and next-day shipping. ${productCount || 0}+ premium SKUs available.`;

    return {
      title,
      description,
      keywords: [
        'wholesale phone parts',
        'MidasGold 7.0 screens wholesale',
        '2025 iPhone parts bulk',
        'Samsung screen replacements',
        'phone repair tools supplier',
        'bulk electronics parts',
        'authorized distributor',
        'lifetime warranty',
        'premium phone parts',
        'repair tools wholesale',
        'mobile parts bulk',
        'iPhone screen replacement wholesale',
        'Samsung parts bulk pricing',
        'professional repair toolkit',
        'MidasGold 7.0 technology',
        'fast shipping wholesale',
        'next day delivery parts'
      ],
      openGraph: {
        title,
        description,
        url: 'https://midastechnicalsolutions.com',
        siteName: 'Midas Technical Solutions',
        images: [
          {
            url: heroImage,
            width: 1200,
            height: 630,
            alt: 'Midas Technical Solutions - Premium Wholesale Phone Parts & Repair Tools',
            type: 'image/jpeg',
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [heroImage],
        creator: '@MidasTechnical',
      },
      other: {
        'product:retailer_title': 'Midas Technical Solutions Wholesale',
        'product:price:currency': 'USD',
        'business:contact_data:street_address': '123 Wholesale Way',
        'business:contact_data:locality': 'Miami',
        'business:contact_data:region': 'FL',
        'business:contact_data:postal_code': '33101',
        'business:contact_data:country_name': 'United States',
        'business:contact_data:phone_number': '+1-888-545-2121',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    // Fallback metadata
    return {
      title: 'Midas Technical Solutions | Premium Wholesale Phone Parts & Tools',
      description: 'Leading wholesale supplier of MidasGold 7.0 screens, premium phone parts, and professional repair tools. Authorized distributor with lifetime warranty.',
      openGraph: {
        title: 'Midas Technical Solutions | Premium Wholesale Phone Parts & Tools',
        description: 'Leading wholesale supplier of MidasGold 7.0 screens, premium phone parts, and professional repair tools.',
        images: ['/logos/midas-homepage-hero.jpg'],
      },
    };
  }
}

'use client';

// ISR configuration for fresh Supabase data
export const revalidate = 3600; // Revalidate every hour

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface MegaMenuItem {
  name: string;
  href: string;
  image?: string;
  icon?: React.ComponentType<any>;
}

interface MegaMenuColumn {
  title: string;
  items: MegaMenuItem[];
}

interface MegaMenuData {
  columns?: MegaMenuColumn[];
  type?: string;
  promo?: {
    title: string;
    description: string;
    image: string;
    cta: string;
  };
  items?: MegaMenuItem[];
}

export default function Home() {
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [mobileMegaMenuStates, setMobileMegaMenuStates] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [shippingCutoff, setShippingCutoff] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [featuredProductsWithReviews, setFeaturedProductsWithReviews] = useState<any[]>([]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search query using TanStack Query
  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ['search', debouncedSearchQuery],
    queryFn: async () => {
      if (!debouncedSearchQuery.trim()) return [];

      try {
        // First try with search_vector (FTS)
        let { data, error } = await supabase
          .from('products')
          .select('id, name, slug, price, images, thumbnail_url, description, category_id, brand_id, categories(name), brands(name)')
          .textSearch('search_vector', debouncedSearchQuery)
          .eq('is_active', true)
          .limit(8);

        // If no results and search_vector doesn't exist yet, fallback to basic search
        if (error || !data || data.length === 0) {
          console.log('FTS search failed, trying basic search:', error?.message);

          const { data: fallbackData, error: fallbackError } = await supabase
            .from('products')
            .select('id, name, slug, price, images, thumbnail_url, description, category_id, brand_id, categories(name), brands(name)')
            .or(`name.ilike.%${debouncedSearchQuery}%,description.ilike.%${debouncedSearchQuery}%`)
            .eq('is_active', true)
            .limit(8);

          if (fallbackError) throw fallbackError;
          data = fallbackData;
        }

        return data || [];
      } catch (error) {
        console.error('Search error:', error);
        return [];
      }
    },
    enabled: debouncedSearchQuery.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setIsSearchDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Open dropdown when typing
  useEffect(() => {
    if (searchQuery.length > 0) {
      setIsSearchDropdownOpen(true);
    } else {
      setIsSearchDropdownOpen(false);
    }
  }, [searchQuery]);

  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Authentication state
  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Auth session error:', error);
        setUser(null);
      }
    };
    getInitialSession();

    let subscription: any = null;
    try {
      const { data: { subscription: sub } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setUser(session?.user ?? null);
        }
      );
      subscription = sub;
    } catch (error) {
      console.error('Auth subscription error:', error);
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  // Load cart items on mount and when user changes
  useEffect(() => {
    const loadCart = async () => {
      try {
        const items = await getCartItems();
        setCartItems(items.map((item: any) => ({
          id: item.id,
          name: item.products?.name || 'Unknown Product',
          price: item.products?.price || 0,
          image: item.products?.images?.[0] || '/placeholder.svg'
        })));
        const total = await getCartTotal();
        setCartTotal(total);
      } catch (error) {
        console.error('Error loading cart:', error);
        // Set default empty cart state on error
        setCartItems([]);
        setCartTotal(0);
      }
    };

    loadCart();

    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [user]);

  // Countdown timer for year-end
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const yearEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59); // December 31st of current year
      const difference = yearEnd.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  // Shipping cutoff timer
  useEffect(() => {
    const calculateShippingCutoff = () => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const cutoff = new Date(today.getTime() + (19.5 * 60 * 60 * 1000)); // 7:30 PM EST
      const difference = cutoff.getTime() - now.getTime();

      if (difference > 0) {
        setShippingCutoff({
          hours: Math.floor(difference / (1000 * 60 * 60)),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateShippingCutoff();
    const timer = setInterval(calculateShippingCutoff, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch featured products with reviews for structured data
  useEffect(() => {
    const fetchFeaturedProductsWithReviews = async () => {
      try {
        const { data: featuredProducts } = await supabase
          .from('products')
          .select(`
            id,
            name,
            slug,
            price,
            images,
            thumbnail_url,
            short_description,
            description,
            categories (name, slug)
          `)
          .eq('is_featured', true)
          .eq('is_active', true)
          .limit(10);

        const featuredProductsWithReviews = featuredProducts ? await Promise.all(
          featuredProducts.slice(0, 10).map(async (product) => {
            const { data: reviewsData } = await supabase
              .from('reviews')
              .select('rating')
              .eq('product_id', product.id);

            let aggregateRating = null;
            if (reviewsData && reviewsData.length > 0) {
              const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0);
              const averageRating = totalRating / reviewsData.length;

              aggregateRating = {
                "@type": "AggregateRating",
                "ratingValue": Math.round(averageRating * 10) / 10,
                "reviewCount": reviewsData.length,
                "bestRating": 5,
                "worstRating": 1
              };
            }

            return {
              ...product,
              aggregateRating
            };
          })
        ) : [];

        setFeaturedProductsWithReviews(featuredProductsWithReviews);
      } catch (error) {
        console.error('Error fetching featured products with reviews:', error);
        setFeaturedProductsWithReviews([]);
      }
    };

    fetchFeaturedProductsWithReviews();
  }, []);

  // Cookie consent banner
  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Show cookie banner after 3 seconds
      const timer = setTimeout(() => {
        setShowCookieBanner(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleCookieAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowCookieBanner(false);
  };

  const featuredDevices = [
    {
      name: 'iPhone 16 Series',
      image: '/images/iphone-16-series.jpg',
      overlayText: 'Massive Savings on 2025 Models'
    },
    {
      name: 'Galaxy S25 & A56 2025',
      image: '/images/galaxy-s25-a56.jpg',
      overlayText: 'Latest Samsung Flagships'
    },
    {
      name: 'Pixel 9 Series',
      image: '/images/pixel-9.jpg',
      overlayText: 'Stock Up on Genuine Parts'
    },
    {
      name: 'Premium Tablets 2025',
      image: '/images/tablets-2025.jpg',
      overlayText: 'Exclusive Device Deals'
    },
  ];

  const qualityFeatures = [
    { icon: Shield, text: 'Lifetime Warranty on Parts', color: 'text-gold' },
    { icon: Smartphone, text: 'Ready-to-Sell Devices', color: 'text-navy' },
    { icon: Package, text: 'Premium Toolkits', color: 'text-green-500' },
    { icon: Wrench, text: 'Expert Repair Services', color: 'text-orange-500' },
    { icon: Star, text: 'Certified Quality Standards', color: 'text-yellow-500' }
  ];

  // Mega Menu Data Structure
  const megaMenuData = {
    'Repair Guides': {
      columns: [
        {
          title: 'Device Categories',
          items: [
            { name: 'iPhone Repair Guides', href: '/guides?device=iPhone' },
            { name: 'Samsung Repair Guides', href: '/guides?device=Samsung' },
            { name: 'iPad Repair Guides', href: '/guides?device=iPad' },
            { name: 'MacBook Repair Guides', href: '/guides?device=MacBook' },
            { name: 'Pixel Repair Guides', href: '/guides?device=Pixel' },
            { name: 'All Repair Guides', href: '/guides' }
          ]
        },
        {
          title: 'Difficulty Levels',
          items: [
            { name: 'Easy Repairs', href: '/guides?difficulty=Easy' },
            { name: 'Medium Repairs', href: '/guides?difficulty=Medium' },
            { name: 'Hard Repairs', href: '/guides?difficulty=Hard' },
            { name: 'Professional Only', href: '/guides?difficulty=Hard' }
          ]
        },
        {
          title: 'Popular Guides',
          items: [
            { name: 'iPhone Screen Replacement', href: '/guides/iphone-16-pro-max-screen-replacement', image: '/images/guides/iphone-16-screen.jpg' },
            { name: 'Battery Replacement', href: '/guides/samsung-galaxy-s25-battery-replacement', image: '/images/guides/samsung-s25-battery.jpg' },
            { name: 'Camera Repair', href: '/guides/pixel-9-camera-module-replacement', image: '/images/guides/pixel-9-camera.jpg' },
            { name: 'iPad LCD Replacement', href: '/guides/ipad-pro-12-9-lcd-assembly-replacement', image: '/images/guides/ipad-pro-lcd.jpg' }
          ]
        }
      ]
    },
    Apple: {
      columns: [
        {
          title: 'iPhone Series',
          items: [
            { name: 'iPhone 16 Pro Max', href: '/apple/iphone-16-pro-max' },
            { name: 'iPhone 16 Pro', href: '/apple/iphone-16-pro' },
            { name: 'iPhone 16 Plus', href: '/apple/iphone-16-plus' },
            { name: 'iPhone 16', href: '/apple/iphone-16' },
            { name: 'iPhone 15 Series', href: '/apple/iphone-15-series' },
            { name: 'iPhone 14 Series', href: '/apple/iphone-14-series' }
          ]
        },
        {
          title: 'iPad & Mac',
          items: [
            { name: 'iPad Pro 12.9"', href: '/apple/ipad-pro-12-9' },
            { name: 'iPad Pro 11"', href: '/apple/ipad-pro-11' },
            { name: 'iPad Air', href: '/apple/ipad-air' },
            { name: 'iPad Mini', href: '/apple/ipad-mini' },
            { name: 'MacBook Pro', href: '/apple/macbook-pro' },
            { name: 'MacBook Air', href: '/apple/macbook-air' }
          ]
        },
        {
          title: 'MidasGold 7.0 Screens',
          items: [
            { name: 'OLED Premium Screens', href: '/apple/oled-screens', image: '/images/oled-screen.jpg' },
            { name: 'LCD Replacement', href: '/apple/lcd-screens', image: '/images/lcd-screen.jpg' },
            { name: 'Touch Digitizers', href: '/apple/touch-digitizers', image: '/images/touch-digitizer.jpg' },
            { name: 'Front Glass Panels', href: '/apple/front-glass', image: '/images/front-glass.jpg' }
          ]
        },
        {
          title: 'Top Sellers',
          items: [
            { name: 'iPhone 16 Battery', href: '/apple/iphone-16-battery', image: '/images/battery.jpg' },
            { name: 'iPhone 16 Camera', href: '/apple/iphone-16-camera', image: '/images/camera.jpg' },
            { name: 'iPhone 16 Charging Port', href: '/apple/iphone-16-charging', image: '/images/charging-port.jpg' },
            { name: 'iPhone 16 Screen', href: '/apple/iphone-16-screen', image: '/images/screen.jpg' }
          ]
        }
      ]
    },
    Samsung: {
      columns: [
        {
          title: 'Galaxy S Series',
          items: [
            { name: 'Galaxy S25 Ultra', href: '/samsung/galaxy-s25-ultra' },
            { name: 'Galaxy S25+', href: '/samsung/galaxy-s25-plus' },
            { name: 'Galaxy S25', href: '/samsung/galaxy-s25' },
            { name: 'Galaxy S24 Series', href: '/samsung/galaxy-s24-series' },
            { name: 'Galaxy S23 Series', href: '/samsung/galaxy-s23-series' }
          ]
        },
        {
          title: 'Galaxy A Series',
          items: [
            { name: 'Galaxy A56 (2025)', href: '/samsung/galaxy-a56-2025' },
            { name: 'Galaxy A55', href: '/samsung/galaxy-a55' },
            { name: 'Galaxy A54', href: '/samsung/galaxy-a54' },
            { name: 'Galaxy A53', href: '/samsung/galaxy-a53' },
            { name: 'Galaxy A52', href: '/samsung/galaxy-a52' }
          ]
        },
        {
          title: 'Galaxy Tab Series',
          items: [
            { name: 'Galaxy Tab S10', href: '/samsung/galaxy-tab-s10' },
            { name: 'Galaxy Tab S9', href: '/samsung/galaxy-tab-s9' },
            { name: 'Galaxy Tab A9', href: '/samsung/galaxy-tab-a9' },
            { name: 'Galaxy Tab Active', href: '/samsung/galaxy-tab-active' }
          ]
        }
      ]
    },
    'Tools & Supplies': {
      type: 'grid',
      promo: {
        title: 'Midas Precision Toolkits',
        description: 'Professional-grade repair tools with lifetime warranty',
        image: '/images/toolkit-promo.jpg',
        cta: 'Shop Toolkits'
      },
      items: [
        { name: 'Precision Screwdrivers', href: '/tools/precision-screwdrivers', icon: ToolIcon },
        { name: 'Opening Tools & Pry Bars', href: '/tools/opening-tools', icon: Hammer },
        { name: 'Heat Guns & Heat Mats', href: '/tools/heat-guns', icon: Zap },
        { name: 'Adhesive & Glue Guns', href: '/tools/adhesives', icon: Layers },
        { name: 'Soldering Equipment', href: '/tools/soldering', icon: Cog },
        { name: 'Testing & Diagnostic', href: '/tools/testing', icon: Settings },
        { name: 'Cleaning Supplies', href: '/tools/cleaning', icon: Zap },
        { name: 'Anti-Static Protection', href: '/tools/anti-static', icon: Shield }
      ]
    }
  };

  // Mobile Mega Menu Component
  const MobileMegaMenu = ({ category, isOpen, onToggle }: { category: string, isOpen: boolean, onToggle: () => void }) => {
    const data = megaMenuData[category as keyof typeof megaMenuData] as MegaMenuData;

    if (!data) return null;

    return (
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0 }}
        className="overflow-hidden"
      >
        <div className="bg-white border-t border-gray-200 px-4 py-4">
          {data.type === 'grid' ? (
            // Tools & Supplies grid layout
            <div>
              {/* Promo Banner */}
              {data.promo && (
                <div className="bg-gradient-to-r from-gold to-yellow-500 rounded-lg p-4 mb-4 text-white">
                  <h3 className="font-bold text-lg mb-2">{data.promo.title}</h3>
                  <p className="text-sm mb-3">{data.promo.description}</p>
                  <button className="bg-white text-gold px-4 py-2 rounded font-semibold text-sm">
                    {data.promo.cta}
                  </button>
                </div>
              )}

              {/* Tool Grid */}
              <div className="grid grid-cols-2 gap-3">
                {data.items?.map((item: MegaMenuItem, index: number) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-gold hover:text-white transition-colors"
                  >
                    {item.icon && <item.icon size={16} />}
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            // Apple/Samsung column layout
            <div className="space-y-4">
              {data.columns?.map((column: MegaMenuColumn, colIndex: number) => (
                <div key={colIndex}>
                  <h4 className="font-semibold text-gold mb-2">{column.title}</h4>
                  <div className="space-y-1">
                    {column.items.map((item: MegaMenuItem, itemIndex: number) => (
                      <Link
                        key={itemIndex}
                        href={item.href}
                        className="block text-gray-700 hover:text-gold py-1 text-sm"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // Desktop Mega Menu Component
  const MegaMenu = ({ category, isVisible }: { category: string, isVisible: boolean }) => {
    const data = megaMenuData[category as keyof typeof megaMenuData] as MegaMenuData;

    if (!data) return null;

    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 bg-white shadow-2xl border border-gray-200 rounded-lg overflow-hidden z-50 w-screen max-w-7xl"
          >
            <div className="p-8">
              {data.type === 'grid' ? (
                // Tools & Supplies grid layout
                <div className="grid grid-cols-3 gap-8">
                  {/* Tool Categories */}
                  <div className="col-span-2">
                    <h3 className="text-xl font-bold text-gold mb-6">Professional Repair Tools</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {data.items?.map((item: MegaMenuItem, index: number) => (
                        <Link
                          key={index}
                          href={item.href}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                          <div className="bg-gray-100 p-2 rounded-lg group-hover:bg-gold group-hover:text-white transition-colors">
                            {item.icon && <item.icon size={20} />}
                          </div>
                          <span className="font-medium text-gray-800 group-hover:text-gold transition-colors">
                            {item.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Promo Section */}
                  {data.promo && (
                    <div className="bg-gradient-to-br from-gold to-yellow-500 rounded-lg p-6 text-white">
                      <h4 className="text-xl font-bold mb-3">{data.promo.title}</h4>
                      <p className="text-sm mb-4 opacity-90">{data.promo.description}</p>
                      <button className="bg-white text-gold px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                        {data.promo.cta}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Apple/Samsung column layout
                <div className="grid grid-cols-4 gap-8">
                  {data.columns?.map((column: MegaMenuColumn, colIndex: number) => (
                    <div key={colIndex}>
                      <h4 className="text-lg font-bold text-gold mb-4">{column.title}</h4>
                      <ul className="space-y-3">
                        {column.items.map((item: MegaMenuItem, itemIndex: number) => (
                          <li key={itemIndex}>
                            <Link
                              href={item.href}
                              className="text-gray-700 hover:text-gold transition-colors flex items-center space-x-2"
                            >
                              {item.image && (
                                <img src={item.image} alt={item.name} className="w-8 h-8 object-cover rounded" />
                              )}
                              <span className="font-medium">{item.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // Auto-play carousel
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredDevices.length);
      }, 5000);
    }
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, featuredDevices.length]);

  // Touch handlers for carousel swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };

  // Keyboard navigation for carousel
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
    }
  };



  // Search functionality
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleAddToCartFromSearch = async (product: any) => {
    try {
      await addToCart(product.name, 1);
      setShowCartNotification(true);
      setTimeout(() => setShowCartNotification(false), 3000);
      setIsSearchDropdownOpen(false);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // Cart functionality
  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    try {
      if (newQuantity <= 0) {
        await removeFromCart(itemId);
      } else {
        await updateCartQuantity(itemId, newQuantity);
      }
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const handleCheckout = () => {
    window.location.href = '/checkout';
  };

  // Calculate shipping progress
  const FREE_SHIPPING_THRESHOLD = 99.99;
  const shippingProgress = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);

  // Tax and shipping estimates (simplified)
  const estimatedTax = cartTotal * 0.08; // 8% tax
  const estimatedShipping = cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : 9.99;
  const orderTotal = cartTotal + estimatedTax + estimatedShipping;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredDevices.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredDevices.length) % featuredDevices.length);
  };

  const handleAddToCart = async (device: typeof featuredDevices[0]) => {
    try {
      // Use the cart utility to add item
      await addToCart(device.name, 1); // We'll need to map this to product IDs later

      // Show notification
      setShowCartNotification(true);
      setTimeout(() => setShowCartNotification(false), 3000);

      // Enhanced fly-to-cart animation
      const cartIcon = document.querySelector('.cart-icon');
      if (cartIcon) {
        cartIcon.classList.add('animate-bounce', 'scale-110');
        setTimeout(() => {
          cartIcon.classList.remove('animate-bounce', 'scale-110');
        }, 1000);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleAuthSuccess = async (user: any) => {
    console.log('User authenticated:', user);
    // Sync guest cart to database after successful authentication
    await syncCart();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    console.log(`Country changed to: ${country}`);
  };



  return (
    <>
      <main className="min-h-screen bg-white">
      {/* Cart Notification */}
      {showCartNotification && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          <div className="flex items-center space-x-2">
            <span className="text-lg">✓</span>
            <span className="font-medium">Item added to cart!</span>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      <Drawer.Root open={isCartOpen} onOpenChange={setIsCartOpen}>
        <Drawer.Trigger asChild>
          <button className="flex items-center space-x-2 text-gray-700 hover:text-gold transition-colors cart-icon">
            <div className="relative">
              <ShoppingCart size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                  {cartItems.length}
                </span>
              )}
            </div>
            <span className="text-sm font-medium">${cartTotal.toFixed(2)}</span>
          </button>
        </Drawer.Trigger>
        <Drawer.Content className="max-h-[85vh] bg-white">
          <div className="mx-auto w-full max-w-2xl">
            <div className="p-6">
              {/* Cart Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart size={48} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                    <p className="text-gray-500 mb-4">Add some products to get started</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="bg-gold hover:bg-opacity-90 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  cartItems.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                        <p className="text-gold font-semibold">${item.price.toFixed(2)}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Free Shipping Progress */}
              {cartItems.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Free Shipping Progress</span>
                    <span className="text-sm text-gray-500">${remainingForFreeShipping.toFixed(2)} more</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gold h-2 rounded-full transition-all duration-300"
                      style={{ width: `${shippingProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {remainingForFreeShipping > 0
                      ? `Add $${remainingForFreeShipping.toFixed(2)} more for free shipping`
                      : '🎉 You qualify for free shipping!'
                    }
                  </p>
                </div>
              )}

              {/* Order Summary */}
              {cartItems.length > 0 && (
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping:</span>
                    <span className={estimatedShipping === 0 ? 'text-green-600' : ''}>
                      {estimatedShipping === 0 ? 'FREE' : `$${estimatedShipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax:</span>
                    <span>${estimatedTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>${orderTotal.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Checkout Button */}
              {cartItems.length > 0 && (
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gold hover:bg-opacity-90 text-white py-4 rounded-lg font-bold text-lg transition-colors mt-6"
                >
                  Proceed to Checkout
                </button>
              )}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Root>

      {/* Live Chat Widget */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-4">
        {/* Chat Panel */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-80 mb-4"
            >
              {/* Chat Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Midas Support</h3>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Chat Content */}
              <div className="space-y-4">
                <p className="text-gray-700 font-medium">How can we help?</p>

                {/* Contact Options */}
                <div className="space-y-3">
                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/18885452121"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsChatOpen(false)}
                    className="flex items-center space-x-3 w-full bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-3 transition-colors"
                  >
                    <div className="bg-green-500 text-white rounded-full p-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.742.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-green-800">WhatsApp</div>
                      <div className="text-xs text-green-600">Instant messaging</div>
                    </div>
                  </a>

                  {/* Live Chat */}
                  <button
                    onClick={() => {
                      // TODO: Integrate Tawk.to or other live chat service
                      alert('Live chat feature coming soon! Please use WhatsApp or email for now.');
                      setIsChatOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg p-3 transition-colors"
                  >
                    <div className="bg-red-500 text-white rounded-full p-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-red-800">Live Chat</div>
                      <div className="text-xs text-red-600">Real-time support</div>
                    </div>
                  </button>

                  {/* Email */}
                  <a
                    href="mailto:support@midastechnical.com"
                    onClick={() => setIsChatOpen(false)}
                    className="flex items-center space-x-3 w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-3 transition-colors"
                  >
                    <div className="bg-blue-500 text-white rounded-full p-2">
                      <Mail size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-blue-800">Email Us</div>
                      <div className="text-xs text-blue-600">support@midastechnical.com</div>
                    </div>
                  </a>
                </div>

                {/* Response Time */}
                <div className="text-center pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500">Average response < 2 min</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-[#D4AF37] hover:bg-opacity-90 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
          style={{ backgroundColor: '#D4AF37' }}
          aria-label="Open chat support"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      </div>

      {/* Mobile-First Header */}
      <header className="sticky top-0 bg-white shadow-lg z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Shipping Cutoff Timer */}
          <div className="bg-gradient-to-r from-gold to-yellow-500 text-white text-center py-2 px-4">
            <div className="flex items-center justify-center space-x-4 text-sm font-medium">
              <Truck size={16} />
              <span>
                Order by {shippingCutoff.hours.toString().padStart(2, '0')}:
                {shippingCutoff.minutes.toString().padStart(2, '0')}:
                {shippingCutoff.seconds.toString().padStart(2, '0')} EST for next-day delivery
              </span>
              <Truck size={16} />
            </div>
          </div>

          {/* Mobile-First Top Bar */}
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button - First on Mobile */}
            <button
              className="lg:hidden text-gray-700 hover:text-gold transition-colors mr-4"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo - Centered on Mobile, Left on Desktop */}
            <div className="flex items-center lg:flex-1">
              <Link href="/" className="flex items-center">
              <img
                src="/logos/midas-logo-compact.svg"
                alt="Midas Technical Solutions - Premium Wholesale Phone Parts & Repair Tools Logo"
                className="h-8 w-auto lg:h-10"
              />
              </Link>
            </div>

            {/* Desktop Search - Hidden on Mobile */}
            <div className="hidden lg:block flex-1 max-w-lg mx-8 relative">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search parts, tools, accessories..."
                  className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gold text-white p-2 rounded-full hover:bg-opacity-90 transition-colors"
                  aria-label="Search"
                >
                  <Search size={16} />
                </button>
              </form>

              {/* Search Dropdown */}
              <AnimatePresence>
                {isSearchDropdownOpen && (searchResults || searchLoading) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden"
                  >
                    {/* Loading State */}
                    {searchLoading && (
                      <div className="p-4 text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gold mx-auto"></div>
                        <p className="text-gray-500 text-sm mt-2">Searching...</p>
                      </div>
                    )}

                    {/* Results */}
                    {!searchLoading && searchResults && searchResults.length > 0 && (
                      <div className="max-h-80 overflow-y-auto">
                        {/* Category Suggestions */}
                        {debouncedSearchQuery && (
                          <div className="border-b border-gray-100 px-4 py-2 bg-gray-50">
                            <p className="text-xs text-gray-600 font-medium">Suggested Categories</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {['Apple > iPhone 16', 'Samsung > Galaxy S25', 'Tools > Precision Screwdrivers'].map((category, index) => (
                                <button
                                  key={index}
                                  onClick={() => {
                                    setSearchQuery(category);
                                    setIsSearchDropdownOpen(false);
                                  }}
                                  className="text-xs bg-white border border-gray-200 rounded px-2 py-1 hover:bg-gold hover:text-white hover:border-gold transition-colors"
                                >
                                  {category}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Product Results */}
                        {searchResults.map((product: any, index: number) => (
                          <Link
                            key={product.id || index}
                            href={`/product/${product.slug}`}
                            onClick={() => setIsSearchDropdownOpen(false)}
                            className="flex items-center space-x-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            {/* Product Image */}
                            <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                              <img
                                src={product.thumbnail_url || product.images?.[0] || '/placeholder.svg'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = '/placeholder.svg';
                                }}
                              />
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {product.name}
                              </h4>
                              <p className="text-xs text-gray-500 truncate">
                                {product.categories?.name} • {product.brands?.name}
                              </p>
                              <p className="text-sm font-semibold text-gold">
                                ${product.price?.toFixed(2)}
                              </p>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleAddToCartFromSearch(product);
                              }}
                              className="bg-gold hover:bg-opacity-90 text-white px-3 py-1 rounded text-xs font-medium transition-colors flex-shrink-0"
                            >
                              Add to Cart
                            </button>
                          </Link>
                        ))}

                        {/* View All Results */}
                        <div className="border-t border-gray-100 p-3 bg-gray-50">
                          <button
                            onClick={() => {
                              handleSearchSubmit({ preventDefault: () => {} } as any);
                            }}
                            className="w-full text-center text-gold hover:text-opacity-80 font-medium text-sm transition-colors"
                          >
                            View All Results for "{debouncedSearchQuery}"
                          </button>
                        </div>
                      </div>
                    )}

                    {/* No Results */}
                    {!searchLoading && searchResults && searchResults.length === 0 && debouncedSearchQuery && (
                      <div className="p-6 text-center">
                        <Search size={24} className="text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 font-medium">No products found</p>
                        <p className="text-gray-400 text-sm">Try broader search terms</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Icons - Desktop */}
            <div className="hidden lg:flex items-center space-x-6">
              {/* Country Selector */}
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-gold transition-colors">
                  <Flag size={20} className="text-green-600" />
                  <span className="text-sm font-medium">US</span>
                  <ChevronDown size={16} />
                </button>
                <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-48">
                  <div className="py-2">
                    {['United States', 'Canada', 'United Kingdom', 'Australia'].map((country) => (
                      <button
                        key={country}
                        onClick={() => handleCountryChange(country)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                      >
                        {country}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* My Account */}
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-gold transition-colors">
                  <User size={20} />
                  <span className="text-sm font-medium hidden xl:inline">
                    {user ? 'My Account' : 'Sign In'}
                  </span>
                </button>
                {user && (
                  <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-48">
                    <div className="py-2">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center space-x-2"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
                {!user && (
                  <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-48">
                    <div className="py-2">
                      <button
                        onClick={() => setAuthModalOpen(true)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                      >
                        Sign In / Sign Up
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Amazon Payout Badge */}
              <div className="flex items-center space-x-2 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                <Award size={16} className="text-orange-600" />
                <span className="text-xs font-semibold text-orange-700 hidden xl:inline">Amazon Payout</span>
                <span className="text-xs font-semibold text-orange-700 xl:hidden">Payout</span>
              </div>

              {/* Cart */}
              <Link href="/cart" className="flex items-center space-x-2 text-gray-700 hover:text-gold transition-colors cart-icon">
                <div className="relative">
                  <ShoppingCart size={20} />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gold text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                      {cartItems.length}
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium">${cartTotal.toFixed(2)}</span>
              </Link>
            </div>

            {/* Mobile Search Button */}
            <button
              className="lg:hidden text-gray-700 hover:text-gold transition-colors ml-4"
              onClick={() => setSearchExpanded(!searchExpanded)}
              aria-label="Toggle search"
            >
              <Search size={20} />
            </button>
          </div>

          {/* Mobile Search Bar - Expandable */}
          {searchExpanded && (
            <div className="lg:hidden pb-4">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search parts, tools, accessories..."
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gold text-white p-2 rounded-lg hover:bg-opacity-90 transition-colors"
                  aria-label="Search"
                >
                  <Search size={16} />
                </button>
              </form>
            </div>
          )}

          {/* Mega Menu Navigation - Desktop */}
          <nav className="hidden lg:block bg-gray-50 border-t border-gray-200 relative">
            <div className="flex items-center justify-center space-x-6 py-3">
              {Object.keys(megaMenuData).map((category) => (
                <div
                  key={category}
                  className="relative"
                  onMouseEnter={() => setActiveMegaMenu(category)}
                  onMouseLeave={() => setActiveMegaMenu(null)}
                >
                  <button className="text-gray-700 hover:text-gold font-medium text-sm transition-colors relative group py-2 flex items-center space-x-1">
                    <span>{category}</span>
                    <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180" />
                  </button>
                  <MegaMenu category={category} isVisible={activeMegaMenu === category} />
                </div>
              ))}
            </div>
          </nav>

          {/* Mobile Mega Menu Navigation */}
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="block lg:hidden bg-gray-50 border-t border-gray-200 overflow-hidden"
            >
              <div className="p-4 space-y-4">
                {/* Mobile Cart Summary */}
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart size={20} />
                    <span className="font-medium">{cartItems.length} items</span>
                  </div>
                  <span className="font-bold text-gold">${cartTotal.toFixed(2)}</span>
                </div>

                {/* Mobile Country Selector */}
                <div className="space-y-2">
                  <label htmlFor="mobile-country-select" className="text-sm font-medium text-gray-700">Country</label>
                  <select
                    id="mobile-country-select"
                    value={selectedCountry}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    aria-label="Select your country"
                  >
                    {['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany'].map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                {/* Mobile Mega Menu Accordions */}
                <div className="space-y-2">
                  {Object.keys(megaMenuData).map((category) => (
                    <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => {
                          setMobileMegaMenuStates(prev => ({
                            ...prev,
                            [category]: !prev[category]
                          }));
                        }}
                        className="w-full text-left p-4 bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
                      >
                        <span className="font-medium text-gray-800">{category}</span>
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-200 ${
                            mobileMegaMenuStates[category] ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <MobileMegaMenu
                        category={category}
                        isOpen={mobileMegaMenuStates[category] || false}
                        onToggle={() => {}}
                      />
                    </div>
                  ))}
                </div>

                {/* Mobile Quick Links */}
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <Link href="/account" className="block text-gray-700 hover:text-gold font-medium py-2">My Account</Link>
                  <Link href="/support" className="block text-gray-700 hover:text-gold font-medium py-2">Support</Link>
                  <Link href="/contact" className="block text-gray-700 hover:text-gold font-medium py-2">Contact</Link>
                </div>
              </div>
            </motion.nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Top Banner */}
            <div className="bg-gold text-white text-center py-3">
              <div className="flex items-center justify-center space-x-4 text-sm font-medium">
                <span>Extended Black Friday Deals – Exclusive Discounts on Devices Through Year-End</span>
              </div>
            </div>

            {/* Logos */}
            <div className="flex justify-center items-center space-x-4 py-6 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gold">Midas Technical Solutions</span>
                <span className="text-gray-400 text-xl">+</span>
                <span className="text-2xl font-bold text-navy">MobileSentrix</span>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left Side Content */}
              <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent leading-tight">
                  Midas Technical Solutions – Premium Wholesale Phone Parts & Tools
                </h1>
                <h2 className="text-2xl md:text-3xl font-semibold text-gold mb-4">
                  Wholesale iPhone Parts • Bulk Samsung Screens • Phone Repair Tools Supplier
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Leading wholesale supplier of <a href="/category/iphone-parts" className="text-gold hover:underline font-medium">MidasGold 7.0 iPhone screens</a>, premium phone parts, and professional repair tools. Authorized distributor with lifetime warranty and next-day shipping.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        const featuredDealsSection = document.getElementById('featured-deals');
                        if (featuredDealsSection) {
                          featuredDealsSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }
                    }}
                    className="bg-[#D4AF37] hover:bg-opacity-90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                    style={{ backgroundColor: '#D4AF37' }}
                  >
                    Shop Wholesale Parts →
                  </button>
                  <a
                    href="/category/iphone-parts"
                    className="border-2 border-gold text-gold hover:bg-gold hover:text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg text-center"
                  >
                    Browse iPhone Parts
                  </a>
                </div>
              </div>

              {/* Right Side Carousel */}
              <div className="relative bg-gray-50 p-8 md:p-12">
                <div
                  ref={carouselRef}
                  className="relative h-80 md:h-96 bg-white rounded-xl shadow-lg overflow-hidden cursor-grab active:cursor-grabbing"
                  onMouseEnter={() => setIsAutoPlaying(false)}
                  onMouseLeave={() => setIsAutoPlaying(true)}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onKeyDown={handleKeyDown}
                  tabIndex={0}
                  role="region"
                  aria-label="Product carousel"
                >
                  {featuredDevices.map((device, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        index === currentSlide ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <img
                        src={device.image}
                        alt={device.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                        <h3 className="text-white font-bold text-xl mb-2">{device.name}</h3>
                        <p className="text-gold font-semibold text-lg">{device.overlayText}</p>
                        <button
                          onClick={() => handleAddToCart(device)}
                          className="mt-4 bg-gold hover:bg-opacity-90 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                        >
                          View Deals
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Navigation Arrows */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 text-gray-800 p-3 rounded-full shadow-lg hover:bg-opacity-100 transition-all duration-200 hover:scale-110"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 text-gray-800 p-3 rounded-full shadow-lg hover:bg-opacity-100 transition-all duration-200 hover:scale-110"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>

                {/* Navigation Dots */}
                <div className="flex justify-center space-x-3 mt-6">
                  {featuredDevices.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === currentSlide ? 'bg-gold scale-125' : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Deals Section */}
      <section id="featured-deals" className="py-20 bg-gradient-to-br from-navy to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gold">Featured</span> Device Deals
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Don't miss out on our extended Black Friday savings on premium 2025 devices and genuine parts
            </p>

            {/* Countdown Timer */}
            <div className="mt-12 bg-white bg-opacity-10 rounded-2xl p-8 backdrop-blur-sm border border-white border-opacity-20">
              <h3 className="text-2xl font-bold mb-6 text-gold">Year-End Sale Ends In:</h3>
              <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gold mb-2">{timeLeft.days}</div>
                  <div className="text-sm text-gray-300">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gold mb-2">{timeLeft.hours}</div>
                  <div className="text-sm text-gray-300">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gold mb-2">{timeLeft.minutes}</div>
                  <div className="text-sm text-gray-300">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gold mb-2">{timeLeft.seconds}</div>
                  <div className="text-sm text-gray-300">Seconds</div>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredDevices.map((device, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-10 rounded-2xl overflow-hidden backdrop-blur-sm border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="aspect-square bg-gray-200 relative overflow-hidden">
                  <img
                    src={device.image}
                    alt={device.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-[#D4AF37] text-white px-3 py-1 rounded-full text-xs font-bold">
                    SALE
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{device.name}</h3>
                  <p className="text-gold font-semibold mb-4">{device.overlayText}</p>
                  <button
                    onClick={() => handleAddToCart(device)}
                    className="w-full bg-[#D4AF37] hover:bg-opacity-90 text-white py-3 rounded-lg font-semibold transition-colors"
                    style={{ backgroundColor: '#D4AF37' }}
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="bg-[#D4AF37] hover:bg-opacity-90 text-white px-12 py-4 rounded-xl font-bold text-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: '#D4AF37' }}
            >
              Explore All Deals →
            </button>
          </div>
        </div>
      </section>

      {/* Quality Standards Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Left Side Title */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Discover Our
                <span className="block text-gold">Midas Quality Standards</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                We maintain the highest industry standards to ensure every product meets professional repair requirements.
              </p>
            </div>

            {/* Right Side MidasGold 7.0 Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="bg-gold text-white px-6 py-3 rounded-xl font-bold text-xl shadow-lg">
                  MidasTech 7.0 Technology
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Unmatched Quality and Reliability
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Our proprietary MidasTech 7.0 Technology ensures top-tier materials, rigorous quality control, and reliable performance for professional repairs.
              </p>
              <div className="flex items-center space-x-2 text-gold font-semibold">
                <Shield size={20} />
                <span>Lifetime Warranty Included</span>
              </div>
            </div>
          </div>

          {/* Feature Bubbles Grid */}
          <div className="grid md:grid-cols-5 gap-8">
            {qualityFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 group"
              >
                <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-gold group-hover:bg-opacity-10 transition-colors duration-300">
                  <feature.icon className={`w-10 h-10 ${feature.color} group-hover:text-gold transition-colors duration-300`} />
                </div>
                <p className="text-gray-800 font-semibold text-lg leading-tight">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Dynamic FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our wholesale phone parts and repair services
            </p>
          </div>

          <DynamicFAQ limit={8} />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-8 mb-12 pb-8 border-b border-gray-800">
            <div className="flex items-center space-x-2 text-gray-400">
              <Shield size={24} className="text-gold" />
              <span className="font-semibold">Authorized Apple Distributor</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <Award size={24} className="text-gold" />
              <span className="font-semibold">Samsung Certified Partner</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <Lock size={24} className="text-gold" />
              <span className="font-semibold">BBB Accredited Business</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <Truck size={24} className="text-gold" />
              <span className="font-semibold">UPS Preferred Partner</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <Star size={24} className="text-gold" />
              <span className="font-semibold">ISO 9001 Certified</span>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-1">
              <h3 className="text-xl font-bold mb-4 text-gold">Midas Technical Solutions</h3>
              <p className="text-gray-400 text-sm mb-4">
                Premium wholesale provider of mobile phone parts, repair tools, and tech solutions.
              </p>
              <div className="flex space-x-4">
                {[
                  { Icon: Instagram, href: 'https://www.instagram.com/midastechnical/' },
                  { Icon: Linkedin, href: 'https://www.linkedin.com/company/midas-technical-solutions/?viewAsMember=true' },
                  { Icon: Youtube, href: 'https://www.youtube.com/@midastechnicalsolutions' }
                ].map(({ Icon, href }) => (
                  <a
                    key={href}
                    href={href}
                    className="text-gray-400 hover:text-gold transition-colors"
                    aria-label={`Visit our ${Icon.name} page`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-lg mb-4 text-gold">Quick Links</h4>
              <ul className="space-y-2">
                {[
                  { name: 'About Us', href: '/about' },
                  { name: 'Quality Standards', href: '/quality-standards' },
                  { name: 'Contact', href: '/contact' },
                  { name: 'Support', href: '/support' }
                ].map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-gray-300 hover:text-white transition-colors text-sm">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold text-lg mb-4 text-gold">Support</h4>
              <ul className="space-y-2">
                {[
                  { name: 'FAQ', href: '/faq' },
                  { name: 'Technical Support', href: '/technical-support' },
                  { name: 'Bulk Orders', href: '/bulk-orders' },
                  { name: 'Trade-In Program', href: '/trade-in' }
                ].map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-gray-300 hover:text-white transition-colors text-sm">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Country */}
            <div>
              <h4 className="font-semibold text-lg mb-4 text-gold">Contact</h4>
              <div className="space-y-3 text-sm text-gray-300">
                <p>Available 24/7 for support</p>
                <div className="flex items-center space-x-2">
                  <Mail size={16} className="text-gold" />
                  <span>support@midastechnical.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone size={16} className="text-gold" />
                  <span>1-888-545-2121</span>
                </div>
              </div>

              {/* Country Selector */}
              <div className="mt-4">
                <div className="relative">
                  <button className="flex items-center justify-between w-full bg-gray-800 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm">
                    <div className="flex items-center space-x-2">
                      <Globe size={14} />
                      <span>{selectedCountry}</span>
                    </div>
                    <ChevronDown size={14} />
                  </button>
                  <div className="absolute top-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg w-full opacity-0 invisible hover:opacity-100 hover:visible transition-all duration-200">
                    <div className="py-1">
                      {['United States', 'Canada', 'United Kingdom', 'Australia'].map((country) => (
                        <button
                          key={country}
                          onClick={() => handleCountryChange(country)}
                          className="w-full text-left px-3 py-1 text-xs hover:bg-gray-700 transition-colors"
                        >
                          {country}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 mt-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-sm">
                © 2025 Midas Technical Solutions. All rights reserved. | Privacy Policy | Terms of Service
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Lock size={14} className="text-gold" />
                  <span>Secure SSL</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Truck size={14} className="text-gold" />
                  <span>Fast Shipping</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award size={14} className="text-gold" />
                  <span>Lifetime Warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Consent Banner */}
      <AnimatePresence>
        {showCookieBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">🍪 We use cookies</h3>
                  <p className="text-gray-600 text-sm">
                    We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
                    By clicking "Accept", you consent to our use of cookies.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleCookieAccept}
                    className="bg-gold hover:bg-opacity-90 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Accept Cookies
                  </button>
                  <button
                    onClick={() => setShowCookieBanner(false)}
                    className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Homepage Structured Data with Featured Products */}
      <StructuredData type="homepage" products={featuredProductsWithReviews || []} />
    </main>
    </>
  );
}
