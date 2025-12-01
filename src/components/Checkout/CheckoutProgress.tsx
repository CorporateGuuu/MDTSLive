'use client';
import React from 'react';

interface CheckoutProgressProps {
  currentStep: number;
}

const steps = [
  { id: 1, name: 'Cart Review', description: 'Review your items' },
  { id: 2, name: 'Shipping', description: 'Delivery address' },
  { id: 3, name: 'Payment', description: 'Complete order' }
];

export default function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  return (
    <div className="w-full py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-center">
            {steps.map((step, stepIdx) => (
              <li key={step.name} className={`flex items-center ${stepIdx !== steps.length - 1 ? 'w-full' : ''}`}>
                <div className="flex flex-col items-center">
                  {/* Step Circle */}
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                      step.id < currentStep
                        ? 'border-blue-600 bg-blue-600'
                        : step.id === currentStep
                        ? 'border-blue-600 bg-white'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {step.id < currentStep ? (
                      <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span
                        className={`text-sm font-medium ${
                          step.id === currentStep ? 'text-blue-600' : 'text-gray-500'
                        }`}
                      >
                        {step.id}
                      </span>
                    )}
                  </div>

                  {/* Step Text */}
                  <div className="mt-2 text-center">
                    <div
                      className={`text-sm font-medium ${
                        step.id <= currentStep ? 'text-blue-600' : 'text-gray-500'
                      }`}
                    >
                      {step.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 hidden sm:block">
                      {step.description}
                    </div>
                  </div>
                </div>

                {/* Connector Line */}
                {stepIdx !== steps.length - 1 && (
                  <div
                    className={`hidden sm:block h-0.5 w-full mx-4 ${
                      step.id < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}
