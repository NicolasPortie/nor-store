import { List } from '@phosphor-icons/react/dist/csr/List';
import { ShoppingBagOpen } from '@phosphor-icons/react/dist/csr/ShoppingBagOpen';
import { X } from '@phosphor-icons/react/dist/csr/X';
import { useEffect, useRef, useState } from 'react';
import { useCopy, useLocale } from '../i18n/locale';
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap';

export function Header({ count, onOpenBag }: { count: number; onOpenBag: () => void }) {
  const t = useCopy();
  const { locale, setLocale } = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);
  const countRef = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const previousCount = useRef(count);

  const navItems = [
    { href: '#shop', label: t.nav.shop },
    { href: '#drop', label: t.nav.drop },
    { href: '#about', label: t.nav.about },
  ];

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.body.classList.add('nav-is-open');
    document.addEventListener('keydown', onKey);
    overlayRef.current?.querySelector('a')?.focus();
    return () => {
      document.body.classList.remove('nav-is-open');
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  useGSAP(
    () => {
      const label = countRef.current;
      if (!label || prefersReducedMotion()) {
        previousCount.current = count;
        return undefined;
      }
      if (count > previousCount.current) {
        gsap.fromTo(label, { scale: 1.18 }, { scale: 1, duration: 0.32, ease: 'power4.out' });
      }
      previousCount.current = count;
    },
    { dependencies: [count] },
  );

  const closeMenu = () => setMenuOpen(false);

  const langSwitch = (
    <div className="lang-switch" role="group" aria-label={t.langAria}>
      <button
        type="button"
        className={locale === 'pt' ? 'is-active' : ''}
        aria-pressed={locale === 'pt'}
        aria-label={t.langPt}
        onClick={() => setLocale('pt')}
      >
        PT
      </button>
      <span aria-hidden="true">/</span>
      <button
        type="button"
        className={locale === 'en' ? 'is-active' : ''}
        aria-pressed={locale === 'en'}
        aria-label={t.langEn}
        onClick={() => setLocale('en')}
      >
        EN
      </button>
    </div>
  );

  return (
    <>
      <header className="site-header" data-menu-open={menuOpen ? 'true' : 'false'}>
        <a className="brand-lockup" href="#top" aria-label={t.brandHome}>
          <span className="brand-mark">NØR</span>
        </a>

        <nav className="site-nav" aria-label={t.navAria}>
          {navItems.map((item) => (
            <a href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          {langSwitch}
          <button
            className="bag-button"
            type="button"
            onClick={() => {
              setMenuOpen(false);
              onOpenBag();
            }}
            aria-label={t.bag(count)}
          >
            <ShoppingBagOpen size={18} weight="light" aria-hidden="true" />
            <span ref={countRef} className="bag-count">
              {String(count).padStart(2, '0')}
            </span>
          </button>
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <X size={20} weight="light" aria-hidden="true" />
            ) : (
              <List size={20} weight="light" aria-hidden="true" />
            )}
            <span className="sr-only">{menuOpen ? t.menuClose : t.menuOpen}</span>
          </button>
        </div>
      </header>

      <div ref={overlayRef} className={`nav-overlay${menuOpen ? ' is-open' : ''}`} id="mobile-nav" inert={!menuOpen}>
        <nav aria-label={t.navMobileAria}>
          {navItems.map((item) => (
            <a href={item.href} key={item.href} onClick={closeMenu}>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
