import Link from 'next/link';
import Image from 'next/image';

const publicArt = [
  {
    id: 1,
    name: "I Love You So Much Mural",
    description: "An iconic green graffiti mural on the side of Jo's Coffee that has become one of Austin's most photographed spots and a symbol of the city's spirit.",
    image: "/images/austin/i-love-you-so-much.jpg",
    location: "1300 S Congress Ave, Austin, TX 78704",
    artist: "Amy Cook",
    year: 2010,
  },
  {
    id: 2,
    name: "Greetings from Austin Mural",
    description: "A vintage postcard-style mural featuring iconic Austin imagery within each letter. Created in 1998, it has become a must-visit photo opportunity.",
    image: "/images/austin/greetings-from-austin.jpg",
    location: "1720 S 1st St, Austin, TX 78704",
    artist: "Todd Sanders & Rory Skagen",
    year: 1998,
  },
  {
    id: 3,
    name: "Stevie Ray Vaughan Statue",
    description: "A bronze statue honoring the legendary Texas blues guitarist, located along Lady Bird Lake's hiking trail at Auditorium Shores.",
    image: "/images/austin/stevie-ray-vaughan.jpg",
    location: "800 W Riverside Dr, Austin, TX 78704",
    artist: "Ralph Helmick",
    year: 1993,
  },
];

export default function PublicArtPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Public Art</h1>
          <p className="text-xl text-gray-400">
            Let murals, sculptures and street art share their creative stories
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publicArt.map((art) => (
            <div key={art.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <div className="relative h-64">
                <Image
                  src={art.image}
                  alt={art.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{art.name}</h3>
                <p className="text-gray-400 mb-4">{art.description}</p>
                <div className="space-y-2">
                  <p className="text-gray-300">
                    <span className="font-semibold">Location:</span> {art.location}
                  </p>
                  <p className="text-gray-300">
                    <span className="font-semibold">Artist:</span> {art.artist}
                  </p>
                  <p className="text-gray-300">
                    <span className="font-semibold">Year:</span> {art.year}
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
            Create Your Own Art Agent
          </Link>
        </div>
      </div>
    </div>
  );
} 