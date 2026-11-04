import '@/styles/reading/glusight.css';
import GlusightReading from '@/content/reading/glusight';

export const metadata = {
  title: 'GluSight — Harsh (Reading version)',
  description: 'What if your glucose monitor could tell you what happens next?',
};

export default function Page() {
  return <GlusightReading />;
}
