// Root layout for the 3D house (/).
import '@/styles/house.css';

export const metadata = {
  title: 'Harsh — Visual Designer & 3D Artist',
  description: 'Portfolio of Harsh, a visual designer and 3D artist creating experiences through emotions, motion, and storytelling.',
};

// Before first paint:
//  - hide the splash once the intro has already played this session;
//  - mark which room the page will open on (html[data-room]) so the placeholder picture behind the
//    canvas is that room, not the Entrance or the Living room, and preload that one picture.
const PRE_PAINT = `(function () {
      var room = 'living', intro = false;
      try {
        intro = sessionStorage.getItem('portfolioIntroCompleted') === 'true';
        if (sessionStorage.getItem('returnFromProjectsToLiving') === 'true' ||
            sessionStorage.getItem('returnFromProjects') === 'true') {
          room = 'pc';                     // the page opens on the PC screen and zooms back out
        } else {
          var h = (location.hash || '').replace('#', '').toLowerCase();
          var map = { home: 'living', about: 'living', living: 'living', projects: 'bedroom', bedroom: 'bedroom',
            blog: 'kitchen', blogs: 'kitchen', kitchen: 'kitchen', 'about-me': 'poolroom', aboutme: 'poolroom',
            reviews: 'poolroom', poolroom: 'poolroom', contact: 'office', office: 'office' };
          room = map[h] || 'living';
        }
      } catch (e) { }
      var d = document.documentElement;
      if (intro) d.classList.add('intro-completed');
      if (intro || room === 'pc') d.setAttribute('data-room', room);
      var frames = { living: '/Media/Living_Bedroom/LivingToBedroom0097.avif', bedroom: '/Media/Living_Bedroom/LivingToBedroom0144.avif',
        kitchen: '/Media/Living_Kitchen/LivingToKitchen0169.avif', poolroom: '/Media/Living_Pool/LivingToPool0218.avif',
        office: '/Media/Living_Office/LivingToOffice0267.avif', pc: '/Media/BedroomToPCScreen/BedroomToPc0562.avif' };
      var l = document.createElement('link');
      l.rel = 'preload'; l.as = 'image'; l.type = 'image/avif';
      l.href = (intro || room === 'pc') ? frames[room] : '/Media/Entrance/Entrance0001.avif';
      document.head.appendChild(l);
    })();`;

export default function HouseLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PRE_PAINT }} />
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/Media/logo/apple-touch-icon.png" />
        <meta name="theme-color" content="#000000" />
        {/* Fonts: GFS Didot (headline), Belleza (body), Alyamama, Playfair Display & Montserrat */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Belleza&family=GFS+Didot&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource-variable/alyamama/index.css" />
        <link rel="prefetch" href="projects/" />
        <link rel="prefetch" href="/Media/BedroomToPCScreen/BedroomToPc0562.avif" />
      </head>
      <body>{children}</body>
    </html>
  );
}
