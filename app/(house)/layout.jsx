// Root layout for the 3D house (/).
import '@/styles/house.css';

export const metadata = {
  title: 'Harsh — Visual Designer & 3D Artist',
  description: 'Portfolio of Harsh, a visual designer and 3D artist creating experiences through emotions, motion, and storytelling.',
};

// Hide the Freedom splash on first paint once the intro has already played this session.
const INTRO_CHECK = `try{if(sessionStorage.getItem('portfolioIntroCompleted')==='true'){document.documentElement.classList.add('intro-completed');}}catch(e){}`;

export default function HouseLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_CHECK }} />
        {/* Fonts: GFS Didot (headline), Belleza (body), Alyamama, Playfair Display & Montserrat */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Belleza&family=GFS+Didot&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource-variable/alyamama/index.css" />
        <link rel="preload" as="image" type="image/avif" href="Media/Living_Bedroom/LivingToBedroom0097.avif" />
        <link rel="prefetch" href="projects/" />
        <link rel="prefetch" href="Media/BedroomToPCScreen/BedroomtoPc0562.avif" />
      </head>
      <body>{children}</body>
    </html>
  );
}
