import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { KaluProduct } from '../config/kaluCatalog';

export interface CartItem {
  product: KaluProduct;
  quantity: number;
}

interface CartTotals {
  subtotal: number;
  discount: number;
  total: number;
  promoMessage: string | null;
  promoEligibleCount: number;
}

interface CartContextValue {
  items: CartItem[];
  totals: CartTotals;
  count: number;
  addItem: (product: KaluProduct) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = 'kalu_cart_v1';

function calculateTotals(items: CartItem[]): CartTotals {
  const subtotal = items.reduce((sum, item) => sum + (item.product.precio ?? 0) * item.quantity, 0);
  const promoEligibleUnits = items.filter((item) => item.product.promoCuchareable).reduce((sum, item) => sum + item.quantity, 0);
  const promoGroupsOfThree = Math.floor(promoEligibleUnits / 3);
  const remainingAfterThree = promoEligibleUnits % 3;
  const promoGroupsOfTwo = Math.floor(remainingAfterThree / 2);
  const promoUnitsDiscounted = promoGroupsOfThree * 3 + promoGroupsOfTwo * 2;
  const regularPromoPrice = promoUnitsDiscounted * 7;
  const promoPrice = promoGroupsOfThree * 18 + promoGroupsOfTwo * 13;
  const discount = Math.max(0, regularPromoPrice - promoPrice);
  const promoParts = [];
  if (promoGroupsOfThree) promoParts.push(`${promoGroupsOfThree} promo de 3 cuchareables`);
  if (promoGroupsOfTwo) promoParts.push(`${promoGroupsOfTwo} promo de 2 cuchareables`);

  return {
    subtotal,
    discount,
    total: subtotal - discount,
    promoMessage: promoParts.length ? promoParts.join(' + ') : null,
    promoEligibleCount: promoEligibleUnits,
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) as CartItem[] : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product: KaluProduct) => {
    if (product.precio === null || product.stock <= 0) return;
    setItems((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (existing) {
        return current.map((item) => item.product.id === product.id ? { ...item, quantity: Math.min(product.stock, item.quantity + 1) } : item);
      }
      return [...current, { product, quantity: 1 }];
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((current) => current.map((item) => item.product.id === productId ? { ...item, quantity: Math.min(item.product.stock, Math.max(1, quantity)) } : item));
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const totals = useMemo(() => calculateTotals(items), [items]);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return <CartContext.Provider value={{ items, totals, count, addItem, updateQuantity, removeItem, clearCart }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider');
  return context;
}
