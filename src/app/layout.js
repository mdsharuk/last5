import '@/css/website.css';
import '@/css/account-base.css';
import '@/css/account.css';
import '@/css/brand.css';
import '@/css/app.css';
import '@/css/typography.css';
import '@/css/hero-carousel.css';
import { AppProvider } from '@/components/AppProvider';
import AntdTheme from '@/components/AntdTheme';

export const metadata = {
  title: 'Last5 Deal — Good food, another chance',
  description: 'Discover delicious surplus food from neighbourhood bakeries, cafés, restaurants and shops. Explore the Last5 Deal customer website preview.',
  icons: { icon: '/assets/favicon.svg', shortcut: '/assets/favicon.svg' },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#19678b',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="l5-body">
        <AntdTheme>
          <AppProvider>{children}</AppProvider>
        </AntdTheme>
      </body>
    </html>
  );
}
