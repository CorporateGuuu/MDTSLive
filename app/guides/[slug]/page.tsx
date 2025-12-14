import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Clock, Wrench, Package, Star, Play, ExternalLink } from 'lucide-react';
import { Suspense } from 'react';
import StepsAccordion from './StepsAccordion';

// Dynamic metadata for repair guide pages
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;

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

    // Fetch guide data
    const { data: guide } = await supabase
      .from('repair_guides')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (!guide) {
      return {
        title: 'Guide Not Found - Midas Technical Solutions',
        description: 'Repair guide not found.',
      };
    }

    // SEO-optimized title like "How to Replace iPhone 16 Screen in 30 Minutes"
    const title = `How to ${guide.title.toLowerCase().replace(' guide', '')} in ${guide.estimated_time} | Midas Technical Solutions`;
    const description = `Complete ${guide.difficulty} repair guide for ${guide.device}. ${guide.estimated_time} with professional tools and MidasGold parts. Step-by-step instructions with videos.`;

    // Keywords based on guide content
    const keywords = [
      guide.title.toLowerCase(),
      `${guide.device} repair`,
      `${guide.difficulty} repair guide`,
      'step by step repair',
      'professional repair',
      'MidasGold parts',
      'repair tools',
      'device repair tutorial',
      guide.tools_needed?.join(' ') || '',
      guide.parts_needed?.join(' ') || ''
    ].filter(Boolean);

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        url: `https://midastechnicalsolutions.com/guides/${slug}`,
        siteName: 'Midas Technical Solutions',
        type: 'article',
        images: [
          {
            url: guide.featured_image || '/logos/midas-logo-main.png',
            width: 1200,
            height: 630,
            alt: `${guide.title} - Repair Guide`,
            type: 'image/jpeg',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [guide.featured_image || '/logos/midas-logo-main.png'],
        creator: '@MidasTechnical',
      },
      other: {
        'article:author': 'Midas Technical Solutions',
        'article:publisher': 'Midas Technical Solutions',
        'article:section': 'Repair Guides',
        'article:tag': guide.device,
      },
    };
  } catch (error) {
    console.error('Error generating guide metadata:', error);
    return {
      title: 'Repair Guide - Midas Technical Solutions',
      description: 'Professional repair guides and tutorials.',
    };
  }
}

// ISR configuration for fresh guide data
export const revalidate = 3600; // Revalidate every hour

interface GuideStep {
  id: string;
  guide_id: string;
  step_number: number;
  title: string;
  description: string;
  image_url: string;
  video_url: string;
}

