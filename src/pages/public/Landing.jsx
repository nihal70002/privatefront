import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import { useEffect, useState } from "react";
import { getProducts } from "../../api/products.api";
import { motion } from "framer-motion";









export default function Landing() {
  const navigate = useNavigate();

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
const [suggestions, setSuggestions] = useState([]);
const [showDropdown, setShowDropdown] = useState(false);
const [loadingSearch, setLoadingSearch] = useState(false);


useEffect(() => {
  async function fetchProducts() {
    try {
      const res = await getProducts();

      // Backend returns { items: [...] }
      const products = res.data?.items || [];

      setFeaturedProducts(products.slice(0, 4));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  fetchProducts();
}, []);



useEffect(() => {
  if (!searchQuery.trim()) {
    setSuggestions([]);
    return;
  }

  const delayDebounce = setTimeout(async () => {
    try {
      setLoadingSearch(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/products/search-suggestions?query=${encodeURIComponent(searchQuery)}`
      );

      const data = await res.json();
      setSuggestions(data.slice(0, 6));
    } catch (err) {
      console.error("Search suggestion error:", err);
      setSuggestions([]);
    } finally {
      setLoadingSearch(false);
    }
  }, 300);

  return () => clearTimeout(delayDebounce);
}, [searchQuery]);




  
  const newArrivals = [
    {
      id: 1,
      name: "NewMom Maternity Pad",
      desc: "Designed for maximum absorbency and gentle care, Newmom Maternity Pads offer superior protection and comfort during the postpartum period. Perfect for new mothers.",
      img: "/products/maternity-pad.jpg", // Replace with your actual path
      link: "/products/maternity-pad"
    },
    {
      id: 2,
      name: "Dyna Hinged Knee Brace",
      desc: "A premium wrap-around knee brace featuring dual metal hinges for superior medial-lateral stability with soft neoprene construction that delivers comfortable compression.",
      img: "/products/kneebrace.jpg", // Replace with your actual path
      link: "/products/knee-brace"
    }
  ];



  const clientLogos = [
  { id: 1, img: "/clients/2013158.png", name: "Abeer Medical Group" },
  { id: 2, img: "/clients/agh.png", name: "AGH" },
  { id: 3, img: "/clients/bugshan.png", name: "Bugshan Hospital" },
  { id: 4, img: "/clients/erfan.png", name: "Dr. Erfan & Bagedo" },
  { id: 5, img: "/clients/medical.png", name: "International Medical Center" },
  { id: 6, img: "/clients/saudi.png", name: "Saudi German Health" },
  { id: 7, img: "/clients/special.png", name: "Specialized Medical Center" },
  { id: 8, img: "/clients/sulaiman.png", name: "Dr. Sulaiman Al Habib" },
];

 const categories = [
  { id: 1, name: "Supports & Braces", img: "/categories/supports.jpg" },
  { id: 3, name: "Lumbo Sacral and Abdominal Supports", img: "/categories/lumbo.jpg" },
  { id: 4, name: "Cervical (Neck) Care", img: "/categories/cervical.jpg" },
  
  { id: 6, name: "Traction Kits", img: "/categories/traction.jpg" },
  { id: 7, name: "Compression Therapy", img: "/categories/compression.jpg" },
  { id: 8, name: "Exercise Essentials", img: "/categories/exercise.jpg" },
  { id: 9, name: "Wound Care/Bandages", img: "/categories/wound.jpg" },
  { id: 10, name: "Casting Aids", img: "/categories/casting.jpg" },
  { id: 11, name: "Foot Care", img: "/categories/foot.jpg" },
];




  return (
    <div className="w-full min-h-screen bg-white text-gray-800 overflow-x-hidden">

      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo/logo.png" className="h-9" alt="logo" />
           
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl w-full flex mx-2">
            <div className="w-full relative">
  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />

  <input
    type="text"
    placeholder="Search products..."
    value={searchQuery}
    onFocus={() => setShowDropdown(true)}
    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
    onChange={(e) => setSearchQuery(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        navigate(`/products?search=${searchQuery}`);
        setShowDropdown(false);
      }
    }}
    className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
  />

  {/* DROPDOWN */}
{showDropdown && searchQuery.trim().length > 0 && (
  <div className="absolute top-full mt-3 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 p-4">

    {loadingSearch && (
      <div className="text-sm text-gray-500 px-2 py-2">
        Searching...
      </div>
    )}

    {!loadingSearch && suggestions.length === 0 && (
      <div className="text-sm text-gray-500 px-2 py-2">
        No results found
      </div>
    )}

    {!loadingSearch && suggestions.length > 0 && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">

        {suggestions.slice(0, 6).map((item) => (
          <div
            key={item.productId}
            onClick={() => {
              navigate(`/products/${item.productId}`);
              setSearchQuery("");
              setShowDropdown(false);
            }}
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
          >
            <img
              src={item.primaryImageUrl || "/placeholder.jpg"}
              alt={item.name}
              className="w-10 h-10 md:w-12 md:h-12 rounded-md object-cover border border-gray-100"
            />

            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-gray-800 truncate max-w-[200PX]">
                {item.name}
              </span>

              <span className="text-xs text-gray-500">
                {item.brandName}
              </span>

              <span className="text-sm font-semibold text-cyan-600">
                ₹{item.startingPrice}
              </span>
            </div>
          </div>
        ))}

      </div>
    )}

    {!loadingSearch && suggestions.length > 6 && (
      <div
        onClick={() => {
          navigate(`/products?search=${searchQuery}`);
          setShowDropdown(false);
        }}
        className="text-center mt-4 pt-3 border-t text-sm font-semibold text-cyan-600 hover:text-cyan-700 cursor-pointer"
      >
        View all results →
      </div>
    )}

  </div>
)}


</div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-5">
            <Link to="/login"><User size={22} /></Link>
            <Link to="/cart"><ShoppingCart size={22} /></Link>
          </div>
        </div>
      </nav>

      {/* ================= HERO SLIDER ================= */}
   {/* ================= HERO SLIDER ================= */}
<section className="w-full ">
  <Swiper
    modules={[Autoplay]}
    autoplay={{
      delay: 4000,
      disableOnInteraction: false,
    }}
    loop
    speed={900}
  >

    {/* VARICOSE */}
    

    {/* ELBOW */}
    <SwiperSlide>
      <div
        onClick={() => navigate("/products/602")}
        className="cursor-pointer w-full 

lg:aspect-[1660/490]"
      >
        <img
          src="/posters/elbow.jpg"
          alt="Elbow Binder"
          className="w-full h-auto object-cover"
         

        />
      </div>
    </SwiperSlide>

    {/* KNEE */}
    <SwiperSlide>
      <div
        onClick={() => navigate("/products/512")}
        className="cursor-pointer w-full aspect-[1660/490]"
      >
        <img
          src="/posters/knee.jpg"
          alt="Hinged Knee Brace"
          className="w-full h-auto object-cover"
          

        />
      </div>
    </SwiperSlide>

  </Swiper>
</section>





      {/* ================= CATEGORIES ================= */}
    {/* ================= CATEGORIES ================= */}
   <section className="relative py-8 sm:py-10 md:py-16 lg:py-20 bg-slate-50 overflow-hidden">

  <div className="max-w-7xl mx-auto px-6">

    {/* Title */}
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center mb-8 md:mb-12 lg:mb-16"
    >
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-slate-900">
        Shop By <span className="text-cyan-600 font-normal border-b-4 border-cyan-100">Category</span>
      </h2>

      <p className="mt-2 md:mt-4 text-slate-500 italic max-w-md mx-auto text-xs sm:text-sm md:text-base">
  Explore our curated product collections
</p>
    </motion.div>

    {/* Category Grid */}
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-3 sm:gap-3 md:gap-6 lg:gap-8">

      {categories.map((cat, index) => (
        <motion.div
          key={cat.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
  duration: 0.8,
  delay: index * 0.1,
  ease: [0.22, 1, 0.36, 1]
}}
        >
          <Link
            to={`/products?categoryId=${cat.id}`}
            className="group relative block overflow-hidden rounded-2xl shadow-md bg-white"
          >

            {/* Image */}
            <div className="aspect-[3/2] sm:aspect-[4/3]">
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
              />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition"></div>

            {/* Text */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h3 className="text-xs sm:text-sm md:text-base font-semibold leading-tight">
                {cat.name}
              </h3>

              <span className="text-xs text-white/80 opacity-0 group-hover:opacity-100 transition">
                Explore →
              </span>
            </div>

          </Link>
        </motion.div>
      ))}

    </div>

  </div>
</section>

      {/* ================= FEATURED PRODUCTS ================= */}
      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="bg-gray-50 py-12 sm:py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex justify-between items-center mb-10"
          >
           <h2 className="text-3xl md:text-4xl font-serif text-slate-900 text-center">
  Featured <span className="text-cyan-600 border-b-4 border-cyan-100 font-normal">Products</span>
</h2>
            <Link
              to="/products"
              className="text-cyan-600 font-semibold hover:underline"
            >
              View All →
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Loading State */}
            {loading && (
              <p className="col-span-full text-center text-gray-500">
                Loading products...
              </p>
            )}

            {/* Empty State */}
            {!loading && featuredProducts.length === 0 && (
              <p className="col-span-full text-center text-gray-500">
                No featured products available.
              </p>
            )}

            {/* Products with Alternating Slide Animation */}
            {!loading &&
              featuredProducts.map((product, index) => {
                const price =
                  product.variants?.find((v) => v.availableStock > 0)?.price ||
                  product.variants?.[0]?.price ||
                  0;

                // Animation logic: Index 0,1 slide from Left (-100), Index 2,3 slide from Right (100)
                const direction = index < 2 ? -100 : 100;

                return (
                  <motion.div
                    key={product.productId}
                    initial={{ opacity: 0, x: direction }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 1.2, 
                      delay: index * 0.1, // Slight stagger so they don't hit at the exact same time
                      ease: [0.22, 1, 0.36, 1] // Smooth "S-curve" easing
                    }}
                  >
                    <Link
                      to={`/products/${product.productId}`}
                      className="group block bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                      <div className="bg-gray-50">
                        <img
                          src={product.primaryImageUrl || "/placeholder.jpg"}
                          alt={product.name}
                          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      <div className="p-4">
                        <p className="font-semibold text-sm line-clamp-2">
                          {product.name}
                        </p>
                        <p className="text-cyan-600 font-bold mt-2">
                          ₹{price}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </section>


      {/* ================= NEW PRODUCTS ================= */}
<section className="py-20 bg-white">
  <div className="w-full px-6 lg:px-12">

    {/* Header */}
    <div className="flex justify-between items-center mb-16">
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-slate-900">
  New <span className="text-cyan-600 font-normal border-b-4 border-cyan-100">Arrivals</span>
</h2>
      <Link
        to="/products?sort=new"
        className="text-cyan-600 font-semibold hover:text-cyan-700 transition-colors flex items-center gap-1"
      >
        View All <span className="text-xl">→</span>
      </Link>
    </div>

    {/* 2 Column Layout */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">

      {newArrivals.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.2, duration: 0.6 }}
          className="group cursor-pointer"
        >
          <Link to={product.link}>

            {/* Bigger Image Container */}
            <div className="relative overflow-hidden rounded-xl bg-gray-50 h-[420px]">
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Text */}
            <div className="space-y-4 mt-6">
              <h3 className="text-2xl font-bold text-blue-900 group-hover:text-cyan-600 transition-colors">
                {product.name}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {product.desc}
                <span className="text-cyan-600 font-medium ml-1 hover:underline">
                  Read More
                </span>
              </p>
            </div>

          </Link>
        </motion.div>
      ))}
      {/* ================= OUR CLIENTS ================= */}

    </div>

<section className="py-24 bg-white overflow-hidden">
  <div className="max-w-7xl mx-auto px-6">
    <div className="flex justify-center">
      
      {/* LEFT SIDE: IMAGE WITH DECORATIVE BORDER */}
    

      {/* RIGHT SIDE: CONTENT */}
      <motion.div 
  initial={{ opacity: 0, x: 50 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8, delay: 0.2 }}
  className="w-full max-w-5xl mx-auto space-y-10 text-center"
>

  <div className="space-y-4">
    <span className="text-cyan-600 font-bold tracking-widest text-sm uppercase">
      Since 1984
    </span>

    <h2 className="text-4xl md:text-5xl font-serif italic text-slate-900">
      About <span className="text-cyan-600 font-normal border-b-4 border-cyan-100">Medico Aid</span>
    </h2>

    <p className="text-lg text-slate-600 leading-relaxed pt-4">
      Safa Al-Tamayyuz Trading Co. (Medico Aid) stands at the forefront of healthcare distribution in Saudi Arabia. 
      We specialize in providing high-grade orthopedic, surgical, and rehabilitation supplies that empower patients 
      and support medical professionals.
    </p>

    <p className="text-lg text-slate-600 leading-relaxed">
      With a strong commitment to innovation and reliability, Medico Aid partners with hospitals, clinics, and 
      healthcare providers to deliver trusted medical solutions. Our goal is to ensure consistent access to 
      quality healthcare products that improve patient recovery and support modern medical practice.
    </p>
  </div>

  {/* Feature Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 text-left">
    
    <div className="flex items-start gap-4">
      <div className="p-3 bg-cyan-50 rounded-2xl text-cyan-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <div>
        <h4 className="font-bold text-slate-800">KSA Wide Delivery</h4>
        <p className="text-sm text-slate-500">
          Fast and reliable logistics across the Kingdom ensuring quick product availability.
        </p>
      </div>
    </div>

    <div className="flex items-start gap-4">
      <div className="p-3 bg-cyan-50 rounded-2xl text-cyan-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>

      <div>
        <h4 className="font-bold text-slate-800">Premium Quality</h4>
        <p className="text-sm text-slate-500">
          Sourced from globally recognized medical brands to ensure superior reliability.
        </p>
      </div>
    </div>

  </div>

  {/* Stats */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8">

    <div>
      <h3 className="text-3xl font-bold text-cyan-600">500+</h3>
      <p className="text-sm text-slate-500 mt-1">Medical Products</p>
    </div>

    <div>
      <h3 className="text-3xl font-bold text-cyan-600">120+</h3>
      <p className="text-sm text-slate-500 mt-1">Hospital Clients</p>
    </div>

    <div>
      <h3 className="text-3xl font-bold text-cyan-600">10+</h3>
      <p className="text-sm text-slate-500 mt-1">Global Brands</p>
    </div>

    <div>
      <h3 className="text-3xl font-bold text-cyan-600">99%</h3>
      <p className="text-sm text-slate-500 mt-1">Customer Satisfaction</p>
    </div>

  </div>

  {/* CTA */}
  
  

</motion.div>

    </div>
  </div>
</section>




    {/* ================= OUR CLIENTS ================= */}
<section className="py-16 bg-white w-full">
  <div className="max-w-7xl mx-auto px-6">
    
    {/* Section Header */}
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="text-center mb-16"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
        Our <span className="text-cyan-600">Clients</span>
      </h2>
      {/* The cyan underline from your image */}
      <div className="w-20 h-1.5 bg-cyan-400 mx-auto mt-2"></div>
    </motion.div>

    {/* Two-Row Grid Layout */}
    {/* grid-cols-2 on mobile, grid-cols-4 on desktop (8 logos total = 2 perfect rows) */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-8 items-center justify-items-center">
      {clientLogos.map((client, index) => (
        <motion.div
          key={client.id}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ 
            duration: 0.9, 
            delay: index * 0.1, // Staggered entry for "lazy" feel
            ease: [0.21, 0.45, 0.32, 0.9] 
          }}
          className="w-full flex justify-center px-4"
        >
          <img
            src={client.img}
            alt={client.name}
            loading="lazy"
            /* No grayscale here - original colors only */
            className="max-h-14 md:max-h-20 w-auto object-contain hover:scale-110 transition-transform duration-500"
          />
        </motion.div>
      ))}
    </div>
  </div>
</section>
    



  </div>
</section>









      {/* ================= FOOTER ================= */}
    <footer className="bg-[#1a1f2e] text-white py-5 md:py-8 mt-16 border-t border-slate-800">
  <div className="max-w-7xl mx-auto px-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
      
      {/* 1. BRAND LOGO & DESCRIPTION */}
      <div className="space-y-6">
        <img 
          src="/logo/logo.png" 
          alt="Medico Aid Logo" 
          className="h-16 w-auto brightness-0 invert" 
        />
        <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
          Safa Al-Tamayyuz Trading Co. provides premium medical and orthopedic supplies 
          tailored for healthcare excellence across the Kingdom.
        </p>
      </div>

      {/* 2. IMPORTANT LINKS (TEXT ONLY) */}
      <div>
        <h4 className="text-lg font-bold mb-6 text-white tracking-wide">Important Links</h4>
        <ul className="space-y-3 text-sm text-slate-400">
          <li>Products</li>
          <li>About us</li>
          <li>News</li>
          <li>Contact us</li>
        </ul>
      </div>

      {/* 3. PRODUCT CATEGORIES (TEXT ONLY) */}
      <div>
        <h4 className="text-lg font-bold mb-6 text-white tracking-wide">Products</h4>
        <ul className="space-y-3 text-sm text-slate-400 uppercase tracking-tighter">
          <li>Supports & Braces</li>
          <li>Cervical (Neck) Care</li>
          <li>Lumbo Sacral Supports</li>
          
          <li>Foot Care</li>
          <li>Traction Kits</li>
          <li>Compression Therapy</li>
        </ul>
      </div>

      {/* 4. ADDRESS & CONTACT */}
      <div>
        <h4 className="text-lg font-bold mb-6 text-white tracking-wide">Address</h4>
        <p className="text-sm text-slate-400 leading-loose">
          Safa Al-Tamayyuz Trading Co., Tauba Street, <br />
          Al Askan Building, Sharafia District, <br />
          Jeddah, KSA <br />
          P.O. Box : 6368, Jeddah 6368, Saudi Arabia
        </p>
        <div className="mt-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700 inline-block">
           <p className="text-cyan-400 font-mono text-sm font-bold">+966 12 6513490</p>
        </div>
      </div>
    </div>

    {/* BOTTOM BAR */}
    <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex gap-6 text-xs text-slate-500 font-medium">
        <span>Terms & Condition</span>
        <span>Privacy Policy</span>
        <span>Refund Policy</span>
      </div>
      <p className="text-xs text-slate-500">
        © 2026 Medico Aid. All rights reserved.
      </p>
    </div>
  </div>
</footer>

    </div>
  );
}