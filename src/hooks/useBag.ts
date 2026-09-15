import { useCallback, useEffect, useState } from 'react';
import { products } from '../data/catalog';
import type { CartLine, Product } from '../types';

const BAG_KEY = 'nor-bag';

function readBag(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(BAG_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((entry) => {
      if (!entry || typeof entry !== 'object') return [];
      const { id, quantity } = entry as { id?: unknown; quantity?: unknown };
      if (typeof id !== 'string' || typeof quantity !== 'number') return [];
      const product = products.find((item) => item.id === id);
      const qty = Math.min(99, Math.floor(quantity));
      if (!product || qty < 1) return [];
      return [{ ...product, quantity: qty }];
    });
  } catch {
    return [];
  }
}

export function useBag() {
  const [cart, setCart] = useState<CartLine[]>(readBag);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(BAG_KEY, JSON.stringify(cart.map(({ id, quantity }) => ({ id, quantity }))));
    } catch {}
  }, [cart]);

  const addProducts = useCallback((items: Product[]) => {
    setCart((current) => {
      const next = [...current];
      items.forEach((product) => {
        const index = next.findIndex((item) => item.id === product.id);
        if (index >= 0) {
          next[index] = { ...next[index], quantity: Math.min(99, next[index].quantity + 1) };
        } else {
          next.push({ ...product, quantity: 1 });
        }
      });
      return next;
    });
    setCartOpen(true);
  }, []);

  const addToBag = useCallback((product: Product) => addProducts([product]), [addProducts]);

  const removeFromBag = useCallback((id: string) => {
    setCart((current) => current.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, delta: number) => {
    setCart((current) =>
      current
        .map((item) => {
          if (item.id !== id) return item;
          return { ...item, quantity: Math.min(99, item.quantity + delta) };
        })
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const count = cart.reduce((total, item) => total + item.quantity, 0);

  return { cart, cartOpen, setCartOpen, count, addProducts, addToBag, removeFromBag, updateQuantity };
}