export default async function RepairGuidePage({ params }: { params: { slug: string } }) {
  const { slug } = params;

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

    // Fetch guide data
    const { data: guide } = await supabase
      .from('repair_guides')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (!guide) {
      notFound();
    }

    // Fetch guide steps
    const { data: steps } = await supabase
      .from('guide_steps')
      .select('*')
      .eq('guide_id', guide.id)
      .order('step_number', { ascending: true });

    // Fetch guide videos
    const { data: videos } = await supabase
      .from('guide_videos')
      .select('*')
      .eq('guide_id', guide.id);

    // Fetch related guides (same device type, excluding current)
    const { data: relatedGuides } = await supabase
      .from('repair_guides')
      .select('title, slug, device, difficulty, estimated_time, featured_image')
      .eq('is_published', true)
      .eq('device', guide.device)
      .neq('id', guide.id)
      .limit(3);

    // Generate HowTo structured data (2025 Google guidelines compliant)
    // Each step must have clear text (>50 chars), images where possible, no promotional language
    const howToSchema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": guide.title,
      "description": guide.description.substring(0, 160), // Keep under 160 chars for rich snippets
      "image": guide.featured_image || `/logos/midas-logo-main.png`,
      "totalTime": convertToISODuration(guide.estimated_time),
      "difficulty": guide.difficulty,
      // Only include estimatedCost if we have parts (Google prefers realistic costs)
      ...(guide.parts_needed?.length && {
        "estimatedCost": {
          "@type": "MonetaryAmount",
          "currency": "USD",
          "value": (guide.parts_needed.length * 50).toString()
        }
      }),
      // Include supplies only if they exist (required for repair guides)
      ...(guide.parts_needed?.length && {
        "supply": guide.parts_needed.map((part: string) => ({
          "@type": "HowToSupply",
          "name": part
        }))
      }),
      // Include tools (required for repair guides)
      ...(guide.tools_needed?.length && {
        "tool": guide.tools_needed.map((tool: string) => ({
          "@type": "HowToTool",
          "name": tool
        }))
      }),
      "step": steps?.map((step: GuideStep) => {
        // Ensure each step has substantial text (>50 chars) for Google guidelines
        const stepText = step.description.length > 50 ? step.description : `${step.description} Follow the instructions carefully to avoid damaging the device.`;

        return {
          "@type": "HowToStep",
          "position": step.step_number,
          "name": step.title,
          "text": stepText,
          // Include image if available (Google prefers visual steps)
          ...(step.image_url && { "image": step.image_url }),
          // Include URL fragment for step navigation
          "url": `https://midastechnicalsolutions.com/guides/${guide.slug}#step-${step.step_number}`
        };
      }) || []
    };

    // Generate VideoObject structured data for videos
    const videoSchemas = videos?.map((video) => ({
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": video.title,
      "description": video.description,
      "thumbnailUrl": video.thumbnail_url,
      "uploadDate": video.upload_date,
      "duration": video.duration,
      "embedUrl": video.youtube_url ? `https://www.youtube.com/embed/${getYouTubeVideoId(video.youtube_url)}` : undefined,
      "contentUrl": video.youtube_url || undefined,
      "url": video.youtube_url || undefined
    })) || [];

    return (
      <>
        {/*
          HowTo and VideoObject Structured Data for Google Rich Results
          Test with: https://search.google.com/test/rich-results
          Guidelines: Each step >50 chars, images where possible, no promotional language
          Video: Valid embedUrl format, ISO duration, proper uploadDate
        */}
        {/* HowTo Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(howToSchema)
          }}
        />

        {/* VideoObject Structured Data */}
        {videoSchemas.map((videoSchema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(videoSchema)
            }}
          />
        ))}

        <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-gold">Home</Link>
              <span>/</span>
              <Link href="/guides" className="hover:text-gold">Repair Guides</Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">{guide.title}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Header */}
              <div className="bg-white rounded-lg shadow-sm p-8">
                {/* Featured Image */}
                {guide.featured_image && (
                  <div className="mb-6">
                    <Image
                      src={guide.featured_image}
                      alt={`${guide.title} - Repair Guide`}
                      width={800}
                      height={400}
                      className="w-full h-64 object-cover rounded-lg"
                      priority
                    />
                  </div>
                )}

                {/* Title and Meta */}
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {guide.title} – Step-by-Step Repair Guide
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    {/* Difficulty Badge */}
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      guide.difficulty === 'Easy'
                        ? 'bg-green-100 text-green-800'
                        : guide.difficulty === 'Medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      <Star size={14} className="mr-1" />
                      {guide.difficulty}
                    </div>

                    {/* Time Estimate */}
                    <div className="flex items-center text-gray-600">
                      <Clock size={16} className="mr-1" />
                      <span className="text-sm">{guide.estimated_time}</span>
                    </div>

                    {/* Device */}
                    <div className="flex items-center text-gray-600">
                      <Package size={16} className="mr-1" />
                      <span className="text-sm">{guide.device}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {guide.description}
                  </p>
                </div>

                {/* Tools and Parts Summary */}
                <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                  {/* Required Tools */}
                  {guide.tools_needed && guide.tools_needed.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <Wrench size={18} className="mr-2 text-gold" />
                        Required Tools
                      </h3>
                      <ul className="space-y-2">
                        {guide.tools_needed.map((tool: string, index: number) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <span className="w-2 h-2 bg-gold rounded-full mr-3 flex-shrink-0"></span>
                            {tool}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Required Parts */}
                  {guide.parts_needed && guide.parts_needed.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <Package size={18} className="mr-2 text-gold" />
                        Required Parts
                      </h3>
                      <ul className="space-y-2">
                        {guide.parts_needed.map((part: string, index: number) => (
                          <li key={index} className="flex items-center text-sm">
                            <span className="w-2 h-2 bg-gold rounded-full mr-3 flex-shrink-0"></span>
                            <Link
                              href={`/search?q=${encodeURIComponent(part)}`}
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {part}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Buy Required Parts CTA */}
                {guide.parts_needed && guide.parts_needed.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">
                        Buy Required MidasGold Parts
                      </h3>
                      <p className="text-blue-700 text-sm mb-4">
                        Get genuine MidasGold quality parts with lifetime warranty. All parts ship same-day.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {guide.parts_needed.slice(0, 3).map((part: string, index: number) => (
                          <Link
                            key={index}
                            href={`/search?q=${encodeURIComponent(`MidasGold ${part}`)}`}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            Buy {part}
                            <ExternalLink size={14} className="ml-2" />
                          </Link>
                        ))}
                        <Link
                          href="/categories/parts"
                          className="inline-flex items-center px-4 py-2 bg-gold hover:bg-opacity-90 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          View All Parts
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Guide Videos */}
              {videos && videos.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Play size={24} className="mr-3 text-gold" />
                    Video Tutorials
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {videos.map((video) => (
                      <div key={video.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="aspect-video bg-gray-200 rounded-lg mb-3 overflow-hidden">
                          {video.youtube_url && (
                            <iframe
                              src={`https://www.youtube.com/embed/${getYouTubeVideoId(video.youtube_url)}`}
                              title={video.title}
                              className="w-full h-full"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{video.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{video.description}</p>
                        {video.duration && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock size={12} className="mr-1" />
                            Duration: {formatDuration(video.duration)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step-by-Step Instructions - Mobile Accordion */}
              <Suspense fallback={<div className="bg-white rounded-lg shadow-sm p-8 text-center">Loading steps...</div>}>
                <StepsAccordion steps={steps || []} guideSlug={guide.slug} />
              </Suspense>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Required Parts Sidebar */}
              {guide.parts_needed && guide.parts_needed.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Package size={18} className="mr-2 text-gold" />
                    Required Parts
                  </h3>
                  <div className="space-y-3">
                    {guide.parts_needed.map((part: string, index: number) => (
                      <Link
                        key={index}
                        href={`/search?q=${encodeURIComponent(part)}`}
                        className="block p-3 bg-gray-50 rounded-lg hover:bg-gold hover:text-white transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{part}</span>
                          <ExternalLink size={14} className="text-gray-400 group-hover:text-white" />
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Link
                      href="/contact"
                      className="block w-full bg-gold hover:bg-opacity-90 text-white text-center py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      Get Parts Quote
                    </Link>
                  </div>
                </div>
              )}

              {/* Guide Stats */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Guide Overview</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Difficulty</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      guide.difficulty === 'Easy'
                        ? 'bg-green-100 text-green-800'
                        : guide.difficulty === 'Medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {guide.difficulty}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Time Required</span>
                    <span className="text-sm font-medium text-gray-900">{guide.estimated_time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Steps</span>
                    <span className="text-sm font-medium text-gray-900">{steps?.length || 0}</span>
                  </div>
                  {videos && videos.length > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Videos</span>
                      <span className="text-sm font-medium text-gray-900">{videos.length}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Related Guides */}
              {relatedGuides && relatedGuides.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">More {guide.device} Guides</h3>
                  <div className="space-y-3">
                    {relatedGuides.map((relatedGuide) => (
                      <Link
                        key={relatedGuide.slug}
                        href={`/guides/${relatedGuide.slug}`}
                        className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          {relatedGuide.featured_image && (
                            <Image
                              src={relatedGuide.featured_image}
                              alt={relatedGuide.title}
                              width={60}
                              height={40}
                              className="w-15 h-10 object-cover rounded flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                              {relatedGuide.title}
                            </h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`px-1.5 py-0.5 rounded text-xs ${
                                relatedGuide.difficulty === 'Easy'
                                  ? 'bg-green-100 text-green-700'
                                  : relatedGuide.difficulty === 'Medium'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {relatedGuide.difficulty}
                              </span>
                              <span className="text-xs text-gray-500">{relatedGuide.estimated_time}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Support CTA */}
              <div className="bg-gradient-to-br from-gold to-yellow-500 rounded-lg p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Need Help?</h3>
                <p className="text-sm mb-4 opacity-90">
                  Our expert technicians are here to assist you with any repair questions.
                </p>
                <Link
                  href="/technical-support"
                  className="block w-full bg-white text-gold text-center py-2 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Get Support
                </Link>
              </div>
            </div>
          </div>
        </div>
        </div>
      </>
    );
  } catch (error) {
    console.error('Error loading repair guide:', error);
    notFound();
  }
}

// Helper functions
function convertToISODuration(timeString: string): string {
  // Convert "45-60 minutes" or "30 minutes" to ISO 8601 duration
  const match = timeString.match(/(\d+)(?:\s*-\s*(\d+))?\s*(minutes?|mins?|hours?|hrs?)/i);
  if (!match) return 'PT30M'; // Default 30 minutes

  const minMinutes = parseInt(match[1]);
  const maxMinutes = match[2] ? parseInt(match[2]) : minMinutes;

  // Use average of range, or single value
  const avgMinutes = Math.round((minMinutes + maxMinutes) / 2);

  // Check if it's hours or minutes
  const isHours = /hours?|hrs?/i.test(match[3]);

  if (isHours) {
    return `PT${avgMinutes}H`;
  } else {
    return `PT${avgMinutes}M`;
  }
}

function getYouTubeVideoId(url: string): string {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : '';
}

function formatDuration(duration: string): string {
  // Convert ISO 8601 duration (PT10M30S) to readable format
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return duration;

  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}
