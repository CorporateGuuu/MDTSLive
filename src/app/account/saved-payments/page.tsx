'use client';

import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { toast } from 'sonner';
import { CreditCard, Trash2, Plus } from 'lucide-react';

interface Card {
  id: number;
  type: string;
  lastFour: string;
  expiration: string;
  masked: string;
}

export default function SavedPaymentsPage() {
  const [cards, setCards] = useState<Card[]>([
    {
      id: 1,
      type: 'VISA',
      lastFour: '4785',
      expiration: '02/2027',
      masked: '**** **** **** 4785',
    },
  ]);
  const [open, setOpen] = useState(false);

  const handleRemove = (id: number) => {
    setCards(prev => prev.filter(c => c.id !== id));
    toast.warning('Card removed from saved payments');
  };

  const handleAddCard = (newCard: Partial<Card>) => {
    setCards(prev => [...prev, { id: Date.now(), ...newCard } as Card]);
    toast.success('Card added successfully!');
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-blue-600">Midas Technical Solutions</h1>
          <input placeholder="What are you looking for?" className="border rounded-lg px-4 py-2 w-64" />
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span>🇺🇸 | USD</span>
          <span>FedEx 03:24:18</span>
          <span className="bg-yellow-100 px-2 py-1 rounded">$182.34 | 4</span>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar – Your existing one, with "Saved Payment Information" highlighted */}
        <aside className="w-64 bg-white shadow p-4 space-y-2">
          <ul className="space-y-1">
            <li className="font-bold text-blue-600">My Account</li>
            <li className="text-sm text-gray-600 pl-4">— Account Dashboard</li>
            {/* ... */}
            <li className="font-bold text-blue-600 bg-blue-100 p-1 rounded">— Wallet</li>
            <li className="text-sm text-gray-600 pl-4">— Store Credit</li>
            <li className="text-sm text-gray-600 pl-4 bg-blue-50 p-1 rounded">— Saved Payment Information</li>
            <li className="text-sm text-gray-600 pl-4">— Balance Sheet</li>
            {/* ... */}
          </ul>
          <Button className="w-full bg-red-500 text-white">Always Expand Submenu</Button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">SAVED PAYMENT INFORMATION</h1>

          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <p className="text-gray-600 mb-6">You're able to use any of the listed payment methods below when purchasing through our checkout, you're able to add new payment methods within the checkout.</p>

            {cards.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No saved payment methods. Add one to get started.</p>
            ) : (
              <div className="space-y-4">
                {cards.map(card => (
                  <div key={card.id} className="border rounded-lg p-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <CreditCard className="w-8 h-8 text-blue-600" />
                      <div>
                        <div className="font-bold">{card.type}</div>
                        <div className="text-sm text-gray-600">{card.masked}</div>
                        <div className="text-sm text-gray-500">Expires: {card.expiration}</div>
                      </div>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => handleRemove(card.id)}>
                      <Trash2 size={16} className="mr-1" /> Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add New Payment Button */}
          <div className="text-center">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
                  <Plus className="mr-2" size={20} /> Add New Payment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Payment Method</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Card Number</Label>
                    <Input placeholder="1234 5678 9012 3456" maxLength={19} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Expiration Date</Label>
                      <Input placeholder="MM/YY" maxLength={5} />
                    </div>
                    <div>
                      <Label>CVV</Label>
                      <Input placeholder="123" maxLength={4} type="password" />
                    </div>
                  </div>
                  <div>
                    <Label>Billing Address</Label>
                    <Input placeholder="123 Main St, City, State 12345" />
                  </div>
                  <Button className="w-full bg-green-600" onClick={() => {
                    // Simulate add (integrate Braintree here)
                    handleAddCard({ type: 'VISA', lastFour: '1234', expiration: '12/2028', masked: '**** **** **** 1234' });
                  }}>
                    Add Card
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto px-6">
          <div><h3>About</h3><p className="text-sm">About Us • Blog • Quality Policy</p></div>
          <div><h3>Services</h3><p className="text-sm">My Account • LCD Buyback</p></div>
          <div><h3>Our Brands</h3><p className="text-sm">Apple • Google • OnePlus</p></div>
          <div><h3>Support</h3><p className="text-sm">Location • Live Chat • FAQs</p></div>
        </div>
        <div className="flex justify-center gap-4 mt-8 text-sm">VISA • PayPal • AMEX • Discover</div>
        <p className="text-center text-gray-400 mt-4">© 2025 Midas Technical Solutions. All rights reserved.</p>
      </footer>
    </div>
  );
}
