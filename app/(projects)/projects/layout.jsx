// Root layout for /projects/: the Bedroom PC screen.
import '@/styles/projects.css';
import '@/styles/projects-os.css';

export const metadata = {
  title: 'Project 001 — Harsh Portfolio',
  description: 'Editorial project showcase featuring architectural 3D spatial design.',
};

// Runs before first paint: when this page is reached with Back/Forward from a house that was
// showing the Bedroom, the PC zoom is replayed, so the screen content must not flash first.
// (Only reads the flags; the page script consumes them.)
const PRE_PAINT = `try{var n=(performance.getEntriesByType('navigation')[0]||{}).type;var r=document.referrer?new URL(document.referrer):null;
var fromHouse=!!r&&history.length>=2&&r.origin===location.origin&&/^\\/(index\\.html)?$/.test(r.pathname);
if(n==='back_forward'&&fromHouse&&sessionStorage.getItem('houseRoomSettled')==='bedroom'){document.documentElement.classList.add('pc-intro-pending');}}catch(e){}`;

export default function ProjectsLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PRE_PAINT }} />
        {/* Fonts: GFS Didot (headings) & Belleza (body) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Belleza&family=GFS+Didot&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource-variable/alyamama/index.css" />
      </head>
      <body className="is-loading" suppressHydrationWarning>{children}</body>
    </html>
  );
}
