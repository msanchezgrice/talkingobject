import Link from 'next/link';
import Image from 'next/image';

const parksAndNature = [
  {
    id: 1,
    name: "Barton Springs Pool",
    description: "A natural spring-fed pool maintaining a refreshing 68-70 degrees year-round. Home to the endangered Barton Springs salamander and a favorite spot for locals and visitors alike.",
    image: "/images/austin/barton-springs.jpg",
    location: "2131 William Barton Dr, Austin, TX 78746",
    features: ["Natural Spring", "Swimming", "Wildlife Habitat"],
  },
  {
    id: 2,
    name: "Lady Bird Lake",
    description: "A reservoir on the Colorado River in downtown Austin, offering 10 miles of trails, kayaking, paddleboarding, and beautiful views of the city skyline.",
    image: "/images/austin/pfluger-bridge.jpg",
    location: "Downtown Austin",
    features: ["Hiking Trails", "Water Activities", "Bird Watching"],
  },
  {
    id: 3,
    name: "Mount Bonnell",
    description: "The highest point in Austin at 775 feet, offering panoramic views of the city, Lake Austin, and the surrounding Hill Country. A popular spot for picnics and sunset viewing.",
    image: "/images/austin/mount-bonnell.jpg",
    location: "3800 Mount Bonnell Rd, Austin, TX 78731",
    features: ["Scenic Views", "Hiking", "Picnic Areas"],
  },
];

export default function ParksAndNaturePage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Parks & Nature</h1>
          <p className="text-xl text-gray-400">
            Give voice to trees, landscapes, and natural wonders
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {parksAndNature.map((park) => (
            <div key={park.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <div className="relative h-64">
                <Image
                  src={park.image}
                  alt={park.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{park.name}</h3>
                <p className="text-gray-400 mb-4">{park.description}</p>
                <div className="space-y-2">
                  <p className="text-gray-300">
                    <span className="font-semibold">Location:</span> {park.location}
                  </p>
                  <div>
                    <span className="font-semibold text-gray-300">Features:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {park.features.map((feature) => (
                        <span
                          key={feature}
                          className="bg-green-900 text-green-100 px-3 py-1 rounded-full text-sm"
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
            Create Your Own Nature Agent
          </Link>
        </div>
      </div>
    </div>
  );
} 