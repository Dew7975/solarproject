"use client"
import { useLanguage } from "@/context/LanguageContext"
import { Sun, Zap, ShieldCheck, Users, Leaf, Check, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"

export default function AboutPage() {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({})
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }))
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('[id^="section-"]').forEach((el) => observer.observe(el))
    
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])


  const features = [
    t("feature1"),
    t("feature2"),
    t("feature3"),
    t("feature4"),
    t("feature5"),
    t("feature6"),
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/30 via-white to-green-50/30 relative overflow-hidden">
      {/* Animated Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <div 
          className="absolute -top-40 -right-40 w-96 h-96 bg-green-400 rounded-full blur-3xl"
          style={{ transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.15}px)` }}
        />
        <div 
          className="absolute top-1/2 -left-40 w-80 h-80 bg-emerald-400 rounded-full blur-3xl"
          style={{ transform: `translate(${-scrollY * 0.08}px, ${scrollY * 0.1}px)` }}
        />
        <div 
          className="absolute bottom-20 right-20 w-64 h-64 bg-green-300 rounded-full blur-3xl"
          style={{ transform: `translateY(${-scrollY * 0.12}px)` }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <section 
          id="section-hero"
          className={`text-center space-y-6 mb-16 transition-all duration-1000 ${
            isVisible['section-hero'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-sm font-semibold shadow-sm animate-pulse">
            <Leaf className="w-4 h-4 animate-bounce" />
            {t("aboutBadge")}
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent leading-tight">
            {t("aboutTitle")}
          </h1>
          
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            {t("aboutIntro")}
          </p>

          {/* Hero Image */}
          <div className="mt-10 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1400&h=600&fit=crop&q=80"
                alt="Solar panels installation"
                className="w-full h-[300px] md:h-[450px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 via-green-900/20 to-transparent" />
            </div>
          </div>
        </section>

        {/* What is the system */}
        <section 
          id="section-what"
          className={`mb-20 transition-all duration-1000 delay-100 ${
            isVisible['section-what'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="relative bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-green-100 overflow-hidden">
            {/* Decorative corner elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-200/40 to-transparent rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-emerald-200/40 to-transparent rounded-tr-full" />
            
            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {t("aboutWhatTitle")}
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {t("aboutWhatDesc")}
                </p>
              </div>
              
              <div className="order-1 md:order-2 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                <img
                  src="https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=600&h=400&fit=crop&q=80"
                  alt="Solar system technology"
                  className="relative w-full h-64 md:h-80 object-cover rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Users */}
        <section 
          id="section-users"
          className={`mb-20 transition-all duration-1000 delay-200 ${
            isVisible['section-users'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {t("aboutUsersTitle")}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <UserCard
              icon={<Users className="w-10 h-10 text-green-600" />}
              title={t("aboutCustomersTitle")}
              text={t("aboutCustomersDesc")}
              image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&h=350&fit=crop&q=80"
              delay="0"
            />
            <UserCard
              icon={<Zap className="w-10 h-10 text-green-600" />}
              title={t("aboutInstallersTitle")}
              text={t("aboutInstallersDesc")}
              image="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=500&h=350&fit=crop&q=80"
              delay="100"
            />
            <UserCard
              icon={<ShieldCheck className="w-10 h-10 text-green-600" />}
              title={t("aboutOfficersTitle")}
              text={t("aboutOfficersDesc")}
              image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=350&fit=crop&q=80"
              delay="200"
            />
          </div>
        </section>

        {/* Features */}
        <section 
          id="section-features"
          className={`mb-20 transition-all duration-1000 delay-300 ${
            isVisible['section-features'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {t("aboutFeaturesTitle")}
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group flex items-start gap-3 p-5 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-green-500 hover:border-green-600"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex-shrink-0 mt-1 p-2 bg-green-100 rounded-lg group-hover:bg-green-500 transition-all duration-300">
                  <Check className="w-5 h-5 text-green-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <p className="text-gray-700 leading-relaxed">{feature}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sustainability */}
        <section 
          id="section-sustainability"
          className={`mb-20 transition-all duration-1000 delay-400 ${
            isVisible['section-sustainability'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 rounded-3xl overflow-hidden shadow-2xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '40px 40px'
              }} />
            </div>
            
            <div className="relative grid md:grid-cols-2 gap-0">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-6 w-fit">
                  <Leaf className="w-4 h-4" />
                  {t("sustainability")}
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  {t("aboutSustainTitle")}
                </h2>
                
                <p className="text-green-50 text-lg leading-relaxed mb-8">
                  {t("aboutSustainDesc")}
                </p>
                
                <button className="group inline-flex items-center gap-2 px-6 py-3 bg-white text-green-600 rounded-full font-semibold hover:bg-green-50 transition-all duration-300 w-fit shadow-lg hover:shadow-xl">
                  {t("learnMoreSec")}
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
                </button>
              </div>
              
              <div className="relative h-full min-h-[350px] md:min-h-[450px]">
                <img
                  src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=700&h=500&fit=crop&q=80"
                  alt="Sustainable environment"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/40 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <section 
          id="section-footer"
          className={`text-center transition-all duration-1000 delay-500 ${
            isVisible['section-footer'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-10 md:p-12 border-2 border-green-200 shadow-lg overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-300/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-300/20 rounded-full blur-3xl" />
            
            <div className="relative">
              <Sun className="w-12 h-12 text-green-600 mx-auto mb-4 animate-pulse" />
              <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                {t("aboutFooterNote")}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function UserCard({
  icon,
  title,
  text,
  image,
  delay,
}: {
  icon: React.ReactNode
  title: string
  text: string
  image: string
  delay: string
}) {
  return (
    <div 
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-green-100"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-green-900/70 via-green-900/20 to-transparent" />
        
        {/* Icon Badge */}
        <div className="absolute bottom-4 left-4 p-3 bg-white rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  )
}