'use client';

export default function ProductSkeleton() {
  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 animate-pulse">
      {/* Image skeleton */}
      <div className="relative overflow-hidden rounded-t-lg">
        <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
        <div className="absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center">
          <div className="bg-gray-300 text-gray-600 px-4 py-2 rounded-md">
            Quick View
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Category skeleton */}
        <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>

        {/* Title skeleton */}
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>

        {/* Rating skeleton */}
        <div className="flex items-center mb-2">
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <div key={star} className="w-4 h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="ml-2 h-4 bg-gray-200 rounded w-12"></div>
        </div>

        {/* Price skeleton */}
        <div className="mb-3">
          <div className="h-6 bg-gray-200 rounded w-16 mb-1"></div>
          <div className="h-4 bg-gray-200 rounded w-12"></div>
        </div>

        {/* Button skeleton */}
        <div className="w-full h-10 bg-gray-200 rounded-md"></div>
      </div>
    </div>
  );
}
