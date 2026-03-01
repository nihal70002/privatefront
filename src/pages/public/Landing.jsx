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
  { id: 3, name: "Lumbo Sacral (Back) and Abdominal Supports", img: "/categories/lumbo.jpg" },
  { id: 4, name: "Cervical (Neck) Care", img: "/categories/cervical.jpg" },
  { id: 5, name: "Mobility Aids", img: "/categories/mobility.jpg" },
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
          <div className="flex-1 max-w-xl w-full hidden sm:flex">
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

            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-800 line-clamp-1">
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
      <section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-6">
    
    {/* Section Header */}
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-16"
    >
      <h2 className="text-4xl md:text-5xl font-serif italic text-slate-900 tracking-tight">
        Shop By <span className="font-normal text-cyan-600 border-b-4 border-cyan-100">Category</span>
      </h2>
    </motion.div>

    {/* Uniform Grid with Colored Borders */}
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 items-stretch">
      {categories.map((cat, i) => (
        <motion.div
          key={cat.id}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.1 }}
          className="flex"
        >
          <Link
            to={`/products?categoryId=${cat.id}`}
            className="group flex flex-col w-full bg-white rounded-[2.5rem] 
                       border-2 border-cyan-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] 
                       hover:border-cyan-400 hover:shadow-[0_20px_40px_rgba(6,182,212,0.15)] 
                       hover:-translate-y-3 transition-all duration-500 overflow-hidden"
          >
            {/* 1. Zoomed Image Container with Light Cyan Backdrop */}
            <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-cyan-50/50 to-transparent p-4">
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-125"
              />
            </div>

            {/* 2. Fixed Height Text Area (Uniformity Fix) */}
            <div className="p-6 flex flex-col items-center justify-between text-center flex-grow bg-white">
              <h3 className="text-sm md:text-base font-bold text-slate-800 group-hover:text-cyan-600 transition-colors line-clamp-2 min-h-[3rem] flex items-center justify-center">
                {cat.name}
              </h3>
              
              {/* Bottom Decorative Pill Border */}
              <div className="w-10 h-1.5 bg-slate-100 group-hover:bg-cyan-400 group-hover:w-16 transition-all duration-500 mt-4 rounded-full" />
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
            <h2 className="text-2xl sm:text-3xl font-bold">
              Featured Products
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
      <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
        New Arrivals
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
    <div className="flex flex-col lg:flex-row items-center gap-16">
      
      {/* LEFT SIDE: IMAGE WITH DECORATIVE BORDER */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="flex-1 relative"
      >
        <div className="relative z-10 rounded-[3rem] overflow-hidden border-8 border-slate-50 shadow-2xl">
          <img 
            src="/posters/about-poster.jpg" // Replace with your actual image path
            alt="Healthcare Excellence" 
            className="w-full h-[500px] object-cover"
          />
        </div>
        {/* Decorative Cyan Element */}
        <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-cyan-100 rounded-full -z-0 opacity-50 blur-3xl" />
        <div className="absolute -top-10 -left-10 w-32 h-32 border-t-4 border-l-4 border-cyan-400 rounded-tl-3xl" />
      </motion.div>

      {/* RIGHT SIDE: CONTENT */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex-1 space-y-8"
      >
        <div className="space-y-4">
          <span className="text-cyan-600 font-bold tracking-widest text-sm uppercase">
            Since 2026
          </span>
          <h2 className="text-4xl md:text-5xl font-serif italic text-slate-900">
            About <span className="text-cyan-600 font-normal border-b-4 border-cyan-100">Medico Aid</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed pt-4">
            Safa Al-Tamayyuz Trading Co. (Medico Aid) stands at the forefront of healthcare distribution in Saudi Arabia. 
            We specialize in providing high-grade orthopedic, surgical, and rehabilitation supplies that empower patients 
            and support medical professionals.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-cyan-50 rounded-2xl text-cyan-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-slate-800">KSA Wide Delivery</h4>
              <p className="text-sm text-slate-500">Fast and reliable logistics across the Kingdom.</p>
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
              <p className="text-sm text-slate-500">Sourced from globally recognized medical brands.</p>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <button className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-cyan-600 transition-all duration-300 shadow-xl shadow-slate-200 hover:shadow-cyan-100">
            Learn More
          </button>
        </div>
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
    <footer className="bg-[#1a1f2e] text-white py-16 mt-16 border-t border-slate-800">
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
          <li>Lumbo Sacral (Back) Supports</li>
          <li>Mobility Aids</li>
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
