import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { voiceConfigs } from '@/lib/voices';
import CategoryContent from './CategoryContent';

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const categoryInfo = {
  historicSites: {
    title: "Historic Sites",
    description: "Let landmarks tell their own stories and historical significance.",
    heroImage: "/images/historic-sites-hero.jpg",
    color: "bg-purple-600",
    textColor: "text-purple-600"
  },
  parksAndNature: {
    title: "Parks & Nature",
    description: "Give voice to trees, landscapes, and natural wonders.",
    heroImage: "/images/parks-nature-hero.jpg",
    color: "bg-green-600",
    textColor: "text-green-600"
  },
  publicArt: {
    title: "Public Art",
    description: "Let murals, sculptures and street art share their creative stories.",
    heroImage: "/images/public-art-hero.jpg",
    color: "bg-red-600",
    textColor: "text-red-600"
  },
  businesses: {
    title: "Businesses",
    description: "Create interactive mascots and guides for your customers.",
    heroImage: "/images/businesses-hero.jpg",
    color: "bg-amber-600",
    textColor: "text-amber-600"
  }
};

export async function generateMetadata({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const category = resolvedParams.category as keyof typeof voiceConfigs;
  const info = categoryInfo[category];

  if (!info) {
    return {
      title: 'Category Not Found',
      description: 'The requested category does not exist.'
    };
  }

  return {
    title: `${info.title} - Talking Objects`,
    description: info.description
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const category = resolvedParams.category as keyof typeof voiceConfigs;
  const info = categoryInfo[category];

  if (!info) {
    notFound();
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    }>
      <CategoryContent category={category} info={info} />
    </Suspense>
  );
} 