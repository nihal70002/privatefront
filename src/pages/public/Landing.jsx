import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Landing() {
  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  return (
    <div className="w-full min-h-screen text-gray-800 font-sans overflow-x-hidden">
      
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-blue-50 to-white py-24 lg:py-32 overflow-hidden">
        {/* Animated Background Blob */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -right-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"
        />

        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-6xl font-extrabold text-blue-900 leading-tight"
            >
              Taking Health Care <br /> 
              <span className="text-blue-500">to Another Level</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="mt-6 text-gray-600 text-lg max-w-lg leading-relaxed">
              Dedicated to providing high-quality and innovative healthcare products that promote well-being and enhance quality of life.
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-10 flex gap-4">
              <Link
                to="/login"
                className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all"
              >
                Get Started
              </Link>
              <a
                href="#contact"
                className="bg-white border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-all"
              >
                Contact Us
              </a>
            </motion.div>
          </motion.div>

          {/* Animated Image Composition */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-72 h-96 bg-gray-200 rounded-[2rem] shadow-2xl overflow-hidden border-8 border-white"
            >
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium">
                Main Product
              </div>
            </motion.div>
            
            {/* Secondary Floating Card */}
            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -left-10 w-48 h-48 bg-white rounded-2xl shadow-xl p-4 flex flex-col justify-end border border-blue-50"
            >
              <div className="w-12 h-2 bg-blue-500 rounded-full mb-2" />
              <div className="w-full h-2 bg-gray-100 rounded-full" />
              <p className="text-xs mt-2 font-bold text-blue-900">Premium Ortho Support</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* WHY CHOOSE US - Scroll Reveal */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why Choose Us</h2>
            <div className="w-20 h-1.5 bg-blue-500 mx-auto mt-4 rounded-full" />
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid md:grid-cols-4 gap-8"
          >
            {[
              { title: "Certified Quality", desc: "ISO certified products meeting international standards." },
              { title: "Trusted Partners", desc: "Collaborations with leading global manufacturers." },
              { title: "Wide Product Range", desc: "Medical devices, ortho supports, and rehab solutions." },
              { title: "Reliable Supply", desc: "On-time delivery and dependable service." }
            ].map((item, index) => (
              <motion.div 
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6 text-blue-600 font-bold text-xl">
                  0{index + 1}
                </div>
                <h3 className="font-bold text-lg mb-3 text-blue-900">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ABOUT US - Side reveal */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <motion.div
             initial={{ opacity: 0, x: -50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-blue-900">About Our Mission</h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-6">
              We are a healthcare-focused trading company committed to improving
              lives through innovative medical and rehabilitation products.
            </p>
            <div className="space-y-4">
              {['ISO Certified Products', 'Professional Healthcare Solutions', 'Strong After-Sales Support'].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">✓</div>
                  <span className="text-gray-700 font-medium">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="bg-white rounded-3xl shadow-2xl p-10 relative"
          >
             <div className="absolute top-0 right-0 p-4 text-blue-100 text-8xl font-bold opacity-20 select-none">ISO</div>
             <p className="italic text-blue-800 text-xl font-medium relative z-10">
               "Our mission is to deliver reliable, affordable, and effective
               healthcare solutions to hospitals, clinics, and distributors worldwide."
             </p>
          </motion.div>
        </div>
      </section>

      {/* CONTACT US */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4 text-blue-900">Get In Touch</h2>
            <p className="text-gray-500 mb-12 text-lg">
              Have questions or business inquiries? Reach out to our specialist team.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
               <div className="p-6 bg-blue-50 rounded-2xl">
                  <p className="text-blue-600 font-bold mb-1">Visit Us</p>
                  <p className="text-sm text-gray-700">Jeddah, Saudi Arabia</p>
               </div>
               <div className="p-6 bg-blue-50 rounded-2xl">
                  <p className="text-blue-600 font-bold mb-1">Email Us</p>
                  <p className="text-sm text-gray-700">info@medicoaid.com</p>
               </div>
               <div className="p-6 bg-blue-50 rounded-2xl">
                  <p className="text-blue-600 font-bold mb-1">Call Us</p>
                  <p className="text-sm text-gray-700">+966 12 345 6789</p>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-blue-900 text-blue-100 py-12 text-center">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-blue-800 pb-8 mb-8">
            <div className="text-xl font-bold">Medico Aid</div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Products</a>
              <a href="#" className="hover:text-white transition-colors">About</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
            </div>
          </div>
          <p className="text-sm opacity-60">
            © {new Date().getFullYear()} Safa Al-Tamayyez Trading Co. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}