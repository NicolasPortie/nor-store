import { ArrowUp } from '@phosphor-icons/react/dist/csr/ArrowUp';
import { ArrowUpRight } from '@phosphor-icons/react/dist/csr/ArrowUpRight';
import { type FormEvent, useState } from 'react';
import { useCopy } from '../i18n/locale';

export function Footer() {
  const t = useCopy();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <footer className="site-footer">
      <div className="footer-top content-frame">
        <a className="footer-brand" href="#top">
          NØR
        </a>
        <div className="footer-links">
          <div>
            <span className="footer-label">{t.footerNav}</span>
            <a href="#shop">{t.footerShop}</a>
            <a href="#about">{t.footerAbout}</a>
            <a href="mailto:hello@nor.studio">{t.footerContact}</a>
          </div>
          <div>
            <span className="footer-label">{t.footerSocial}</span>
            <p className="footer-soon">Instagram — {t.footerSocialSoon}</p>
            <p className="footer-soon">TikTok — {t.footerSocialSoon}</p>
          </div>
        </div>
        <div className="footer-newsletter">
          <span className="footer-label">{t.footerNews}</span>
          {submitted ? (
            <p className="newsletter-success">{t.footerNewsOk}</p>
          ) : (
            <form onSubmit={onSubmit}>
              <label htmlFor="newsletter-email" className="sr-only">
                {t.footerEmail}
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder={t.footerEmailPlaceholder}
                autoComplete="email"
                required
              />
              <button type="submit" aria-label={t.footerEmailAria}>
                <ArrowUpRight size={18} weight="light" aria-hidden="true" />
              </button>
            </form>
          )}
        </div>
      </div>
      <div className="footer-bottom content-frame">
        <span>{t.footerCity}</span>
        <span>© 2026 NØR</span>
        <a href="#top">
          {t.footerTop} <ArrowUp size={15} weight="light" aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
