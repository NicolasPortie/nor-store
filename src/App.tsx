import { ArrowUpRight } from '@phosphor-icons/react/dist/csr/ArrowUpRight';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { IntroCurtain } from './components/IntroCurtain';
import { JacketSequence } from './components/JacketSequence';
import { LookbookPan } from './components/LookbookPan';
import { LookSection } from './components/LookSection';
import { NameMarquee } from './components/NameMarquee';
import { PageMotion } from './components/PageMotion';
import { ProductGrid } from './components/ProductGrid';
import { ScrollSequence } from './components/ScrollSequence';
import { SneakerSequence } from './components/SneakerSequence';
import { products } from './data/catalog';
import { useCopy } from './i18n/locale';
import { useBag } from './hooks/useBag';

export function App() {
  const t = useCopy();
  const { cart, cartOpen, setCartOpen, count, addProducts, addToBag, removeFromBag, updateQuantity } = useBag();

  return (
    <div className="site-shell">
      <div className="site-content" inert={cartOpen}>
        <a className="skip-link" href="#shop">
          {t.skip}
        </a>
        <Header count={count} onOpenBag={() => setCartOpen(true)} />

        <main id="top">
          <ScrollSequence />

          <section id="drop" className="drop-intro-section nor-red" aria-labelledby="drop-title">
            <div className="drop-intro-word ghost-type" aria-hidden="true">
              DROP 001
            </div>
            <div className="drop-intro-frame content-frame">
              <div className="drop-intro-copy">
                <h2 id="drop-title" className="reveal-text">
                  {t.dropTitle.split('\n').map((line, index) => (
                    <span className="drop-title-line" key={index}>
                      <span>{line}</span>
                    </span>
                  ))}
                </h2>
                <p className="reveal-text">{t.dropBody}</p>
                <a className="text-link reveal-fade" href="#outerwear">
                  {t.dropLink} <span aria-hidden="true">↗</span>
                </a>
              </div>
              <figure className="drop-intro-figure">
                <div className="media-reveal">
                  <img
                    src="/assets/optimized/img2-personagem.webp"
                    alt={t.dropImageAlt}
                    loading="eager"
                    decoding="async"
                  />
                </div>
                <figcaption className="sr-only">{t.dropCaption}</figcaption>
              </figure>
            </div>
          </section>

          <JacketSequence />
          <SneakerSequence />

          <section id="about" className="brand-statement nor-red" aria-labelledby="statement-title">
            <div className="statement-ghost ghost-type" aria-hidden="true">
              NØR
            </div>
            <div className="content-frame statement-content">
              <h2 id="statement-title">
                {t.statementTitle.split('\n').map((line, index) => (
                  <span className="statement-title-line" key={index}>
                    {line}
                  </span>
                ))}
              </h2>
              <p className="statement-place">{t.statementPlace}</p>
              <p className="reveal-text">{t.statementBody}</p>
              <ul className="statement-facts">
                {t.statementFacts.map((fact) => (
                  <li key={fact.label}>
                    <span>{fact.label}</span>
                    <strong>{fact.value}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <LookSection onAdd={addToBag} onAddLook={addProducts} />
          <LookbookPan />

          <section id="shop" className="collection-section nor-ink" aria-labelledby="collection-title">
            <div className="content-frame">
              <div className="collection-heading">
                <h2 id="collection-title" className="reveal-text">
                  {t.shopTitle}
                </h2>
                <p className="reveal-text">{t.shopBody}</p>
              </div>
            </div>
            <NameMarquee />
            <div className="content-frame">
              <ProductGrid products={products} onAdd={addToBag} />
            </div>
          </section>

          <section id="system" className="symbol-section nor-red" aria-labelledby="symbol-title">
            <div className="symbol-giant ghost-type" aria-hidden="true">
              Ø
            </div>
            <div className="symbol-line" aria-hidden="true" />
            <div className="symbol-content content-frame">
              <div className="symbol-copy">
                <h2 id="symbol-title" className="reveal-text">
                  {t.symbolTitle}
                </h2>
                <p className="symbol-body reveal-text">{t.symbolBody}</p>
              </div>
              <div className="symbol-applications reveal-fade">
                {t.symbolItems.map((item, index) => (
                  <div className="symbol-row" key={item.name}>
                    <span className="symbol-index">{String(index + 1).padStart(2, '0')}</span>
                    <p className="symbol-name">{item.name}</p>
                    <span className="symbol-place">{item.place}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="campaign" className="campaign-section nor-ink" aria-labelledby="campaign-title">
            <div className="campaign-media media-reveal">
              <img src="/assets/optimized/img4-personagem.webp" alt={t.campaignAlt} loading="lazy" />
            </div>
            <div className="campaign-copy">
              <h2 id="campaign-title" className="reveal-text">
                {t.campaignTitle}
              </h2>
              <p className="reveal-text">{t.campaignBody}</p>
            </div>
          </section>

          <section className="closing-section nor-red" aria-labelledby="closing-title">
            <div className="closing-mark ghost-type" aria-hidden="true">
              Ø
            </div>
            <div className="content-frame closing-content">
              <h2 id="closing-title" className="reveal-text">
                {t.closingTitle}
              </h2>
              <div className="closing-links reveal-fade">
                <a className="closing-link" href="#shop">
                  {t.closingShop} <ArrowUpRight size={18} weight="light" aria-hidden="true" />
                </a>
                <a className="closing-link" href="#look">
                  {t.closingLook} <ArrowUpRight size={18} weight="light" aria-hidden="true" />
                </a>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
      <CartDrawer
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onRemove={removeFromBag}
        onUpdateQuantity={updateQuantity}
      />
      <PageMotion />
      <IntroCurtain />
    </div>
  );
}
