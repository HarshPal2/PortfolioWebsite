// Root layout for the reading version (/reading/...): plain, fast, text-first pages.
export default function ReadingLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Belleza&family=GFS+Didot&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
