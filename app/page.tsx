import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-8">
              Bring Objects to Life with Talking Objects
            </h1>
            <p className="text-xl mb-12 text-gray-300">
              Imagine statues, landmarks, and everyday items sharing their stories and interacting with people. 
              Create magical experiences that blend the physical world with imagination.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/dashboard" 
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Create a Talking Object
              </Link>
              <Link 
                href="/explore" 
                className="border border-gray-600 hover:border-gray-400 text-white font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Explore Objects
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
              <div className="h-16 w-16 bg-blue-900 rounded-full flex items-center justify-center mb-6 text-blue-200 text-2xl font-bold">1</div>
              <h3 className="text-xl font-bold mb-4 text-blue-400">Create Your Object</h3>
              <p className="text-gray-300">Define your object&apos;s personality, story, and knowledge. Give voice to statues, landmarks, or anything you can imagine.</p>
            </div>
            <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
              <div className="h-16 w-16 bg-blue-900 rounded-full flex items-center justify-center mb-6 text-blue-200 text-2xl font-bold">2</div>
              <h3 className="text-xl font-bold mb-4 text-blue-400">Place in the World</h3>
              <p className="text-gray-300">Connect your talking object to real-world locations. Add coordinates or place QR codes for visitors to interact with.</p>
            </div>
            <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
              <div className="h-16 w-16 bg-blue-900 rounded-full flex items-center justify-center mb-6 text-blue-200 text-2xl font-bold">3</div>
              <h3 className="text-xl font-bold mb-4 text-blue-400">Begin Conversations</h3>
              <p className="text-gray-300">Watch as people discover and chat with your creation. Bring magic and wonder to everyday places and objects.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center">Hear From Talking Objects</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {/* Treaty Oak Testimonial */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 relative">
              <div className="absolute -top-10 left-10 h-20 w-20 bg-gray-800 rounded-full overflow-hidden border-4 border-gray-900">
                <div className="w-full h-full flex items-center justify-center bg-green-900">
                  <span className="text-green-200 text-2xl font-bold">T</span>
                </div>
              </div>
              <div className="mt-8">
                <p className="italic text-gray-300 mb-4">
                  &quot;I&apos;ve stood in this park for over 500 years. Now I can finally share my stories with visitors - from surviving a poisoning attempt in 1989 to watching Austin grow from a small settlement to the city it is today.&quot;
                </p>
                <p className="font-bold">Treaty Oak</p>
                <p className="text-sm text-gray-400">Austin&apos;s oldest resident</p>
              </div>
            </div>
            
            {/* Statue Testimonial */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 relative">
              <div className="absolute -top-10 left-10 h-20 w-20 bg-gray-800 rounded-full overflow-hidden border-4 border-gray-900">
                <div className="w-full h-full flex items-center justify-center bg-blue-900">
                  <span className="text-blue-200 text-2xl font-bold">S</span>
                </div>
              </div>
              <div className="mt-8">
                <p className="italic text-gray-300 mb-4">
                  &quot;People have taken photos with me for years, but now they can hear my music and stories too. I love telling visitors about the Austin blues scene and my favorite guitar licks.&quot;
                </p>
                <p className="font-bold">Stevie Ray Vaughan Statue</p>
                <p className="text-sm text-gray-400">Auditorium Shores, Lady Bird Lake</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Example Conversations */}
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center">Magical Conversations</h2>
          
          <div className="max-w-2xl mx-auto bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
            <div className="p-4 bg-gray-800 border-b border-gray-700">
              <h3 className="font-bold">Chat with Congress Avenue Bats</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start">
                <div className="bg-gray-800 rounded-full h-8 w-8 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-gray-400">👤</span>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 text-gray-300">
                  What time do you all usually fly out from under the bridge?
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-900 rounded-full h-8 w-8 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-blue-200">🦇</span>
                </div>
                <div className="bg-blue-900 rounded-lg p-3 text-blue-100">
                  We typically emerge around sunset, which is around 8:15 PM this time of year. The best viewing is usually 15-30 minutes after sunset when we start our nightly hunt. Tonight looks perfect - warm with lots of insects to eat. Over a million of us will take flight in waves! Bring a camera but don&apos;t use flash - it disturbs our navigation.
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-gray-800 rounded-full h-8 w-8 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-gray-400">👤</span>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 text-gray-300">
                  That&apos;s amazing! How long have bats been living under this bridge?
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-900 rounded-full h-8 w-8 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-blue-200">🦇</span>
                </div>
                <div className="bg-blue-900 rounded-lg p-3 text-blue-100">
                  We&apos;ve been calling Congress Avenue Bridge home since the early 1980s after it was renovated. The new design created perfect crevices for our colony! We&apos;re Mexican free-tailed bats, and we&apos;re the largest urban bat colony in North America. We consume 10-30,000 pounds of insects nightly - keeping Austin&apos;s mosquito population in check!
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Create Your Talking Object?</h2>
            <p className="text-xl mb-10 text-gray-300">
              Bring landmarks, art, historic sites, and everyday objects to life with personality and stories. 
              Create memorable experiences that educate, entertain, and inspire.
            </p>
            <Link 
              href="/dashboard" 
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg transition-colors inline-block"
            >
              Get Started – It&apos;s Free
            </Link>
            <p className="mt-6 text-gray-400">
              No coding required. Create talking objects in minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center">Bring Magic to...</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 text-center">
              <div className="h-16 w-16 mx-auto bg-purple-900 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🏛️</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Historic Sites</h3>
              <p className="text-gray-300">Let landmarks tell their own stories and historical significance.</p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 text-center">
              <div className="h-16 w-16 mx-auto bg-green-900 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🏞️</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Parks & Nature</h3>
              <p className="text-gray-300">Give voice to trees, landscapes, and natural wonders.</p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 text-center">
              <div className="h-16 w-16 mx-auto bg-red-900 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🎨</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Public Art</h3>
              <p className="text-gray-300">Let murals, sculptures and street art share their creative stories.</p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 text-center">
              <div className="h-16 w-16 mx-auto bg-yellow-900 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🏪</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Businesses</h3>
              <p className="text-gray-300">Create interactive mascots and guides for your customers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          © 2025 Talking Objects. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
