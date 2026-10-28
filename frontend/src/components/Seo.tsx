import { Helmet } from 'react-helmet-async';

interface Props {
  title: string;
  description: string;
  path?: string;
  /** Keep the page out of search indexes (e.g. the client/admin portal). */
  noindex?: boolean;
}

// Per-page <title>, meta description and Open Graph tags.
export default function Seo({ title, description, path = '/', noindex = false }: Props) {
  const url = `https://polykarpoulaw.com${path}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Polykarpou & Co. LLC" />
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
