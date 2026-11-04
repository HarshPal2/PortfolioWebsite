// The four visual projects share one layout and stylesheet.
import '@/styles/reading/project.css';
import CabinInTheWoodsReading from '@/content/reading/cabin-in-the-woods';
import ProductRendersReading from '@/content/reading/product-renders';
import BiophilicInteriorReading from '@/content/reading/biophilic-interior';
import PosterCollectionReading from '@/content/reading/poster-collection';

const PAGES = {
  'cabin-in-the-woods': {
    Content: CabinInTheWoodsReading,
    title: 'Cabin in the Woods — Harsh (Reading version)',
    description: 'An architectural visualization study exploring stillness, materiality, and light in an ancient woodland.',
  },
  'product-renders': {
    Content: ProductRendersReading,
    title: 'Product Renders — Harsh (Reading version)',
    description: 'A curated collection of 3D look-development, hard-surface detailing, and photorealistic material studies.',
  },
  'biophilic-interior': {
    Content: BiophilicInteriorReading,
    title: 'Biophilic Interior — Harsh (Reading version)',
    description: 'A serene spatial sanctuary investigating the symbiosis of raw timber, tranquil water, and living flora.',
  },
  'poster-collection': {
    Content: PosterCollectionReading,
    title: 'Poster Collection — Harsh (Reading version)',
    description: 'A curated collection exploring speculative cinema, lucid dreamscapes, and whimsical character typography.',
  },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = PAGES[slug];
  return { title: p.title, description: p.description };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const { Content } = PAGES[slug];
  return <Content />;
}
