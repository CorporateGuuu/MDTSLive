import { UserRole } from '../types';

export function getDiscountedPrice(price: number, role: UserRole): number {
  const discounts: Record<UserRole, number> = {
    retail: 0,
    wholesale: 0.10, // 10%
    dealer: 0.20,    // 20%
    admin: 0.30,     // 30%
  };
  return Number((price * (1 - discounts[role])).toFixed(2));
}

export function getRoleBadge(role: UserRole) {
  const badges = {
    retail: { text: 'Retail', color: 'bg-gray-500' },
    wholesale: { text: 'Wholesale', color: 'bg-green-600' },
    dealer: { text: 'Dealer', color: 'bg-purple-600' },
    admin: { text: 'Admin', color: 'bg-red-600' },
  };
  return badges[role];
}
