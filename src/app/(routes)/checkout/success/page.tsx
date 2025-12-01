'use client';

import Link from 'next/link';
import { CheckCircle, Package, Truck } from 'lucide-react';
import { useEffect } from 'react';

export default function SuccessPage() {
  useEffect(() => {
    // Confetti
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d')!;
    const confetti = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 4 + 1,
      d: Math.random() * 100,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      tilt: Math.random() * 10 - 5,
      tiltAngle: 0,
      tiltAngleIncrement: Math.random() * 0.1,
    }));

    let animationFrame: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confetti.forEach((c) => {
        c.tiltAngle += c.tiltAngleIncrement;
        c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
        c.tilt = Math.sin(c.tiltAngle) * 15;

        if (c.y > canvas.height) {
          c.x = Math.random() * canvas.width;
          c.y = -20;
        }

        ctx.beginPath();
        ctx.lineWidth = c.r;
        ctx.strokeStyle = c.color;
        ctx.moveTo(c.x + c.tilt + c.r / 2, c.y);
        ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 2);
        ctx.stroke();
      });

      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrame);
      document.body.removeChild(canvas);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-md mx-auto">
          <CheckCircle className="w-24 h-24 mx-auto text-green-600 mb-6" />
          <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Thank you for your purchase. Your order has been received.
          </p>

          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 text-left">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-6 h-6 text-red-600" />
              <span className="font-semibold">Order #NXH-2025-0481</span>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="w-6 h-6 text-blue-600" />
              <span>Estimated Delivery: <strong>Nov 4–6, 2025</strong></span>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              href="/products"
              className="block w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Continue Shopping
            </Link>
            <Link
              href="/account/orders"
              className="block w-full border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Track Order
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
