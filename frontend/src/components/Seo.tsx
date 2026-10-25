import { Helmet } from 'react-helmet-async';

interface Props {
  title: string;
  description: string;
  path?: string;
}

// Per-page <title>, meta description and Open Graph tags.
export default function Seo({ title, description, path = '/' }: Props) {
  const url = `https://polykarpoulaw.com${path}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Polykarpou Law" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content="https://polykarpoulaw.com/images/hero-justice.jpg" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}
