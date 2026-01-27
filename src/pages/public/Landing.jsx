import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  LogIn, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight,
  Globe,
  Award
} from "lucide-react";

export default function Landing() {
  // Animation Settings
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
    },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  const partners = ['dynamic', 'fitconn', 'wanji', 'xiang'];
  const clients = ['2013158', 'agh', 'bugshan', 'erfan', 'medical', 'saudi', 'special', 'sulaiman'];

  return (
    <div className="w-full min-h-screen text-gray-800 font-sans overflow-x-hidden bg-white">
      <style dangerouslySetInnerHTML={{ __html: `html { scroll-behavior: smooth; }` }} />
      
      {/* 1. NAVIGATION */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <img src="/logo/logo.png" alt="Safa Logo" className="w-10 h-10 object-contain" />
            <span className="font-black text-slate-900 tracking-tight text-xl uppercase">Safa Al-Tamayyez</span>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            <a href="#aboutus" className="text-sm font-bold text-slate-500 hover:text-cyan-600 transition-colors uppercase tracking-widest">About Us</a>
            <a href="#products" className="text-sm font-bold text-slate-500 hover:text-cyan-600 transition-colors uppercase tracking-widest">Products</a>
            <a href="#contactus" className="text-sm font-bold text-slate-500 hover:text-cyan-600 transition-colors uppercase tracking-widest">Contact Us</a>
          </div>

          <Link to="/login" className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-cyan-600 transition-all duration-300">
            <LogIn size={18} />
            <span className="text-sm">Login</span>
          </Link>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative bg-[#f0f9ff] py-20 lg:py-32 lg:pt-48 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-cyan-500/10 skew-x-12 transform translate-x-20 hidden lg:block" />
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.span variants={fadeInUp} className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-bold tracking-wide uppercase">Trusted Medical Supplier in KSA</motion.span>
            <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] mt-6">Advancing <span className="text-cyan-600">Healthcare</span> Excellence.</motion.h1>
            <motion.p variants={fadeInUp} className="mt-6 text-slate-600 text-xl max-w-lg leading-relaxed">Safa Al-Tamayyez Trading Co. delivers premium orthopedic supports and medical disposables to the kingdom's leading hospitals.</motion.p>
            <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap gap-4">
              <a href="#products" className="bg-cyan-600 hover:bg-cyan-700 text-white px-10 py-4 rounded-full font-bold shadow-xl transition-all hover:-translate-y-1">Explore Products</a>
              <a href="#certifications" className="bg-white border-2 border-slate-200 hover:border-cyan-600 text-slate-700 px-10 py-4 rounded-full font-bold transition-all">Our Certificates</a>
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative">
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white">
              <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800" alt="Doctor" className="w-full h-[500px] object-cover" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. ABOUT US SECTION */}
      <section id="aboutus" className="py-32 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
            <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800" alt="Hospital" className="rounded-[3rem] shadow-2xl" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-black text-slate-900 uppercase italic mb-6">Leading the Kingdom's <br/><span className="text-cyan-600">Medical Logistics</span></h2>
            <p className="text-slate-500 text-lg mb-8 leading-relaxed">Providing high-end surgical and orthopedic solutions across Saudi Arabia. Every product meets rigorous SFDA standards for patient safety.</p>
            <div className="grid grid-cols-2 gap-4">
              {['Full Compliance', 'Expert Support', 'Vision 2030', 'Rapid Delivery'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold text-slate-700 text-sm">
                  <CheckCircle2 className="text-cyan-600" size={18} /> {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. CERTIFICATIONS & TRUST SECTION (STATIONARY) */}
      <section id="certifications" className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            
            {/* Certifications */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
              <h3 className="text-xl font-black text-slate-900 uppercase italic flex items-center gap-2">
                <ShieldCheck className="text-cyan-600" /> Certifications
              </h3>
              <div className="space-y-3">
                {['SFDA Medical Device License', 'ISO 9001:2015 Certified', 'GHC Approved Supplier'].map((cert, i) => (
                  <motion.div key={i} variants={fadeInUp} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                    <Award className="text-amber-500" />
                    <span className="font-bold text-slate-700 text-sm">{cert}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Manufacturing Partners */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
              <h3 className="text-xl font-black text-slate-900 uppercase italic flex items-center gap-2">
                <Globe className="text-cyan-600" /> Global Partners
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {partners.map((p, i) => (
                  <motion.div key={i} variants={fadeInUp} className="bg-white h-24 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center p-4">
                    <img src={`/partners/${p}.png`} alt={p} className="max-h-full object-contain grayscale hover:grayscale-0 transition-all" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Hospital Networks */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
              <h3 className="text-xl font-black text-slate-900 uppercase italic flex items-center gap-2">
                <Building2 className="text-cyan-600" /> Key Clients
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {clients.map((c, i) => (
                  <motion.div key={i} variants={fadeInUp} className="bg-white h-16 rounded-xl shadow-sm border border-slate-200 flex items-center justify-center p-2">
                    <img src={`/clients/${c}.png`} alt={c} className="max-h-full object-contain" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 5. PRODUCTS SECTION */}
      <section id="products" className="py-32 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 uppercase italic">Product Categories</h2>
            <div className="w-24 h-1.5 bg-cyan-600 mx-auto mt-4 rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
                { title: "Orthopedic Braces", img: "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?auto=format&fit=crop&q=80&w=400" },
                { title: "Physiotherapy", img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400" },
                { title: "Surgical Range", img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400" }
            ].map((item, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-slate-100 group">
                <div className="h-60 rounded-[2rem] overflow-hidden mb-6">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2 uppercase italic tracking-tight">{item.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CONTACT SECTION */}
      <section id="contactus" className="py-32 bg-slate-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20">
          <div>
            <h2 className="text-4xl font-black text-slate-900 mb-10 uppercase italic">Contact Us</h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-cyan-600 shadow-sm"><MapPin /></div>
                <div>
                    <h4 className="font-black text-slate-900 text-xs uppercase mb-1">Jeddah HQ</h4>
                    <p className="text-slate-500 font-medium text-sm">Tauba Street, Al Askan Building,<br/> Sharafia District, Jeddah, KSA.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-cyan-600 shadow-sm"><Mail /></div>
                <div>
                    <h4 className="font-black text-slate-900 text-xs uppercase mb-1">Email Support</h4>
                    <p className="text-slate-500 font-medium text-sm">info@medicoaidksa.com</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100">
            <form className="space-y-4">
              <input type="text" placeholder="Full Name" className="w-full p-4 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-cyan-500 transition-all border-none" />
              <textarea rows="4" placeholder="Your Inquiry" className="w-full p-4 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-cyan-500 transition-all resize-none border-none" />
              <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-cyan-600 transition-all duration-500 shadow-xl">Submit</button>
            </form>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-[#0f172a] text-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-white/5 pb-20">
          <div className="space-y-6">
            {/* White Badge for Black Logo visibility */}
            <div className="bg-white p-3 rounded-2xl inline-block shadow-xl">
                <img src="/logo/logo.png" alt="Safa" className="h-10 object-contain" />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">Advancing healthcare excellence through precision supply chain and global innovation.</p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase mb-8 text-cyan-500 tracking-widest">Navigation</h4>
            <ul className="space-y-4 text-slate-400 text-xs font-bold uppercase">
              <li><a href="#aboutus" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">Products</a></li>
              <li><a href="#contactus" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase mb-8 text-cyan-500 tracking-widest">Categories</h4>
            <ul className="space-y-4 text-slate-400 text-xs font-bold uppercase">
              <li>Orthopedic</li>
              <li>Surgical</li>
              <li>Rehabilitation</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase mb-8 text-cyan-500 tracking-widest">Contact</h4>
            <p className="text-slate-400 text-xs leading-relaxed">Jeddah, Saudi Arabia<br/>P.O. Box : 6368<br/>+966 12 6513490</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 text-center">
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.5em]">© 2026 SAFA AL-TAMAYYEZ TRADING CO. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
}