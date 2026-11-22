import Link from 'next/link';
import { PublicHeader, PublicFooter, Toasts } from '@/components/PublicChrome';

export default function NotFound() {
  return (
    <div className="public-app">
      <a className="skip" href="#main">Skip to content</a>
      <PublicHeader />
      <main id="main" tabIndex={-1}>
        <section className="section">
          <div className="container">
            <div className="empty">
              <h2>This little corner is missing.</h2>
              <p>The page or sample record could not be found. Let’s find you something good.</p>
              <Link className="button" href="/">Back to the homepage</Link>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
      <Toasts />
    </div>
  );
}
