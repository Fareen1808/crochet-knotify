import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../store/slices/productSlice'
import ProductCard from '../components/ProductCard'
import FloatingElements from '../components/FloatingElements'
import { ProductGridSkeleton } from '../components/LoadingSkeleton'
import { HiOutlineSparkles, HiOutlineHeart, HiOutlineTruck, HiOutlineStar } from 'react-icons/hi'

export default function Home() {
  const dispatch = useDispatch()
  const { products, isLoading } = useSelector((state) => state.products)

  useEffect(() => {
    dispatch(fetchProducts({ size: 8 }))
  }, [dispatch])

  const features = [
    {
      icon: <HiOutlineSparkles className="w-6 h-6" />,
      title: 'Handcrafted with Love',
      description: 'Every piece is carefully crocheted by skilled artisans with premium yarn.',
      color: 'from-hotpink-300 to-hotpink-400',
      iconBg: 'bg-white text-hotpink-500',
    },
    {
      icon: <HiOutlineHeart className="w-6 h-6" />,
      title: 'Unique Designs',
      description: 'One-of-a-kind patterns you won\'t find anywhere else. Made just for you.',
      color: 'from-lavender-300 to-lavender-400',
      iconBg: 'bg-white text-lavender-500',
    },
    {
      icon: <HiOutlineTruck className="w-6 h-6" />,
      title: 'Delivered with Care',
      description: 'Beautifully packaged and shipped safely to your doorstep.',
      color: 'from-sage-300 to-sage-400',
      iconBg: 'bg-white text-sage-600',
    },
  ]

  const testimonials = [
    {
      name: 'Priya S.',
      text: 'The amigurumi bunny I ordered is absolutely adorable! The quality is amazing.',
      rating: 5,
    },
    {
      name: 'Ananya R.',
      text: 'I love my crochet tote bag. It\'s sturdy, beautiful, and gets so many compliments!',
      rating: 5,
    },
    {
      name: 'Meera K.',
      text: 'The baby blanket was the perfect gift. So soft and the colors are gorgeous.',
      rating: 5,
    },
  ]

  return (
    <div className="overflow-hidden">
      {/* Hero Section - Bright Pink Gingham */}
      <section className="relative min-h-[90vh] flex items-center gingham-pattern">
        <FloatingElements />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-5 py-2 rounded-full border border-hotpink-300 mb-6 animate-fade-in">
              <span className="text-lg">🧶</span>
              <span className="text-sm text-hotpink-700 font-bold uppercase tracking-wide">Handmade Crochet Boutique</span>
            </div>
            
            {/* Single translucent background around entire heading */}
            <div className="bg-white/55 backdrop-blur-sm rounded-3xl px-6 py-8 md:px-10 md:py-10 mb-8 animate-slide-up inline-block">
              <h1 className="font-serif text-4xl md:text-7xl leading-tight text-gray-800">
                Cozy Creations,<br />
                <span className="text-gradient">Knotified</span> With Love
              </h1>
              
              <p className="text-lg text-gray-700 max-w-xl mx-auto mt-6" style={{ animationDelay: '0.1s' }}>
                Discover unique handcrafted crochet pieces that bring warmth and charm to your everyday life. Each stitch is a little hug. 💕
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/products" className="btn-primary text-base px-8 py-4 text-lg">
                Shop Collection ✨
              </Link>
              <Link to="/products?category=Amigurumi" className="btn-outline text-base px-8 py-4 bg-white/50 backdrop-blur-sm">
                Explore Amigurumi 🐰
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 52.5C480 45 600 60 720 67.5C840 75 960 75 1080 67.5C1200 60 1320 45 1380 37.5L1440 30V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#fff0f6"/>
          </svg>
        </div>
      </section>

      {/* Features Section - Flower Shapes */}
      <section className="py-20 bg-gradient-to-b from-hotpink-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center group">
                {/* Flower shape */}
                <div className="relative w-44 h-44 mb-6">
                  {/* Petals */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-full opacity-80 group-hover:scale-110 transition-transform duration-500`}></div>
                  <div className={`absolute inset-2 top-[-16px] bg-gradient-to-br ${feature.color} rounded-full opacity-60`}></div>
                  <div className={`absolute inset-2 bottom-[-16px] bg-gradient-to-br ${feature.color} rounded-full opacity-60`}></div>
                  <div className={`absolute inset-2 left-[-16px] bg-gradient-to-br ${feature.color} rounded-full opacity-60`}></div>
                  <div className={`absolute inset-2 right-[-16px] bg-gradient-to-br ${feature.color} rounded-full opacity-60`}></div>
                  {/* Center circle with icon */}
                  <div className={`absolute inset-0 m-auto w-16 h-16 ${feature.iconBg} rounded-full flex items-center justify-center shadow-lg z-10`}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="font-serif text-xl text-gray-800 mb-2 font-bold">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed max-w-xs">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 relative overflow-hidden">
        {/* Vibrant background */}
        <div className="absolute inset-0 bg-gradient-to-br from-lavender-100 via-pink-100 to-hotpink-100"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-hotpink-200 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-lavender-200 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/2 w-64 h-64 bg-peach-200 rounded-full opacity-20 blur-3xl"></div>
        
        {/* Flower accents */}
        <div className="absolute top-8 left-[6%] text-xl text-hotpink-300 opacity-70 pointer-events-none">✿</div>
        <div className="absolute top-14 right-[10%] text-2xl text-lavender-300 opacity-60 pointer-events-none">❀</div>
        <div className="absolute bottom-10 left-[12%] text-lg text-sage-300 opacity-50 pointer-events-none">✻</div>
        <div className="absolute bottom-16 right-[8%] text-xl text-hotpink-300 opacity-60 pointer-events-none">✿</div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-1.5 rounded-full border border-hotpink-200 mb-4">
              <span className="text-sm">✨</span>
              <span className="text-xs font-bold text-hotpink-600 uppercase tracking-wider">Handpicked for you</span>
            </div>
            <h2 className="section-title">Our Cozy Collection 🧶</h2>
            <p className="section-subtitle">Each piece is handmade with premium yarn and lots of love</p>
          </div>

          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/products" className="inline-block bg-white text-hotpink-600 font-bold text-sm uppercase tracking-wider px-8 py-3.5 rounded-full hover:bg-hotpink-500 hover:text-white transition-all shadow-lg border-2 border-hotpink-200 hover:border-hotpink-500">
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* Promotional Bento Grid */}
      <section className="py-20 bg-gradient-to-b from-cream-100 to-hotpink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Large card */}
            <div className="lg:col-span-2 bg-gradient-to-br from-hotpink-200 via-hotpink-300 to-rose-300 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl">
              <div className="relative z-10">
                <span className="badge bg-white/90 text-hotpink-600 mb-4 text-sm">🌟 New Arrivals</span>
                <h3 className="font-serif text-3xl md:text-4xl text-white mb-3">
                  Spring Collection is Here
                </h3>
                <p className="text-white/90 mb-6 max-w-md text-lg">
                  Fresh pastel colors and lightweight designs perfect for the season.
                </p>
                <Link to="/products" className="inline-block bg-white text-hotpink-600 font-bold py-3 px-6 rounded-2xl hover:bg-cream-50 transition-all shadow-lg">
                  Shop Now ✨
                </Link>
              </div>
              <div className="absolute -bottom-4 -right-4 text-9xl opacity-40">🌸</div>
              <div className="absolute top-4 right-8 text-5xl opacity-50">💐</div>
            </div>

            {/* Small cards */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-lavender-200 to-lavender-300 rounded-3xl p-6 relative overflow-hidden shadow-lg hover:-translate-y-1 transition-all">
                <span className="badge bg-white/90 text-lavender-700 mb-3">🔥 Popular</span>
                <h4 className="font-serif text-xl text-gray-800 mb-2">Amigurumi Friends</h4>
                <p className="text-gray-700">Cute stuffed animals for all ages</p>
                <div className="absolute -bottom-2 -right-2 text-6xl opacity-50">🐰</div>
              </div>
              <div className="bg-gradient-to-br from-sage-200 to-sage-300 rounded-3xl p-6 relative overflow-hidden shadow-lg hover:-translate-y-1 transition-all">
                <span className="badge bg-white/90 text-sage-700 mb-3">🏡 Cozy</span>
                <h4 className="font-serif text-xl text-gray-800 mb-2">Home Decor</h4>
                <p className="text-gray-700">Blankets, pillows & more</p>
                <div className="absolute -bottom-2 -right-2 text-6xl opacity-50">🛋️</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Green wavy checkerboard with pink flowers */}
      <section className="py-20 wavy-checker-pattern relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="section-title text-white drop-shadow-lg">What Our Customers Say 💬</h2>
            <p className="text-white/90 text-lg mb-8 drop-shadow">Real love from real people 💕</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-2 border-sage-200 hover:border-hotpink-400 transition-all hover:-translate-y-1">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <HiOutlineStar key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">"{testimonial.text}"</p>
                <p className="font-bold text-hotpink-600 text-sm">— {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pink flower decorations scattered on top */}
        <div className="absolute top-8 left-[10%] text-5xl opacity-90 pointer-events-none animate-float">🌸</div>
        <div className="absolute top-16 right-[15%] text-4xl opacity-85 pointer-events-none animate-float-slow">🌸</div>
        <div className="absolute bottom-12 left-[20%] text-5xl opacity-90 pointer-events-none animate-float-delayed">🌸</div>
        <div className="absolute bottom-20 right-[25%] text-4xl opacity-85 pointer-events-none animate-float">🌸</div>
        <div className="absolute top-1/2 left-[5%] text-3xl opacity-80 pointer-events-none animate-float-slow">🌸</div>
        <div className="absolute top-1/3 right-[8%] text-5xl opacity-90 pointer-events-none animate-float-delayed">🌸</div>
        <div className="absolute bottom-1/3 left-[45%] text-3xl opacity-75 pointer-events-none animate-float">🌸</div>
        <div className="absolute top-12 left-[55%] text-4xl opacity-85 pointer-events-none animate-float-slow">🌸</div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-br from-hotpink-100 via-pink-100 to-lavender-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-5xl mb-4 block">💌</span>
          <h2 className="section-title">Join the Knotify Club</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Be the first to know about new drops, exclusive patterns, and special offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="input-field flex-1"
            />
            <button className="btn-primary whitespace-nowrap text-lg">
              Subscribe ✨
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-3">No spam, just cozy vibes. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  )
}
