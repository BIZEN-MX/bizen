"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Newspaper, 
  TrendingUp, 
  ChevronRight, 
  Clock, 
  Share2,
  ExternalLink,
  Search,
  Filter,
  Zap,
  Tag,
  BrainCircuit
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageLoader from "@/components/PageLoader";
import AnalysisSection from "@/components/news/AnalysisSection";

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [activeTab, setActiveTab] = useState<"news" | "analysis">("news");
  const router = useRouter();

  const fetchNews = async () => {
    try {
      const res = await fetch("/api/news");
      if (res.ok) {
        setNews(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const categories = useMemo(() => {
    const cats = ["Todas", ...new Set(news.map(n => n.category))];
    return cats;
  }, [news]);

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "Todas" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Decorative Orbs */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-indigo-100/20 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-[1400px] mx-auto px-6 pt-12">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => router.back()}
              className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/10 transition-all active:scale-95"
            >
              <ArrowLeft size={22} />
            </button>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                Noticias <span className="text-blue-600">BIZEN</span>
              </h1>
              <p className="text-slate-500 font-medium">El pulso del mercado financiero en tiempo real.</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Tab Switcher */}
            <div className="bg-slate-200/50 backdrop-blur-md p-1.5 rounded-2xl flex items-center border border-slate-200/60 w-full md:w-auto">
              <button 
                onClick={() => setActiveTab("news")}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                  activeTab === "news" 
                  ? "bg-white text-blue-600 shadow-sm shadow-blue-500/10 ring-1 ring-black/5" 
                  : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Newspaper size={18} /> Noticias
              </button>
              <button 
                onClick={() => setActiveTab("analysis")}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                  activeTab === "analysis" 
                  ? "bg-white text-blue-600 shadow-sm shadow-blue-500/10 ring-1 ring-black/5" 
                  : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <BrainCircuit size={18} /> Análisis de Billy
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative group w-full md:w-[320px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Buscar noticias..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-semibold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 border ${
                activeCategory === cat 
                ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20 active:scale-95" 
                : "bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-500 shadow-sm"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <PageLoader />
        ) : activeTab === "analysis" ? (
          <AnalysisSection />
        ) : (
          <>
            {/* Featured Section */}
            {filteredNews.length > 0 && searchTerm === "" && activeCategory === "Todas" && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group w-full h-[540px] rounded-[40px] overflow-hidden mb-16 cursor-pointer shadow-2xl shadow-slate-300/50"
                onClick={() => window.open(filteredNews[0].url, "_blank")}
              >
                <img 
                  src={filteredNews[0].image} 
                  alt={filteredNews[0].title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                   onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
                
                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full max-w-[1000px]">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-4 py-1.5 bg-blue-600 rounded-full text-[10px] font-black text-white uppercase tracking-widest">PRO DESTACADO</span>
                    <span className="text-white/70 text-sm font-semibold">{filteredNews[0].source} • {filteredNews[0].time}</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight">
                    {filteredNews[0].title}
                  </h2>
                  <p className="text-lg md:text-xl text-white/80 max-w-[800px] leading-relaxed mb-8 line-clamp-2 md:line-clamp-none">
                    {filteredNews[0].fullDesc || filteredNews[0].desc}
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                     <div 
                       onClick={(e) => {
                         e.stopPropagation();
                         router.push("/live/join");
                       }}
                       className="flex items-center gap-2.5 px-8 py-4 bg-white hover:bg-slate-100 rounded-2xl text-slate-900 font-bold text-base transition-all active:scale-95 shadow-xl"
                     >
                       Visitar BIZEN Live <ChevronRight size={20} />
                     </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {(searchTerm !== "" || activeCategory !== "Todas" ? filteredNews : filteredNews.slice(1)).map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ y: -12 }}
                    className="flex flex-col bg-white rounded-[32px] border border-slate-200 overflow-hidden cursor-pointer shadow-sm hover:shadow-xl hover:shadow-slate-200 transition-all duration-300"
                    onClick={() => window.open(item.url, "_blank")}
                  >
                    <div className="w-full h-64 overflow-hidden relative">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800";
                        }}
                      />
                      <div className="absolute bottom-4 left-4 px-4 py-1.5 bg-slate-900/80 backdrop-blur-md rounded-xl text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
                        {item.category}
                      </div>
                    </div>

                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs font-black text-blue-600 uppercase">{item.source}</span>
                        <span className="text-slate-200">•</span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{item.time}</span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-slate-900 leading-snug mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 line-clamp-3">
                        {item.fullDesc ? item.fullDesc : item.desc}
                      </p>

                      <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AUTOR</span>
                          <span className="text-sm font-bold text-slate-800">{item.author || "Redacción BIZEN"}</span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                          <Share2 size={18} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && filteredNews.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 bg-white rounded-[40px] border border-dashed border-slate-200"
          >
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Newspaper size={40} className="text-slate-300" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">No se encontraron noticias</h2>
            <p className="text-slate-500 font-medium mb-8">Intenta ajustar tus filtros o búsqueda.</p>
            <button 
              onClick={() => { setSearchTerm(""); setActiveCategory("Todas"); }}
              className="px-8 py-3.5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition"
            >
              Restablecer filtros
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
