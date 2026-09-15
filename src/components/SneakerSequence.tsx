import { useCopy } from '../i18n/locale';

export function SneakerSequence() {
  const t = useCopy();

  return (
    <section id="footwear" className="product-sequence sneaker-sequence nor-ink" aria-labelledby="sneaker-title">
      <div className="product-sequence-inner">
        <div className="product-sequence-label">
          <h2 id="sneaker-title">{t.sneakerTitle}</h2>
          <p>{t.sneakerBody}</p>
        </div>

        <div className="product-image-stage sneaker-stage">
          <img
            className="sneaker-shot"
            src="/assets/optimized/nor-001-sneaker-packshot-red.webp"
            alt={t.sneakerImageAlt}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="product-detail-panel">
          <p>
            {t.sneakerLines.split('\n').map((line, index, lines) => (
              <span key={line}>
                {line}
                {index < lines.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
          <span className="detail-rule" aria-hidden="true" />
          <span className="detail-callout">{t.sneakerCallout}</span>
        </div>
      </div>
    </section>
  );
}
