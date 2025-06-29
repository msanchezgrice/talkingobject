import Link from 'next/link';
import Image from 'next/image';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const businesses = [
  {
    id: 1,
    name: "Franklin Barbecue",
    description: "World-famous BBQ joint known for its mouthwatering brisket and legendary lines. A true Austin institution that has revolutionized Texas barbecue.",
    image: "/images/placeholder.jpg",
    location: "900 E 11th St, Austin, TX 78702",
    type: "Restaurant",
    features: ["Award-winning BBQ", "Local Favorite", "Cultural Icon"],
  },
  {
    id: 2,
    name: "BookPeople",
    description: "Texas' largest independent bookstore, hosting author events and fostering a vibrant literary community since 1970. A beloved Austin landmark for book lovers.",
    image: "/images/placeholder.jpg",
    location: "603 N Lamar Blvd, Austin, TX 78703",
    type: "Retail",
    features: ["Independent Bookstore", "Author Events", "Local Business"],
  },
  {
    id: 3,
    name: "Alamo Drafthouse Cinema",
    description: "An innovative movie theater chain that started in Austin, combining films with food, drinks, and a strict no-talking policy. Known for unique programming and events.",
    image: "/images/placeholder.jpg",
    location: "1120 S Lamar Blvd, Austin, TX 78704",
    type: "Entertainment",
    features: ["Dinner Theater", "Special Events", "Austin Original"],
  },
];

export default function BusinessesPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Businesses</h1>
          <p className="text-xl text-gray-400">
            Create interactive mascots and guides for your customers
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {businesses.map((business) => (
            <div key={business.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <div className="relative h-64">
                <Image
                  src={business.image}
                  alt={business.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold text-white">{business.name}</h3>
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                    {business.type}
                  </span>
                </div>
                <p className="text-gray-400 mb-4">{business.description}</p>
                <div className="space-y-2">
                  <p className="text-gray-300">
                    <span className="font-semibold">Location:</span> {business.location}
                  </p>
                  <div>
                    <span className="font-semibold text-gray-300">Features:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {business.features.map((feature) => (
                        <span
                          key={feature}
                          className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
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
            Create Your Own Business Agent
          </Link>
        </div>
      </div>
    </div>
  );
} 