import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Hero Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-8 shadow-lg">
              <span className="text-3xl">🗣️</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Bring Objects to Life with Talking Objects
            </h1>
            <p className="text-xl mb-12 text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Imagine statues, landmarks, and everyday items sharing their stories and interacting with people. 
              Create magical experiences that blend the physical world with imagination.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/dashboard" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Create a Talking Object
              </Link>
              <Link 
                href="/explore" 
                className="bg-white/70 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-300 text-gray-800 font-bold py-4 px-8 rounded-full transition-all duration-200 shadow-md hover:shadow-lg hover:bg-white/80"
              >
                Explore Objects
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/80">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6 text-white text-2xl font-bold shadow-lg">1</div>
              <h3 className="text-xl font-bold mb-4 text-blue-600">Create Your Object</h3>
              <p className="text-gray-700">Define your object&apos;s personality, story, and knowledge. Give voice to statues, landmarks, or anything you can imagine.</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/80">
              <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-6 text-white text-2xl font-bold shadow-lg">2</div>
              <h3 className="text-xl font-bold mb-4 text-purple-600">Place in the World</h3>
              <p className="text-gray-700">Connect your talking object to real-world locations. Add coordinates or place QR codes for visitors to interact with.</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/80">
              <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-6 text-white text-2xl font-bold shadow-lg">3</div>
              <h3 className="text-xl font-bold mb-4 text-green-600">Begin Conversations</h3>
              <p className="text-gray-700">Watch as people discover and chat with your creation. Bring magic and wonder to everyday places and objects.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            Hear From Talking Objects
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {/* Treaty Oak Testimonial */}
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-lg relative">
              <div className="absolute -top-10 left-10 h-20 w-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">🌳</span>
                </div>
              </div>
              <div className="mt-8">
                <p className="italic text-gray-700 mb-4 text-lg leading-relaxed">
                  &quot;I&apos;ve stood in this park for over 500 years. Now I can finally share my stories with visitors - from surviving a poisoning attempt in 1989 to watching Austin grow from a small settlement to the city it is today.&quot;
                </p>
                <p className="font-bold text-gray-900">Treaty Oak</p>
                <p className="text-sm text-gray-600">Austin&apos;s oldest resident</p>
              </div>
            </div>
            
            {/* Statue Testimonial */}
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-lg relative">
              <div className="absolute -top-10 left-10 h-20 w-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">🎸</span>
                </div>
              </div>
              <div className="mt-8">
                <p className="italic text-gray-700 mb-4 text-lg leading-relaxed">
                  &quot;People have taken photos with me for years, but now they can hear my music and stories too. I love telling visitors about the Austin blues scene and my favorite guitar licks.&quot;
                </p>
                <p className="font-bold text-gray-900">Stevie Ray Vaughan Statue</p>
                <p className="text-sm text-gray-600">Auditorium Shores, Lady Bird Lake</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Example Conversations */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            Magical Conversations
          </h2>
          
          <div className="max-w-2xl mx-auto bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 shadow-lg">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <h3 className="font-bold flex items-center">
                <span className="mr-2">🦇</span>
                Chat with Congress Avenue Bats
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start">
                <div className="bg-gray-200 rounded-full h-8 w-8 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-gray-600">👤</span>
                </div>
                <div className="bg-gray-100 rounded-2xl p-3 text-gray-800 max-w-xs">
                  What time do you all usually fly out from under the bridge?
                </div>
              </div>
              
              <div className="flex items-start justify-end">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-3 text-white max-w-md">
                  We typically emerge around sunset, which is around 8:15 PM this time of year. The best viewing is usually 15-30 minutes after sunset when we start our nightly hunt. Tonight looks perfect - warm with lots of insects to eat. Over a million of us will take flight in waves! Bring a camera but don&apos;t use flash - it disturbs our navigation.
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full h-8 w-8 flex items-center justify-center ml-3 flex-shrink-0">
                  <span className="text-white">🦇</span>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-gray-200 rounded-full h-8 w-8 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-gray-600">👤</span>
                </div>
                <div className="bg-gray-100 rounded-2xl p-3 text-gray-800 max-w-xs">
                  That&apos;s amazing! How long have bats been living under this bridge?
                </div>
              </div>
              
              <div className="flex items-start justify-end">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-3 text-white max-w-md">
                  We&apos;ve been calling Congress Avenue Bridge home since the early 1980s after it was renovated. The new design created perfect crevices for our colony! We&apos;re Mexican free-tailed bats, and we&apos;re the largest urban bat colony in North America. We consume 10-30,000 pounds of insects nightly - keeping Austin&apos;s mosquito population in check!
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full h-8 w-8 flex items-center justify-center ml-3 flex-shrink-0">
                  <span className="text-white">🦇</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-lg">
              <span className="text-2xl">✨</span>
            </div>
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Ready to Create Your Talking Object?
            </h2>
            <p className="text-xl mb-10 text-gray-600 leading-relaxed">
              Bring landmarks, art, historic sites, and everyday objects to life with personality and stories. 
              Create memorable experiences that educate, entertain, and inspire.
            </p>
            <Link 
              href="/dashboard" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 inline-block"
            >
              Get Started – It&apos;s Free
            </Link>
            <p className="mt-6 text-gray-500">
              No coding required. Create talking objects in minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            Bring Magic to...
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 text-center hover:bg-white/80">
              <div className="h-16 w-16 mx-auto bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <span className="text-3xl">🏛️</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-amber-600">Historic Sites</h3>
              <p className="text-gray-700">Let landmarks tell their own stories and historical significance.</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 text-center hover:bg-white/80">
              <div className="h-16 w-16 mx-auto bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <span className="text-3xl">🏞️</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-green-600">Parks & Nature</h3>
              <p className="text-gray-700">Give voice to trees, landscapes, and natural wonders.</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 text-center hover:bg-white/80">
              <div className="h-16 w-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <span className="text-3xl">🎨</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-purple-600">Public Art</h3>
              <p className="text-gray-700">Let murals, sculptures and street art share their creative stories.</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 text-center hover:bg-white/80">
              <div className="h-16 w-16 mx-auto bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <span className="text-3xl">🏪</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-blue-600">Businesses</h3>
              <p className="text-gray-700">Create interactive mascots and guides for your customers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200/50 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          © 2025 Talking Objects. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
