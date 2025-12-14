import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const faqsData = [
  {
    question: "Do you offer lifetime warranty on your products?",
    answer: "Yes, all MidasGold 7.0 products come with our lifetime warranty. We stand behind the quality of our premium parts and repair tools with full replacement coverage for manufacturing defects and normal wear under professional use.",
    category: "warranty",
    display_order: 1
  },
  {
    question: "What is MidasGold 7.0 technology?",
    answer: "MidasGold 7.0 is our proprietary advanced coating technology that provides superior durability, enhanced touch sensitivity, true-to-life color accuracy, and improved display quality for all our screen replacements and premium parts. It's the gold standard in mobile repair technology with industry-leading performance.",
    category: "technology",
    display_order: 2
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we offer fast worldwide shipping with FedEx, DHL, and UPS. Orders typically ship within 24 hours for in-stock items. International shipping rates and delivery times may vary by location. We ship to over 150 countries with customs clearance support and provide tracking information for all orders.",
    category: "shipping",
    display_order: 3
  },
  {
    question: "Are you an authorized distributor?",
    answer: "Yes, we are official authorized distributors for Apple, Samsung, Google, and other major brands. All our parts are genuine, certified, and come with manufacturer warranty support. We maintain direct relationships with OEM manufacturers to ensure authenticity and provide original parts with full traceability.",
    category: "certification",
    display_order: 4
  },
  {
    question: "What's the minimum order quantity?",
    answer: "We have no minimum order quantity (MOQ) for most items. You can order as few as 1 piece for most repair parts. Bulk discounts are available for larger orders starting at 10+ units. This makes our wholesale platform accessible to repair shops of all sizes, from solo technicians to large repair chains.",
    category: "ordering",
    display_order: 5
  },
  {
    question: "How do I get wholesale pricing?",
    answer: "Create a free account on our platform and get approved for professional pricing. Once verified, you'll have access to wholesale rates, bulk discounts, priority customer support, and exclusive promotions. The approval process takes just a few minutes and requires basic business information verification.",
    category: "pricing",
    display_order: 6
  },
  {
    question: "Do you offer technical support?",
    answer: "Yes, we provide comprehensive technical support including repair guides, compatibility information, installation videos, and expert assistance. Our support team is available via phone, email, and live chat. We also offer training programs for professional repair technicians and provide detailed documentation for all products.",
    category: "support",
    display_order: 7
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, wire transfers, and purchase orders for approved business accounts. All payments are processed securely through our PCI-compliant payment system. Net terms are available for qualified accounts with established payment history.",
    category: "payment",
    display_order: 8
  },
  {
    question: "How long does shipping take?",
    answer: "Most orders ship within 24 hours of placement for in-stock items. Standard shipping typically takes 2-5 business days within the US, while international shipping ranges from 3-14 business days depending on the destination. Expedited and overnight options are available for urgent repairs.",
    category: "shipping",
    display_order: 9
  },
  {
    question: "Do you offer returns or exchanges?",
    answer: "We offer a 30-day return policy for unused items in original packaging. Custom orders and opened software are not returnable. For defective items, we provide immediate replacements under our lifetime warranty. Contact our support team to initiate a return or exchange request.",
    category: "returns",
    display_order: 10
  },
  {
    question: "Are your parts compatible with my devices?",
    answer: "Our parts are designed for compatibility with the latest devices and we regularly update our catalog. Each product page includes detailed compatibility information. If you're unsure about compatibility, our technical support team can help verify fitment for your specific device and repair needs.",
    category: "compatibility",
    display_order: 11
  },
  {
    question: "Do you offer bulk discounts for large orders?",
    answer: "Yes, we offer tiered bulk discounts for larger orders. Discounts start at 10+ units and increase with order volume. Contact our sales team for custom pricing on orders over 100 units. We also offer special pricing for repair chains, authorized service centers, and distributors.",
    category: "bulk",
    display_order: 12
  },
  {
    question: "How do I track my order?",
    answer: "Once your order ships, you'll receive a tracking number via email with a direct link to the carrier's tracking page. You can also log into your account to view order status, tracking information, and delivery updates. Our system integrates with all major carriers for real-time tracking.",
    category: "shipping",
    display_order: 13
  },
  {
    question: "Do you offer repair services?",
    answer: "While we primarily supply parts and tools, we partner with authorized repair centers for complex repairs. Our parts are designed for professional installation, and we provide comprehensive repair documentation. Contact us for referrals to certified repair partners in your area.",
    category: "services",
    display_order: 14
  },
  {
    question: "What makes Midas Technical Solutions different?",
    answer: "We combine premium MidasGold 7.0 technology, lifetime warranty coverage, authorized distributor status, fast worldwide shipping, and comprehensive technical support. Our focus on quality, authenticity, and professional service sets us apart in the wholesale repair parts industry.",
    category: "company",
    display_order: 15
  }
];

async function insertFAQs() {
  try {
    console.log('Starting FAQ insertion...');

    // Insert FAQs in batches to avoid rate limits
    const batchSize = 5;
    for (let i = 0; i < faqsData.length; i += batchSize) {
      const batch = faqsData.slice(i, i + batchSize);
      console.log(`Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(faqsData.length / batchSize)}...`);

      const { data, error } = await supabase
        .from('faqs')
        .insert(batch)
        .select();

      if (error) {
        console.error(`Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error);
        continue;
      }

      console.log(`Successfully inserted ${data?.length || 0} FAQs in batch ${Math.floor(i / batchSize) + 1}`);
    }

    console.log('FAQ insertion completed successfully!');

    // Verify the insertion
    const { data: verifyData, error: verifyError } = await supabase
      .from('faqs')
      .select('id, question, category')
      .eq('is_active', true)
      .order('display_order');

    if (verifyError) {
      console.error('Error verifying FAQs:', verifyError);
    } else {
      console.log(`\nVerification: ${verifyData?.length || 0} active FAQs in database`);
      console.log('Categories:', [...new Set(verifyData?.map(faq => faq.category) || [])]);
    }

  } catch (error) {
    console.error('Error in FAQ insertion process:', error);
    process.exit(1);
  }
}

// Run the insertion
insertFAQs();
