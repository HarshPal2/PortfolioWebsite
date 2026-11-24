// Root layout for the reading version (/reading/...): plain, fast, text-first pages.
export default function ReadingLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/Media/logo/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Belleza&family=GFS+Didot&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
