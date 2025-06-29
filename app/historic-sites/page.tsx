import Link from 'next/link';
import Image from 'next/image';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const historicSites = [
  {
    id: 1,
    name: "Texas State Capitol",
    description: "The magnificent Texas State Capitol building, standing proudly as the seat of Texas government since 1888. With its distinctive pink granite facade and Renaissance Revival style, it stands taller than even the U.S. Capitol in Washington D.C.",
    image: "/images/austin/texas-capitol.jpg",
    location: "1100 Congress Ave, Austin, TX 78701",
    yearBuilt: 1888,
  },
  {
    id: 2,
    name: "Driskill Hotel",
    description: "Built in 1886, the historic Driskill Hotel is the oldest operating hotel in Austin. This Romanesque-style building has hosted numerous politicians, celebrities, and is said to be home to several friendly ghosts.",
    image: "/images/placeholder.jpg",
    location: "604 Brazos St, Austin, TX 78701",
    yearBuilt: 1886,
  },
  {
    id: 3,
    name: "Treaty Oak",
    description: "A 500+ year-old live oak tree and the last surviving member of the Council Oaks. Once a sacred meeting place for Native American tribes, it survived a poisoning attempt in 1989 and stands as a symbol of Austin's resilience.",
    image: "/images/austin/treaty-oak.jpg",
    location: "507 Baylor St, Austin, TX 78703",
    yearBuilt: 1500,
  },
];

export default function HistoricSitesPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Historic Sites</h1>
          <p className="text-xl text-gray-400">
            Let landmarks tell their own stories and historical significance
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {historicSites.map((site) => (
            <div key={site.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <div className="relative h-64">
                <Image
                  src={site.image}
                  alt={site.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{site.name}</h3>
                <p className="text-gray-400 mb-4">{site.description}</p>
                <div className="space-y-2">
                  <p className="text-gray-300">
                    <span className="font-semibold">Location:</span> {site.location}
                  </p>
                  <p className="text-gray-300">
                    <span className="font-semibold">Year Built:</span> {site.yearBuilt}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/dashboard/create"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your Own Historic Site Agent
          </Link>
        </div>
      </div>
    </div>
  );
} 