import { useCopy } from '../i18n/locale';

export function JacketSequence() {
  const t = useCopy();

  return (
    <section id="outerwear" className="product-sequence jacket-sequence nor-red" aria-labelledby="jacket-title">
      <div className="product-sequence-inner">
        <div className="product-sequence-label">
          <h2 id="jacket-title">{t.jacketTitle}</h2>
          <p>{t.jacketBody}</p>
        </div>

        <div className="product-image-stage jacket-stage">
          <img src="/assets/optimized/nor-tech-shell.webp" alt={t.jacketImageAlt} loading="lazy" decoding="async" />
        </div>

        <div className="product-detail-panel">
          <p>
            {t.jacketLines.split('\n').map((line, index, lines) => (
              <span key={line}>
                {line}
                {index < lines.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
          <span className="detail-rule" aria-hidden="true" />
          <span className="detail-callout">{t.jacketCallout}</span>
        </div>
      </div>
    </section>
  );
}
