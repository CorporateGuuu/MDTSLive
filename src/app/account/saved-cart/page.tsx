'use client';

import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { useCart } from '../../../../contexts/CartContext';
import { toast } from 'sonner';
import { Trash2, ShoppingCart, Plus, Minus, Image as ImageIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';

export default function SavedCartPage() {
  const { addToCart } = useCart();
  const [carts, setCarts] = useState([
    {
      id: 1,
      name: 'iPhone Parts Cart',
      total: 1823.95,
      items: [
        {
          id: 'item1',
          name: 'iPhone 15 Pro Max OLED Display (Grade A+)',
          price: 299.99,
          qty: 1,
          image: '/placeholder-phone.jpg', // Placeholder
        },
        // Add more items for full cart
      ],
    },
  ]);

  const handleAddToCart = (cartId: number) => {
    const cart = carts.find(c => c.id === cartId);
    if (cart) {
      cart.items.forEach(item => {
        for (let i = 0; i < item.qty; i++) {
          addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            images: [item.image]
          });
        }
      });
      toast.success(`Added ${cart.items.length} items from "${cart.name}" to cart!`);
      // Optionally remove from saved carts
      setCarts(prev => prev.filter(c => c.id !== cartId));
    }
  };

  const handleDeleteCart = (cartId: number) => {
    setCarts(prev => prev.filter(c => c.id !== cartId));
    toast.success('Cart deleted!');
  };

  const updateQty = (cartId: number, itemId: string, delta: number) => {
    setCarts(prev => prev.map(c => {
      if (c.id === cartId) {
        return {
          ...c,
          items: c.items.map(i => {
            if (i.id === itemId) {
              const newQty = Math.max(0, i.qty + delta);
              return { ...i, qty: newQty };
            }
            return i;
          }).filter(i => i.qty > 0), // Remove if qty 0
          total: c.items.reduce((sum, i) => sum + (i.price * i.qty), 0),
        };
      }
      return c;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-blue-600">Nexus Tech Hub</h1>
          <input placeholder="What are you looking for?" className="border rounded-lg px-4 py-2 w-64" />
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span>🇺🇸 | USD</span>
          <span>FedEx 03:24:18</span>
          <span className="bg-yellow-100 px-2 py-1 rounded">$182.34 | 4</span>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar – Your existing one, with "Saved Shopping Cart" highlighted */}
        <aside className="w-64 bg-white shadow p-4 space-y-2">
          <ul className="space-y-1">
            <li className="font-bold text-blue-600">My Account</li>
            <li className="text-sm text-gray-600 pl-4">— Account Dashboard</li>
            {/* ... */}
            <li className="font-bold text-blue-600 bg-blue-100 p-1 rounded">— Saved Shopping Cart</li>
            {/* ... rest */}
          </ul>
          <Button className="w-full bg-red-500 text-white">Always Expand Submenu</Button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 max-w-6xl mx-auto">
          {/* Pink Banner */}
          <div className="bg-gradient-to-r from-pink-100 to-pink-200 rounded-2xl p-6 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ShoppingCart className="w-12 h-12 text-pink-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Saved Cart</h1>
                <p className="text-gray-600">1 saved carts</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-pink-600">$1,823.95</p>
              <div className="flex gap-2 mt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="bg-red-500 hover:bg-red-600 text-white px-6 py-2">
                      <Trash2 className="mr-1" size={16} /> Delete Cart
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Delete</DialogTitle>
                    </DialogHeader>
                    <p>Delete this saved cart? Items cannot be recovered.</p>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline">Cancel</Button>
                      <Button variant="destructive" onClick={() => handleDeleteCart(1)}>Delete</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 mt-2 w-full">
                  <ShoppingCart className="mr-1" size={16} /> Add to Cart
                </Button>
              </div>
            </div>
          </div>

          {/* Saved Carts Table */}
          {carts.map(cart => (
            <div key={cart.id} className="bg-white rounded-xl shadow overflow-hidden mb-6">
              <div className="p-6 border-b bg-gray-50">
                <h2 className="text-xl font-bold">{cart.name}</h2>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left font-medium">Image</th>
                    <th className="p-4 text-left font-medium">Product Name</th>
                    <th className="p-4 text-left font-medium">Price</th>
                    <th className="p-4 text-left font-medium">Quantity</th>
                    <th className="p-4 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.items.map(item => (
                    <tr key={item.id} className="border-t hover:bg-gray-50">
                      <td className="p-4">
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                          <ImageIcon size={24} className="text-gray-500" />
                        </div>
                      </td>
                      <td className="p-4 font-medium">{item.name}</td>
                      <td className="p-4">${item.price.toFixed(2)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => updateQty(cart.id, item.id, -1)} disabled={item.qty <= 1}>
                            <Minus size={16} />
                          </Button>
                          <span className="w-8 text-center">{item.qty}</span>
                          <Button variant="outline" size="sm" onClick={() => updateQty(cart.id, item.id, 1)}>
                            <Plus size={16} />
                          </Button>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 text-white" onClick={() => {
                            for (let i = 0; i < item.qty; i++) {
                              addToCart({
                                id: item.id,
                                name: item.name,
                                price: item.price,
                                images: [item.image]
                              });
                            }
                            toast.success(`Added ${item.name} to cart!`);
                          }}>
                            Move to Cart
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => updateQty(cart.id, item.id, -item.qty)}>
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
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
        <p className="text-center text-gray-400 mt-4">© 2025 Nexus Tech Hub. All rights reserved.</p>
      </footer>
    </div>
  );
}
