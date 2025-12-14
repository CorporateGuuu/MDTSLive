'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '../../utils/supabaseClient';
import { Search, Filter, Clock, Star, Package, ChevronDown, Grid, List } from 'lucide-react';

interface RepairGuide {
  id: string;
  title: string;
  slug: string;
  description: string;
  device: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimated_time: string;
  tools_needed: string[];
  parts_needed: string[];
  featured_image: string;
  is_published: boolean;
  created_at: string;
}

export default function GuidesPage() {
  const [guides, setGuides] = useState<RepairGuide[]>([]);
  const [filteredGuides, setFilteredGuides] = useState<RepairGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDevice, setSelectedDevice] = useState('All Devices');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All Difficulties');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const guidesPerPage = 12;

  // Get unique devices and difficulties for filters
  const devices = ['All Devices', ...Array.from(new Set(guides.map(g => g.device)))];
  const difficulties = ['All Difficulties', 'Easy', 'Medium', 'Hard'];

  useEffect(() => {
    fetchGuides();
  }, []);

  useEffect(() => {
    filterGuides();
  }, [guides, searchQuery, selectedDevice, selectedDifficulty]);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('repair_guides')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching guides:', error);
        return;
      }

      setGuides(data || []);
      setFilteredGuides(data || []);
    } catch (error) {
      console.error('Error fetching guides:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterGuides = () => {
    let filtered = guides;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(guide =>
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.device.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Device filter
    if (selectedDevice !== 'All Devices') {
      filtered = filtered.filter(guide => guide.device === selectedDevice);
    }

    // Difficulty filter
    if (selectedDifficulty !== 'All Difficulties') {
      filtered = filtered.filter(guide => guide.difficulty === selectedDifficulty);
    }

    setFilteredGuides(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Pagination
  const totalPages = Math.ceil(filteredGuides.length / guidesPerPage);
  const startIndex = (currentPage - 1) * guidesPerPage;
  const paginatedGuides = filteredGuides.slice(startIndex, startIndex + guidesPerPage);

  // Generate ItemList structured data
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Midas Repair Guides Collection",
    "description": "Complete collection of professional phone repair guides with step-by-step instructions",
    "numberOfItems": filteredGuides.length,
    "itemListElement": paginatedGuides.map((guide, index) => ({
      "@type": "ListItem",
      "position": startIndex + index + 1,
      "item": {
        "@type": "HowTo",
        "name": guide.title,
        "description": guide.description,
        "url": `https://midastechnicalsolutions.com/guides/${guide.slug}`,
        "image": guide.featured_image || `/logos/midas-logo-main.png`,
        "totalTime": convertToISODuration(guide.estimated_time),
        "difficulty": guide.difficulty
      }
    }))
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading repair guides...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ItemList Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema)
        }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Midas Repair Guides – Free Step-by-Step Instructions
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Professional repair tutorials for iPhone, Samsung, and other devices.
                Complete step-by-step instructions with videos and parts recommendations.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search repair guides..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>

              {/* Device Filter */}
              <div className="relative">
                <select
                  value={selectedDevice}
                  onChange={(e) => setSelectedDevice(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-gold focus:border-transparent"
                >
                  {devices.map(device => (
                    <option key={device} value={device}>{device}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Difficulty Filter */}
              <div className="relative">
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-gold focus:border-transparent"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-l-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-gold text-white' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-r-lg transition-colors ${
                    viewMode === 'list' ? 'bg-gold text-white' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>

            {/* Results Summary */}
            <div className="mt-4 text-sm text-gray-600">
              Showing {paginatedGuides.length} of {filteredGuides.length} repair guides
              {selectedDevice !== 'All Devices' && ` for ${selectedDevice}`}
              {selectedDifficulty !== 'All Difficulties' && ` (${selectedDifficulty})`}
              {searchQuery && ` matching "${searchQuery}"`}
            </div>
          </div>

          {/* Guides Grid/List */}
          {paginatedGuides.length === 0 ? (
            <div className="text-center py-12">
              <Package size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No guides found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className={`mb-8 ${
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }`}>
              {paginatedGuides.map((guide) => (
                <Link
                  key={guide.id}
                  href={`/guides/${guide.slug}`}
                  className={`block bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow ${
                    viewMode === 'list' ? 'flex items-center p-6' : 'p-6'
                  }`}
                >
                  {viewMode === 'grid' ? (
                    // Grid View
                    <>
                      {/* Image */}
                      <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                        <Image
                          src={guide.featured_image || '/logos/midas-logo-main.png'}
                          alt={guide.title}
                          width={400}
                          height={225}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900 line-clamp-2">
                          {guide.title}
                        </h3>

                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span className="flex items-center">
                            <Package size={14} className="mr-1" />
                            {guide.device}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            guide.difficulty === 'Easy'
                              ? 'bg-green-100 text-green-800'
                              : guide.difficulty === 'Medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            <Star size={12} className="mr-1" />
                            {guide.difficulty}
                          </div>

                          <div className="flex items-center text-xs text-gray-500">
                            <Clock size={12} className="mr-1" />
                            {guide.estimated_time}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    // List View
                    <>
                      {/* Image */}
                      <div className="w-24 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 mr-6">
                        <Image
                          src={guide.featured_image || '/logos/midas-logo-main.png'}
                          alt={guide.title}
                          width={96}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                          {guide.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {guide.description}
                        </p>

                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Package size={12} className="mr-1" />
                            {guide.device}
                          </span>

                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full ${
                            guide.difficulty === 'Easy'
                              ? 'bg-green-100 text-green-700'
                              : guide.difficulty === 'Medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            <Star size={10} className="mr-1" />
                            {guide.difficulty}
                          </span>

                          <span className="flex items-center">
                            <Clock size={12} className="mr-1" />
                            {guide.estimated_time}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-3 py-2 border rounded-md ${
                      currentPage === pageNumber
                        ? 'bg-gold text-white border-gold'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Helper function
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
