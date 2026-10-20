import { ArrowUpRight } from '@phosphor-icons/react/dist/csr/ArrowUpRight';
import type { Product } from '../types';
import { products } from '../data/catalog';
import { useCopy } from '../i18n/locale';

export function LookSection({
  onAdd,
  onAddLook,
}: {
  onAdd: (product: Product) => void;
  onAddLook: (items: Product[]) => void;
}) {
  const t = useCopy();
  const jacket = products[0];
  const cargo = products[1];
  const sneaker = products[2];
  const beanie = products[4];

  return (
    <section id="look" className="look-section nor-red" aria-labelledby="look-title">
      <div className="look-frame">
        <div className="look-copy">
          <h2 id="look-title" className="reveal-text">
            {t.lookTitle}
          </h2>
          <p className="reveal-text">{t.lookBody}</p>
          <button
            className="look-cta reveal-fade"
            data-magnetic
            type="button"
            onClick={() => onAddLook([jacket, cargo, sneaker, beanie])}
          >
            {t.lookCta}
            <ArrowUpRight size={18} weight="light" aria-hidden="true" />
          </button>
        </div>

        <div className="look-portrait">
          <div className="media-reveal">
            <img
              src="/assets/optimized/nor-human-look-beanie-catalog.webp"
              width={1280}
              height={1920}
              alt={t.lookPortraitAlt}
              loading="lazy"
            />
          </div>
          <button className="look-hotspot look-hotspot--chest" type="button" onClick={() => onAdd(jacket)}>
            {t.lookJacket}
          </button>
          <button className="look-hotspot look-hotspot--head" type="button" onClick={() => onAdd(beanie)}>
            {t.lookBeanie}
          </button>
          <button className="look-hotspot look-hotspot--leg" type="button" onClick={() => onAdd(cargo)}>
            {t.lookCargo}
          </button>
          <button className="look-hotspot look-hotspot--shoe" type="button" onClick={() => onAdd(sneaker)}>
            {t.lookSneaker}
          </button>
        </div>

        <div className="look-stack">
          <div className="look-detail-image">
            <div className="media-reveal">
              <img
                src="/assets/optimized/nor-human-shell-detail.webp"
                width={1280}
                height={1920}
                alt={t.lookShellAlt}
                loading="lazy"
              />
            </div>
            <span>{t.lookJacket}</span>
          </div>
          <div className="look-detail-image look-detail-image--small">
            <div className="media-reveal">
              <img
                src="/assets/optimized/nor-human-woman-look-cap.webp"
                width={1280}
                height={1920}
                alt={t.lookWomanAlt}
                loading="lazy"
              />
            </div>
            <span>{t.lookCap}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
