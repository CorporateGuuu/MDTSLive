'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Trash2, Plus, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

interface SavedCard {
  id: string;
  stripe_pm_id: string;
  last4: string;
  brand: string;
  exp_month: number;
  exp_year: number;
}

export default function SavedCards() {
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Note: This component should be used within a client component context
  // For server-side data fetching, consider using a server component or API route

  const fetchCards = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/payment-methods');
      if (!response.ok) {
        throw new Error('Failed to fetch saved cards');
      }
      const data = await response.json();
      setCards(data.paymentMethods || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cards');
      toast.error('Failed to load saved cards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleRemoveCard = async (cardId: string) => {
    if (!confirm('Are you sure you want to remove this card?')) {
      return;
    }

    try {
      const response = await fetch(`/api/payment-methods/${cardId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove card');
      }

      setCards(cards.filter(card => card.id !== cardId));
      toast.success('Card removed successfully');
    } catch (err) {
      toast.error('Failed to remove card');
    }
  };

  const handleAddCard = () => {
    // This would typically open a modal or navigate to a setup intent page
    toast.info('Add card functionality would open a Stripe Elements form');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-20 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-20 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchCards} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Saved Payment Methods</h2>
        <Button onClick={handleAddCard} className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          Add New Card
        </Button>
      </div>

      {cards.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No saved cards</h3>
            <p className="text-gray-600 mb-4">Add a payment method to speed up your checkout process.</p>
            <Button onClick={handleAddCard} className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Card
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {cards.map((card) => (
            <Card key={card.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 capitalize">
                        {card.brand} •••• {card.last4}
                      </p>
                      <p className="text-sm text-gray-600">
                        Expires {String(card.exp_month).padStart(2, '0')}/{card.exp_year}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleRemoveCard(card.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {cards.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-blue-800">Secure Storage</h4>
              <p className="text-sm text-blue-700 mt-1">
                Your payment information is securely stored by Stripe and never touches our servers.
                You can remove cards at any time.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
