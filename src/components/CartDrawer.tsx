import { ArrowRight } from '@phosphor-icons/react/dist/csr/ArrowRight';
import { Minus } from '@phosphor-icons/react/dist/csr/Minus';
import { Plus } from '@phosphor-icons/react/dist/csr/Plus';
import { X } from '@phosphor-icons/react/dist/csr/X';
import { useEffect, useRef } from 'react';
import { useCopy, useLocale } from '../i18n/locale';
import { gsap } from '../lib/gsap';
import { tx, type CartLine } from '../types';

type CartDrawerProps = {
  open: boolean;
  items: CartLine[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
};

export function CartDrawer({ open, items, onClose, onRemove, onUpdateQuantity }: CartDrawerProps) {
  const t = useCopy();
  const { locale } = useLocale();
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (!open) {
      if (wasOpen.current) {
        document.querySelector<HTMLButtonElement>('.bag-button')?.focus();
        wasOpen.current = false;
      }
      return undefined;
    }

    wasOpen.current = true;
    const html = document.documentElement;
    const { body } = document;
    const scrollbar = window.innerWidth - html.clientWidth;
    const previousPadding = body.style.paddingRight;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    html.classList.add('cart-is-open');
    body.classList.add('cart-is-open');
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    document.addEventListener('keydown', handleKeyDown);
    closeRef.current?.focus();

    return () => {
      html.classList.remove('cart-is-open');
      body.classList.remove('cart-is-open');
      body.style.paddingRight = previousPadding;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  const count = items.reduce((total, item) => total + item.quantity, 0);

  const goToShop = () => {
    onClose();
    const destination = document.querySelector<HTMLElement>('#shop');
    if (!destination) return;
    gsap.to(window, {
      duration: 0.9,
      ease: 'power3.inOut',
      scrollTo: { y: destination, autoKill: true },
      onComplete: () => {
        history.replaceState(null, '', '#shop');
      },
    });
  };

  return (
    <div className={`cart-layer${open ? ' is-open' : ''}`} inert={!open}>
      <button className="cart-backdrop" type="button" aria-label={t.cartClose} onClick={onClose} />
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <div className="cart-heading">
          <h2 id="cart-title">
            {t.cartTitle} <span aria-live="polite">({String(count).padStart(2, '0')})</span>
          </h2>
          <button ref={closeRef} className="icon-button" type="button" onClick={onClose} aria-label={t.cartClose}>
            <X size={20} weight="light" aria-hidden="true" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <span className="cart-empty-symbol" aria-hidden="true">
              Ø
            </span>
            <p>{t.cartEmpty}</p>
            <button type="button" className="cart-continue" onClick={goToShop}>
              {t.cartSeeCollection} <ArrowRight size={18} weight="light" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <>
            <div className="cart-lines">
              {items.map((item) => (
                <div className="cart-line" key={item.id}>
                  <img src={item.image} alt="" />
                  <div className="cart-line-copy">
                    <span>{tx(item.category, locale)}</span>
                    <h3>{tx(item.name, locale)}</h3>
                    <div className="cart-line-actions">
                      <div className="cart-qty">
                        <button
                          type="button"
                          className="qty-button"
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          aria-label={t.cartMinus(tx(item.name, locale))}
                        >
                          <Minus size={13} weight="light" aria-hidden="true" />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          className="qty-button"
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          aria-label={t.cartPlus(tx(item.name, locale))}
                        >
                          <Plus size={13} weight="light" aria-hidden="true" />
                        </button>
                      </div>
                      <button
                        type="button"
                        className="cart-remove"
                        onClick={() => onRemove(item.id)}
                        aria-label={t.cartRemoveItem(tx(item.name, locale))}
                      >
                        {t.cartRemove}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <p>{t.cartNote}</p>
              <button className="cart-checkout" type="button" onClick={onClose}>
                {t.cartContinue} <ArrowRight size={18} weight="light" aria-hidden="true" />
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
