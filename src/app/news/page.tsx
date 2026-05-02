"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
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
  const { user } = useAuth();
  const userEmail = (user?.email || (user as any)?.emailAddresses?.[0]?.emailAddress || "").toLowerCase();
  const isAnahuac = userEmail.endsWith('@anahuac.mx') || userEmail.includes('.anahuac.mx') || userEmail.endsWith('@bizen.mx') ;

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
    <div className="min-h-screen bg-[#05081a] text-white selection:bg-blue-500/30 pb-20 news-page-container">
      <style>{`
        .news-page-container div:not(.bg-white *):not(.bg-emerald-500 *):not(.bg-blue-600 *),
        .news-page-container p:not(.bg-white *),
        .news-page-container span:not(.bg-white *):not(.bg-emerald-500 *):not(.bg-blue-600 *),
        .news-page-container h1,
        .news-page-container h2,
        .news-page-container h3,
        .news-page-container h4,
        .news-page-container h5,
        .news-page-container h6,
        .news-page-container label,
        .news-page-container input {
          color: #ffffff !important;
          opacity: 1 !important;
          -webkit-text-fill-color: #ffffff !important;
          font-weight: 400 !important;
        }

        .news-page-container h1,
        .news-page-container h2,
        .news-page-container h3,
        .news-page-container h4,
        .news-page-container h5,
        .news-page-container h6 {
          font-weight: 400 !important;
        }

        .news-page-container .bg-white,
        .news-page-container .bg-white *,
        .news-page-container .bg-emerald-500 *,
        .news-page-container .bg-blue-600 * {
          -webkit-text-fill-color: initial !important;
        }
        
        .news-page-container .border, 
        .news-page-container .border-slate-200 {
          border-color: rgba(255,255,255,0.1) !important;
        }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-6 pt-12 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => router.back()}
              className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:${isAnahuac ? 'text-[#FF5900] border-orange-500/30' : 'text-blue-400 border-blue-500/30'} transition-all active:scale-95 hover:shadow-lg backdrop-blur-md`}
            >
              <ArrowLeft size={22} />
            </button>
            <div className="flex items-center gap-5">
              {isAnahuac && (
                <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center p-2 shadow-sm backdrop-blur-md">
                  <img src="/León Anáhuac.png" alt="León Anáhuac" className="w-full h-full object-contain" />
                </div>
              )}
              <div>
                <h1 className="text-4xl font-normal text-white tracking-tight leading-none mb-2">
                  Noticias <span className={isAnahuac ? "text-[#FF5900]" : "text-blue-400"}>BIZEN</span>
                </h1>
                <p className="text-white/60 font-medium">El pulso del mercado financiero en tiempo real.</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Tab Switcher */}
            <div className="bg-white/5 backdrop-blur-md p-1.5 rounded-2xl flex items-center border border-white/10 w-full md:w-auto">
              <button 
                onClick={() => setActiveTab("news")}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
                  activeTab === "news" 
                  ? `bg-white/10 text-white shadow-sm ring-1 ring-white/20` 
                  : "text-white/40 hover:text-white"
                }`}
              >
                <Newspaper size={18} /> Noticias
              </button>
              <button 
                onClick={() => setActiveTab("analysis")}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
                  activeTab === "analysis" 
                  ? `bg-white/10 text-white shadow-sm ring-1 ring-white/20` 
                  : "text-white/40 hover:text-white"
                }`}
              >
                <BrainCircuit size={18} /> Análisis de Billy
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative group w-full md:w-[320px]">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:${isAnahuac ? 'text-[#FF5900]' : 'text-blue-400'} transition-colors`} size={18} />
              <input 
                type="text" 
                placeholder="Buscar noticias..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium outline-none focus:ring-4 ${isAnahuac ? 'focus:ring-orange-500/10 focus:border-orange-500' : 'focus:ring-blue-500/10 focus:border-blue-500'} transition-all placeholder:text-white/30 shadow-sm text-white`}
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
              className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 border ${
                activeCategory === cat 
                ? `${isAnahuac ? 'bg-[#FF5900] border-[#FF5900]' : 'bg-blue-600 border-blue-600'} text-white shadow-lg shadow-blue-600/20 active:scale-95` 
                : `bg-white/5 text-white/50 border-white/10 hover:border-${isAnahuac ? 'orange' : 'blue'}-400/50 hover:text-white shadow-sm`
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
                className="relative group w-full h-[540px] rounded-[40px] overflow-hidden mb-16 cursor-pointer shadow-2xl border border-white/10"
                onClick={() => window.open(filteredNews[0].url, "_blank")}
              >
                <img 
                  src={filteredNews[0].image} 
                  alt={filteredNews[0].title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                   onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05081a] via-[#05081a]/40 to-transparent" />
                
                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full max-w-[1000px]">
                  <div className="flex items-center gap-3 mb-6">
                    <span className={`px-4 py-1.5 ${isAnahuac ? 'bg-[#FF5900]' : 'bg-blue-600'} rounded-full text-[10px] font-medium text-white uppercase tracking-widest`}>PRO DESTACADO</span>
                    <span className="text-white/70 text-sm font-medium">{filteredNews[0].source} • {filteredNews[0].time}</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-normal text-white mb-6 leading-tight tracking-tight">
                    {filteredNews[0].title}
                  </h2>
                  <p className="text-lg md:text-xl text-white/80 max-w-[800px] leading-relaxed mb-8 line-clamp-2 md:line-clamp-none font-medium">
                    {filteredNews[0].fullDesc || filteredNews[0].desc}
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                     <div 
                       onClick={(e) => {
                         e.stopPropagation();
                         router.push("/live/join");
                       }}
                       className="flex items-center gap-2.5 px-8 py-4 bg-white hover:bg-slate-100 rounded-2xl text-[#05081a] font-medium text-base transition-all active:scale-95 shadow-xl"
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
                    className="flex flex-col bg-white/5 backdrop-blur-md rounded-[32px] border border-white/10 overflow-hidden cursor-pointer shadow-sm hover:border-blue-500/30 transition-all duration-300"
                    onClick={() => window.open(item.url, "_blank")}
                  >
                    <div className="w-full h-64 overflow-hidden relative">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110 opacity-90" 
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800";
                        }}
                      />
                      <div className="absolute bottom-4 left-4 px-4 py-1.5 bg-[#05081a]/80 backdrop-blur-md rounded-xl text-[10px] font-medium text-white uppercase tracking-widest border border-white/10">
                        {item.category}
                      </div>
                    </div>

                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-4">
                        <span className={`text-xs font-medium ${isAnahuac ? 'text-[#FF5900]' : 'text-blue-400'} uppercase`}>{item.source}</span>
                        <span className="text-white/20">•</span>
                        <span className="text-xs font-medium text-white/40 uppercase tracking-tighter">{item.time}</span>
                      </div>
                      
                      <h3 className={`text-xl font-normal text-white leading-snug mb-4 transition-colors line-clamp-2`}>
                        {item.title}
                      </h3>
                      <p className="text-white/60 text-sm font-medium leading-relaxed mb-8 line-clamp-3">
                        {item.fullDesc ? item.fullDesc : item.desc}
                      </p>

                      <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-medium text-white/30 uppercase tracking-widest">AUTOR</span>
                          <span className="text-sm font-medium text-white/80">{item.author || "Redacción BIZEN"}</span>
                        </div>
                        <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:${isAnahuac ? 'text-[#FF5900] bg-orange-500/10' : 'text-blue-400 bg-blue-500/10'} transition-colors`}>
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
            className="text-center py-32 bg-white/5 rounded-[40px] border border-dashed border-white/10"
          >
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Newspaper size={40} className="text-white/20" />
            </div>
            <h2 className="text-2xl font-medium text-white mb-2">No se encontraron noticias</h2>
            <p className="text-white/40 font-medium mb-8">Intenta ajustar tus filtros o búsqueda.</p>
            <button 
              onClick={() => { setSearchTerm(""); setActiveCategory("Todas"); }}
              className={`px-8 py-3.5 ${isAnahuac ? 'bg-[#FF5900]' : 'bg-blue-600'} text-white font-medium rounded-2xl transition shadow-lg shadow-blue-600/20`}
            >
              Restablecer filtros
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
