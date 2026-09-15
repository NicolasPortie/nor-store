import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lookbookStories, products } from '../src/data/catalog';
import { copy } from '../src/i18n/copy';
import { tx } from '../src/types';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicPath = (asset: string) => join(ROOT, 'public', asset.replace(/^\//, ''));

describe('catalog', () => {
  it('has eight products with unique ids', () => {
    expect(products).toHaveLength(8);
    expect(new Set(products.map((product) => product.id)).size).toBe(products.length);
  });

  it('has complete pt/en content for every product', () => {
    for (const product of products) {
      for (const field of [product.name, product.category, product.detail, product.imageAlt] as const) {
        expect(field.pt.length).toBeGreaterThan(0);
        expect(field.en.length).toBeGreaterThan(0);
      }
    }
  });

  it('points to image files that exist', () => {
    const assets = [
      ...products.flatMap((product) => [product.image, product.modelImage]),
      ...lookbookStories.map((story) => story.src),
      '/assets/optimized/img2-personagem.webp',
      '/assets/optimized/img3-personagem.webp',
      '/assets/optimized/img4-personagem.webp',
    ];
    for (const asset of new Set(assets)) {
      expect(publicPath(asset), asset).toSatisfy((path) => existsSync(path as string));
    }
  });

  it('keeps pt and en copy in sync', () => {
    expect(Object.keys(copy.en).sort()).toEqual(Object.keys(copy.pt).sort());
  });

  it('resolves localized strings', () => {
    const value = { pt: 'Sacola', en: 'Bag' };
    expect(tx(value, 'pt')).toBe('Sacola');
    expect(tx(value, 'en')).toBe('Bag');
  });
});
