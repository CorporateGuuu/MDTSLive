'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Clock, ArrowRight, Play } from 'lucide-react';

interface GuideStep {
  id: string;
  guide_id: string;
  step_number: number;
  title: string;
  description: string;
  image_url: string;
  video_url: string;
}

interface StepsAccordionProps {
  steps: GuideStep[];
  guideSlug: string;
}

export default function StepsAccordion({ steps, guideSlug }: StepsAccordionProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([1])); // First step expanded by default

  const toggleStep = (stepNumber: number) => {
    setExpandedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepNumber)) {
        newSet.delete(stepNumber);
      } else {
        newSet.add(stepNumber);
      }
      return newSet;
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Step-by-Step Instructions
      </h2>

      <div className="space-y-4">
        {steps?.map((step, index) => {
          const isExpanded = expandedSteps.has(step.step_number);

          return (
            <div key={step.id} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Step Header - Clickable */}
              <button
                onClick={() => toggleStep(step.step_number)}
                className="w-full text-left p-6 bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-inset"
                aria-expanded={isExpanded}
                aria-controls={`step-content-${step.step_number}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gold text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {step.step_number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    {isExpanded ? (
                      <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">−</span>
                      </div>
                    ) : (
                      <div className="w-6 h-6 border-2 border-gold rounded-full flex items-center justify-center">
                        <span className="text-gold text-xs font-bold">+</span>
                      </div>
                    )}
                  </div>
                </div>
              </button>

              {/* Step Content - Expandable */}
              {isExpanded && (
                <div
                  id={`step-content-${step.step_number}`}
                  className="px-6 pb-6 border-t border-gray-200 bg-white"
                >
                  {/* Step Image/Video */}
                  {step.image_url && (
                    <div className="mb-4 pt-4">
                      <Image
                        src={step.image_url}
                        alt={`Step ${step.step_number}: ${step.title}`}
                        width={600}
                        height={400}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {step.video_url && (
                    <div className="mb-4 pt-4">
                      <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                        <iframe
                          src={`https://www.youtube.com/embed/${getYouTubeVideoId(step.video_url)}`}
                          title={`Step ${step.step_number}: ${step.title}`}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}

                  {/* Step Description */}
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {step.description}
                    </p>
                  </div>

                  {/* Step Actions */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Step {step.step_number} of {steps.length}
                      </div>
                      {index < steps.length - 1 && (
                        <div className="flex items-center text-gold font-medium">
                          <span className="text-sm mr-1">Next:</span>
                          <ArrowRight size={14} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Accordion Note */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg md:hidden">
        <p className="text-sm text-blue-700">
          <strong>Mobile Tip:</strong> Tap any step above to expand and view detailed instructions with images and videos.
        </p>
      </div>
    </div>
  );
}

// Helper function
function getYouTubeVideoId(url: string): string {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : '';
}
