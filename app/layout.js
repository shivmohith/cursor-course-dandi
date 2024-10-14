import './globals.css';
import Layout from './components/Layout';

export const metadata = {
  title: 'Tavily Dashboard',
  description: 'Research and API management dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
