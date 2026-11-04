'use client';
// /projects/: the Bedroom PC screen. On computers the screen shows the Freedom OS desktop;
// on phones it shows the project list. The markup is rendered once; the page controller and
// the desktop take over after mount.
import { useEffect } from 'react';
import PcScreen from './PcScreen';
import { initProjectsPage } from '@/lib/projects/controller';
import { initFreedomOS } from '@/lib/projects/os';

export default function ProjectsPage() {
  useEffect(() => {
    let cancelled = false;
    import('parallax-js').then((mod) => mod.default || mod).catch(() => null).then((Parallax) => {
      if (cancelled) return;
      initProjectsPage(Parallax);
      document.documentElement.classList.remove('pc-intro-pending');
      initFreedomOS();
    });
    return () => { cancelled = true; };
  }, []);

  return <PcScreen />;
}
