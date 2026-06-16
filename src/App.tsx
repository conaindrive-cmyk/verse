/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { NewsArticle, NewsCategory, VideoReport, cleanImageUrl } from "./types";
import { INITIAL_ARTICLES, BREAKING_TICKER_STORIES } from "./data";
import Logo from "./components/Logo";
import BreakingTicker from "./components/BreakingTicker";
import ArticleModal from "./components/ArticleModal";
import ReaderGallery from "./components/ReaderGallery";

import { 
  Sun, 
  Moon, 
  Search, 
  Menu, 
  X, 
  TrendingUp, 
  ChevronRight, 
  Mail, 
  Compass, 
  Instagram, 
  Twitter, 
  Facebook, 
  Youtube, 
  MapPin, 
  Phone, 
  Clock, 
  Heart, 
  Award,
  Share2,
  Play
} from "lucide-react";

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(false);

  // Active articles list (merging baseline default articles with user/AI articles)
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [hasApiKeyOnServer, setHasApiKeyOnServer] = useState<boolean>(false);

  // Header and Navigation States
  const [activeCategory, setActiveCategory] = useState<string>("Home");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isStickyHeader, setIsStickyHeader] = useState<boolean>(false);

  // Focus Modes
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const handleSelectArticle = (article: NewsArticle) => {
    setSelectedArticle(article);
  };

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState<string>("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState<boolean>(false);

  // Contact Form State
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Synchronize system articles on mount
  useEffect(() => {
    // 1. Load baseline default articles
    let activeList = [...INITIAL_ARTICLES];

    // 2. Fetch server articles if active
    const syncArticles = async () => {
      try {
        const res = await fetch("/api/news");
        if (res.ok) {
          const data = await res.json();
          setHasApiKeyOnServer(data.hasApiKey);
          
          if (data.articles && data.articles.length > 0) {
            // Unshift new user/AI created server-side articles
            activeList = [...data.articles, ...activeList];
          }
        }
      } catch (err) {
        console.warn("Express endpoint query inactive, falling back to local simulation:", err);
      }

      // 3. Check client localStorage for local session fallbacks
      const localAdded = localStorage.getItem("local_added_articles");
      if (localAdded) {
        const parsed: NewsArticle[] = JSON.parse(localAdded);
        activeList = [...parsed, ...activeList];
      }

      // De-duplicate items by ID just in case
      const uniqueMap = new Map<string, NewsArticle>();
      activeList.forEach((a) => uniqueMap.set(a.id, a));
      setArticles(Array.from(uniqueMap.values()));
    };

    syncArticles();
  }, []);

  // Monitor window scroll to turn header sticky
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsStickyHeader(true);
      } else {
        setIsStickyHeader(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Add customized/generative articles
  const handleAddArticle = async (newArticleData: Partial<NewsArticle>) => {
    const fresh: NewsArticle = {
      id: `local-${Date.now()}`,
      title: newArticleData.title || "Untitled Report",
      summary: newArticleData.summary || "No summary provided",
      content: newArticleData.content || "Placeholder content",
      category: (newArticleData.category as NewsCategory) || NewsCategory.LATEST,
      imageUrl: newArticleData.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800",
      publishedAt: new Date().toISOString(),
      readTime: newArticleData.readTime || "3 min read",
      author: newArticleData.author || "Staff Correspondent, News Verse",
      isBreaking: newArticleData.isBreaking || false,
      isFeatured: newArticleData.isFeatured || false,
      isTrending: newArticleData.isTrending || false,
      viewCount: Math.floor(Math.random() * 60) + 12
    };

    // Update frontend state immediately to feel responsive
    setArticles((prev) => [fresh, ...prev]);

    // Save to user client-side list in localStorage
    const saved = localStorage.getItem("local_added_articles");
    const currentList = saved ? JSON.parse(saved) : [];
    localStorage.setItem("local_added_articles", JSON.stringify([fresh, ...currentList]));

    // Attempt to back sync to local database
    try {
      await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fresh)
      });
    } catch (err) {
      console.log("Could not bind backup copy to live backend (running local only)");
    }
  };

  // Delete customize articles
  const handleDeleteArticle = async (id: string) => {
    // 1. Remove from local memory
    setArticles((prev) => prev.filter((a) => a.id !== id));

    // 2. Remove from LocalStorage
    const saved = localStorage.getItem("local_added_articles");
    if (saved) {
      const parsed: NewsArticle[] = JSON.parse(saved);
      const filtered = parsed.filter((a) => a.id !== id);
      localStorage.setItem("local_added_articles", JSON.stringify(filtered));
    }

    // 3. Dispatch delete request to Server API if possible
    try {
      await fetch(`/api/news/${id}`, { method: "DELETE" });
    } catch (err) {
      console.log("Remote delete fallback activated.");
    }
  };

  // Newsletter Submit
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubscribed(true);
    setNewsletterEmail("");
    setTimeout(() => setNewsletterSubscribed(false), 8000);
  };

  // Contact Submit
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setContactSubmitted(true);
    setContactName("");
    setContactEmail("");
    setContactMessage("");
    setTimeout(() => setContactSubmitted(false), 9000);
  };

  // Filter Articles based on Category Selector & Search Box
  const getFilteredArticles = () => {
    let list = [...articles];

    // Filter by category tabs if not "Home" & not active contact portal
    if (activeCategory !== "Home" && activeCategory !== "Contact") {
      list = list.filter((a) => a.category.toLowerCase() === activeCategory.toLowerCase());
    }

    // Filter by search phrases
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.summary.toLowerCase().includes(query) ||
          a.content.toLowerCase().includes(query) ||
          a.category.toLowerCase().includes(query)
      );
    }

    return list;
  };

  const filteredFeed = getFilteredArticles();

  // Find Featured Hero article (prefer breaking/featured tags)
  const heroArticle = articles.find((a) => a.isFeatured) || articles[0];

  // Derive extra sidebar statistics
  const trendingArticles = articles.filter((a) => a.isTrending).slice(0, 5);
  const mostReadArticles = [...articles].sort((a, b) => b.viewCount - a.viewCount).slice(0, 5);

  const categoriesMap = [
    { name: "Latest News", count: articles.filter((a) => a.category === NewsCategory.LATEST).length },
    { name: "Pakistan", count: articles.filter((a) => a.category === NewsCategory.PAKISTAN).length },
    { name: "World", count: articles.filter((a) => a.category === NewsCategory.WORLD).length },
    { name: "Technology", count: articles.filter((a) => a.category === NewsCategory.TECHNOLOGY).length },
    { name: "Business", count: articles.filter((a) => a.category === NewsCategory.BUSINESS).length },
    { name: "Sports", count: articles.filter((a) => a.category === NewsCategory.SPORTS).length },
  ];

  // Main Category Menu Navigation Items
  const menuItems = [
    "Home",
    "Latest News",
    "Pakistan",
    "World",
    "Business",
    "Technology",
    "Sports",
    "Contact"
  ];

  return (
    <div 
      className={`min-h-screen font-sans transition-colors duration-350 select-text ${
        isDark ? "bg-[#111112] text-slate-100" : "bg-white text-[#111111]"
      }`}
      id="root-newsverse-layout"
    >
      {/* STICKY HEADER SECTION */}
      <header 
        id="main-navigation-header"
        className={`z-40 transition-all duration-300 w-full ${
          isStickyHeader 
            ? "fixed top-0 left-0 right-0 shadow-md transform translate-y-0" 
            : "relative"
        } ${
          isDark ? "bg-[#1C1C1E]/95 border-b border-slate-800" : "bg-white/95 border-b border-slate-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-6">
          
          {/* Logo on Left */}
          <div 
            onClick={() => {
              setActiveCategory("Home");
              setSearchQuery("");
            }} 
            className="cursor-pointer"
          >
            <Logo isDark={isDark} />
          </div>

          {/* Desktop central navigation menu */}
          <nav className="hidden xl:flex items-center gap-1.5 text-xs font-serif font-bold tracking-tight select-none">
            {menuItems.map((item) => {
              const isActive = activeCategory === item;
              return (
                <button
                  key={item}
                  onClick={() => {
                    setActiveCategory(item);
                    setSearchQuery("");
                  }}
                  className={`px-3 py-2 rounded-sm uppercase tracking-wider transition-all cursor-pointer ${
                    isActive 
                      ? "bg-[#B80000] text-white font-extrabold" 
                      : isDark ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-100 text-[#111111]"
                  }`}
                  id={`nav-tab-${item.toLowerCase().replace(" ", "-")}`}
                >
                  {item}
                </button>
              );
            })}
          </nav>

          {/* Search Bar / Theme toggle / Admin Trigger */}
          <div className="flex items-center gap-3">
            
            {/* Desktop Search */}
            <div className="relative hidden md:flex items-center text-xs">
              <input
                type="text"
                placeholder="Search Truth..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeCategory === "Contact") {
                    setActiveCategory("Home");
                  }
                }}
                className={`pl-8 pr-3 py-2 w-48 rounded-md border text-xs focus:outline-none focus:ring-1 focus:ring-[#B80000] transition-all focus:w-56 ${
                  isDark ? "bg-[#2A2A2D] border-slate-800 text-white" : "bg-slate-100 border-slate-300"
                }`}
              />
              <Search size={14} className="absolute left-2.5 opacity-60" />
            </div>

            {/* Dark Mode Icon Button */}
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-full cursor-pointer transition-colors ${
                isDark ? "hover:bg-slate-800 text-amber-400" : "hover:bg-slate-100 text-slate-700"
              }`}
              title={isDark ? "Light Presentation Mode" : "Dark Presentation Mode"}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>



            {/* Mobile Hamburger menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Navigation Tray"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer Dropdown */}
        {isMobileMenuOpen && (
          <div className={`xl:hidden select-none border-t px-4 py-4 space-y-3 transition-all ${
            isDark ? "bg-[#1E1E20] border-slate-800" : "bg-slate-50 border-slate-200"
          }`}>
            {/* Search Input for Mobile */}
            <div className="relative flex items-center text-xs mb-3">
              <input
                type="text"
                placeholder="Search News Verse..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-8 pr-3 fill-none py-2 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#B80000] ${
                  isDark ? "bg-[#2A2A2D] border-slate-700 text-white" : "bg-white border-slate-300"
                }`}
              />
              <Search size={14} className="absolute left-2.5 opacity-60" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-serif font-bold">
              {menuItems.map((item) => {
                const isActive = activeCategory === item;
                return (
                  <button
                    key={item}
                    onClick={() => {
                      setActiveCategory(item);
                      setIsMobileMenuOpen(false);
                      setSearchQuery("");
                    }}
                    className={`p-2.5 rounded-md text-left transition-all uppercase tracking-wide truncate ${
                      isActive 
                        ? "bg-[#B80000] text-white" 
                        : isDark ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-100 text-slate-800"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
            
            <p className="text-[10px] opacity-40 text-center uppercase tracking-widest font-mono pt-3">
              Truth Beyond Headlines
            </p>
          </div>
        )}
      </header>

      {/* Add structural empty offset when header is sticky to prevent page jerk */}
      {isStickyHeader && <div className="h-[73px]" />}

      {/* THE BREAKING MARQUEE TICKER (Below Header) */}
      <BreakingTicker isDark={isDark} />

      {/* MAIN CONTAINER STREAM */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-10">
        
        {activeCategory === "Contact" ? (
          /* VIEW CONDITIONAL 2: Gorgeous Serious Contact Portal */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fade-in" id="contact-portal-view">
            <div className="lg:col-span-2 space-y-6">
              <div className={`p-6 md:p-8 rounded-xl border ${
                isDark ? "bg-[#18181A] border-slate-800" : "bg-white border-slate-200"
              }`}>
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight pb-3 mb-6 border-b">
                  News Verse Bureau Services
                </h2>

                {contactSubmitted ? (
                  <div className="bg-emerald-600 text-white p-6 rounded-lg text-center font-bold tracking-wide space-y-3">
                    <p className="text-lg">Your press dispatch has logged successfully.</p>
                    <p className="text-xs opacity-90 font-mono">Our desk editors in Karachi and London will review your pitch shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4" id="press-contact-dispatch">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase mb-1.5 opacity-80">Your Name</label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Faisal Bilal"
                          className={`w-full text-xs px-3.5 py-2.5 rounded border focus:outline-none focus:ring-1 focus:ring-[#B80000] ${
                            isDark ? "bg-[#232325] border-slate-700 text-white" : "bg-white border-slate-300 text-black"
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase mb-1.5 opacity-80">Email Credentials</label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="faisal@gmail.com"
                          className={`w-full text-xs px-3.5 py-2.5 rounded border focus:outline-none focus:ring-1 focus:ring-[#B80000] ${
                            isDark ? "bg-[#232325] border-slate-700 text-white" : "bg-white border-slate-300 text-black"
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase mb-1.5 opacity-80">Message Description or Scoop Pitch</label>
                      <textarea
                        rows={6}
                        required
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Detail your local news leak, story tip, Lollywood event sponsorship request, or feedback..."
                        className={`w-full text-xs px-3.5 py-2.5 rounded border focus:outline-none focus:ring-1 focus:ring-[#B80000] ${
                          isDark ? "bg-[#232325] border-slate-700 text-white" : "bg-white border-slate-300 text-black"
                        }`}
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#B80000] hover:bg-red-800 text-white text-xs font-bold uppercase tracking-wider rounded"
                    >
                      Transmit Dispatch
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar with Location Details */}
            <div className="space-y-6">
              <div className={`p-6 rounded-xl border leading-relaxed ${
                isDark ? "bg-[#18181A] border-slate-800" : "bg-white border-slate-200"
              }`}>
                <h3 className="text-sm font-extrabold uppercase tracking-widest border-b pb-3 mb-4 text-[#B80000]">
                  Head Office Locations
                </h3>

                <ul className="space-y-3.5 text-xs">
                  <li className="flex gap-2.5">
                    <MapPin size={16} className="text-[#B80000] shrink-0" />
                    <div>
                      <strong className="block text-[#111111] dark:text-white">Federal Bureau</strong>
                      <span className="opacity-75">Sector G-6, Constitution Avenue, Islamabad, Pakistan</span>
                    </div>
                  </li>
                  <li className="flex gap-2.5">
                    <MapPin size={16} className="text-[#B80000] shrink-0" />
                    <div>
                      <strong className="block text-[#111111] dark:text-white">International Center</strong>
                      <span className="opacity-75">Broadcasting House, Portland Place, London, England</span>
                    </div>
                  </li>
                  <li className="flex gap-2.5 bg-red-950/5 dark:bg-red-950/20 p-2.5 rounded-lg border border-red-900/10">
                    <Youtube size={16} className="text-[#B80000] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <strong className="block text-[#111111] dark:text-white">Official YouTube Channel</strong>
                      <a 
                        href="http://www.youtube.com/@NewsVerseNetworkNetwork" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[#B80000] hover:underline font-mono text-[10px] break-all block mt-0.5"
                      >
                        youtube.com/@NewsVerseNetworkNetwork
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-2.5">
                    <Phone size={16} className="text-[#B80000] shrink-0" />
                    <div>
                      <strong className="block text-[#111111] dark:text-white font-serif">Direct Telephony</strong>
                      <span className="opacity-75">+92 (051) 921-NEWS</span>
                    </div>
                  </li>
                  <li className="flex gap-2.5">
                    <Mail size={16} className="text-[#B80000] shrink-0" />
                    <div>
                      <strong className="block text-[#111111] dark:text-white">Press Relations</strong>
                      <span className="opacity-75">news.verse.network@gmail.com</span>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-red-950/5 border border-red-900/10 p-4 rounded-xl text-center">
                <p className="text-[11px] opacity-75 font-semibold">
                  News Verse operates verified digital channels for direct investigative reporting. Do not submit sensitive governmental documents over unencrypted protocols.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* VIEW CONDITIONAL 3: Standard Home & Channel streams */
          <div className="space-y-10 animate-fade-in">
            
            {/* HERO STORY SPOTLIGHT DISPLAY (Rendered ONLY on general Home Feed) */}
            {activeCategory === "Home" && !searchQuery && heroArticle && (
              <section id="hero-breaking-spotlight" className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                {/* Massive 2-column Banner */}
                <div 
                  onClick={() => handleSelectArticle(heroArticle)}
                  className={`lg:col-span-2 group cursor-pointer rounded-xl border overflow-hidden flex flex-col justify-between transition-all select-none hover:shadow-lg ${
                    isDark ? "bg-[#18181A] border-slate-800" : "bg-white border-slate-200"
                  }`}
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-800">
                    <img 
                      src={cleanImageUrl(heroArticle.imageUrl)} 
                      alt={heroArticle.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4 text-left">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {heroArticle.isBreaking && (
                          <>
                            <span className="bg-[#B80000] text-white font-black uppercase text-[9px] tracking-wider px-2 py-0.5 rounded-[1px] shadow-xs">
                              Breaking Exclusive
                            </span>
                            <span className="text-xs opacity-50">&bull;</span>
                          </>
                        )}
                        <span className="text-[#B80000] font-black uppercase text-xs tracking-widest" id="hero-category-label">
                          {heroArticle.category}
                        </span>
                        <span className="text-xs opacity-50">&bull;</span>
                        <span className="text-xs opacity-50 font-mono">{heroArticle.readTime}</span>
                        <span className="text-xs opacity-50">&bull;</span>
                        <span className="text-xs opacity-50">By {heroArticle.author}</span>
                      </div>

                      <h2 
                        onClick={() => handleSelectArticle(heroArticle)}
                        className="text-xl md:text-3xl font-serif font-black tracking-tight cursor-pointer hover:text-[#B80000] transition-colors line-clamp-2 leading-snug"
                        id="hero-headline-link"
                      >
                        {heroArticle.title}
                      </h2>

                      <p className={`text-sm leading-relaxed line-clamp-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        {heroArticle.summary}
                      </p>
                    </div>

                    <div>
                      <button 
                        onClick={() => handleSelectArticle(heroArticle)}
                        className="inline-flex items-center gap-1.5 text-xs font-serif font-bold tracking-wider uppercase bg-[#B80000] hover:bg-red-800 text-white px-5 py-2.5 rounded shadow-xs cursor-pointer transition-colors"
                      >
                        <Play size={12} className="fill-white" />
                        Play Video & Read Story
                      </button>
                    </div>
                  </div>
                </div>

                {/* Top Stories Secondary list pane (Right - 1 Column) */}
                <div 
                  className={`p-6 rounded-xl border flex flex-col justify-between ${
                    isDark ? "bg-[#18181A] border-slate-800" : "bg-white border-slate-200"
                  }`}
                >
                  <div className="border-b border-rose-900/10 pb-3 mb-4 select-none flex items-center gap-1.5">
                    <TrendingUp size={16} className="text-[#B80000]" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#B80000]">
                      Top Featured Feed
                    </h3>
                  </div>

                  <div className="flex-grow space-y-4 divide-y divide-black/5 dark:divide-white/5 pr-1">
                    {articles.slice(1, 4).map((topStory) => (
                      <div key={topStory.id} className="pt-3 first:pt-0 group text-left space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                          {topStory.category}
                        </span>
                        <h4 
                          onClick={() => handleSelectArticle(topStory)}
                          className="text-xs md:text-sm font-sans font-extrabold leading-snug cursor-pointer group-hover:text-[#B80000] transition-colors line-clamp-2"
                        >
                          {topStory.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] opacity-50 font-mono">
                          <span>{topStory.readTime}</span>
                          <span>&bull;</span>
                          <span>{new Date(topStory.publishedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#B80000]/5 border border-[#B80000]/10 p-3.5 rounded-lg text-center mt-4">
                    <p className="text-[11px] opacity-75 font-serif font-semibold leading-relaxed">
                      "Journalism is printing what someone else does not want printed; everything else is public relations."
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* DYNAMIC TWO-COLUMN FEED GRID (Sidebar + Main Channel grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Left Side: Real News Feed Stream (spanning 2 columns) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Channel Header indicators */}
                <div className="flex items-center justify-between border-b border-rose-900/10 pb-3 select-none">
                  <span className="text-sm font-black font-sans uppercase tracking-widest text-[#B80000]">
                    {activeCategory === "Home" ? "Recent News Verse Dispatches" : `${activeCategory} Feed`}
                  </span>
                  <span className="text-[11px] opacity-60 font-mono">
                    Showing {filteredFeed.length} reports
                  </span>
                </div>

                {filteredFeed.length === 0 ? (
                  <div className="p-12 border border-dashed rounded-xl text-center select-none">
                    <p className="text-sm opacity-60 italic mb-2">No active articles index found matching query criteria.</p>
                    <button 
                      onClick={() => {
                        setSearchQuery("");
                        setActiveCategory("Home");
                      }} 
                      className="text-xs font-bold uppercase tracking-widest text-[#B80000] hover:underline"
                    >
                      Clear Search Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {filteredFeed.map((item) => (
                      <article 
                        key={item.id}
                        onClick={() => handleSelectArticle(item)}
                        className={`group cursor-pointer rounded-xl border overflow-hidden flex flex-col justify-between transition-all hover:shadow-md ${
                          isDark ? "bg-[#18181A] border-slate-800" : "bg-white border-slate-200"
                        }`}
                        id={`article-feed-card-${item.id}`}
                      >
                        {/* News Card Header Image */}
                        <div className="relative aspect-video w-full overflow-hidden bg-slate-800 select-none">
                          <img 
                            src={cleanImageUrl(item.imageUrl)} 
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Short Description details */}
                        <div className="p-5 flex-grow flex flex-col justify-between space-y-3 text-left">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 mb-1.5 select-none flex-wrap">
                              <span className="text-[#B80000] text-[10px] font-black uppercase tracking-wider">
                                {item.category}
                              </span>
                              {item.isBreaking && (
                                <>
                                  <span className="text-xs opacity-40 font-bold">&bull;</span>
                                  <span className="bg-[#B80000]/10 text-[#B80000] text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-[1px]">
                                    Breaking
                                  </span>
                                </>
                              )}
                            </div>
                            <h3 className="text-sm md:text-base font-sans font-black leading-snug group-hover:text-[#B80000] transition-colors line-clamp-2">
                              {item.title}
                            </h3>
                            <p className={`text-xs leading-relaxed line-clamp-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                              {item.summary}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5 text-[10px] opacity-60 font-mono select-none">
                            <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                            <span>{item.readTime}</span>
                          </div>
                        </div>

                        {/* Read More Button frame */}
                        <div className="px-5 pb-4 shrink-0 text-left select-none">
                          <button
                            onClick={() => handleSelectArticle(item)}
                            className="text-[10px] font-bold uppercase tracking-widest text-[#B80000] border-b border-transparent group-hover:border-[#B80000] transition-all"
                          >
                            Read Full Dispatch &rarr;
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION: Sidebar (Right Column) */}
              <aside className="space-y-6">
                
                {/* Sidebar Widget 1: Trending News (with visual ranking indices) */}
                <div 
                  className={`p-5 rounded-xl border text-left ${
                    isDark ? "bg-[#18181A] border-slate-800" : "bg-white border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-1.5 border-b border-rose-900/10 pb-3 mb-4 select-none">
                    <TrendingUp size={16} className="text-[#B80000]" />
                    <h3 className="text-xs font-black uppercase tracking-wider">Trending Highlights</h3>
                  </div>

                  <div className="space-y-4">
                    {trendingArticles.length === 0 ? (
                      <p className="text-xs italic text-center py-4 opacity-50 select-none">No active trends flagged.</p>
                    ) : (
                      trendingArticles.map((trend, index) => (
                        <div 
                          key={trend.id}
                          onClick={() => handleSelectArticle(trend)}
                          className="flex gap-3 group cursor-pointer items-start"
                        >
                          <span className="text-2xl md:text-3xl font-serif font-black text-[#B80000]/25 group-hover:text-[#B80000] transition-colors leading-none w-8 text-center select-none">
                            0{index + 1}
                          </span>
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase font-bold text-slate-500">{trend.category}</span>
                            <h4 className="text-xs font-bold leading-normal group-hover:text-[#B80000] transition-colors line-clamp-2">
                              {trend.title}
                            </h4>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Sidebar Widget 2: Most Read Stories */}
                <div 
                  className={`p-5 rounded-xl border text-left ${
                    isDark ? "bg-[#18181A] border-slate-800" : "bg-white border-slate-200"
                  }`}
                >
                  <h3 className="text-xs font-black uppercase tracking-wider border-b border-rose-900/10 pb-3 mb-4 select-none">
                    Most Popular Coverage
                  </h3>

                  <div className="space-y-3.5 divide-y divide-black/5 dark:divide-white/5">
                    {mostReadArticles.slice(0, 4).map((art, cellIdx) => (
                      <div 
                        key={art.id}
                        onClick={() => handleSelectArticle(art)}
                        className="pt-3 first:pt-0 group cursor-pointer"
                      >
                        <h4 className="text-xs font-bold leading-snug group-hover:text-[#B80000] transition-colors line-clamp-2">
                          {art.title}
                        </h4>
                        <span className="text-[10px] opacity-50 font-mono mt-1 block">{(art.viewCount || 10).toLocaleString()} views</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sidebar Widget 3: Popular Category indices */}
                <div 
                  className={`p-5 rounded-xl border text-left ${
                    isDark ? "bg-[#18181A] border-slate-800" : "bg-white border-slate-200"
                  }`}
                >
                  <h3 className="text-xs font-black uppercase tracking-wider border-b border-rose-900/10 pb-3 mb-4 select-none">
                    Explore Channels
                  </h3>

                  <div className="grid grid-cols-1 gap-2 text-xs select-none">
                    {categoriesMap.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => {
                          setActiveCategory(cat.name);
                          setSearchQuery("");
                        }}
                        className={`flex items-center justify-between p-2 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-all text-left ${
                          activeCategory === cat.name ? "text-[#B80000] font-black uppercase" : "opacity-80"
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] font-mono bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded">
                          {cat.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>



              </aside>

            </div>

            {/* INTEGRATED EXCLUSIVE ON-GROUND READER PHOTOJOURNALISM GALLERY */}
            {activeCategory === "Home" && (
              <section id="exclusive-reader-photojournalism-feed" className="pt-6 border-t border-black/5 dark:border-white/5">
                <ReaderGallery isDark={isDark} />
              </section>
            )}

          </div>
        )}

        {/* SECTION: NEWSLETTER INTEGRATION PORTAL */}
        <section 
          id="newsletter-subscription-deck"
          className="relative rounded-2xl p-8 md:p-12 overflow-hidden text-center text-white bg-slate-900 shadow-xl select-none"
        >
          {/* Subtle geometric grid background for serious aesthetic appeal */}
          <div className="absolute inset-0 bg-[#111111] opacity-95"></div>
          <div className="absolute inset-0 bg-radial-at-t from-red-950/20 via-transparent to-transparent"></div>

          <div className="relative max-w-2xl mx-auto space-y-5">
            <div className="inline-flex p-3 rounded-full bg-[#B80000]/10 border border-[#B80000]/25 text-[#B80000] mb-2 shadow-inner">
              <Mail size={24} />
            </div>

            <h3 className="text-xl md:text-3xl font-serif font-black tracking-tight uppercase leading-snug">
              Invest In Critical Journalistic Truth
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
              Subscribe to the News Verse VIP Editorial Dispatch.
            </p>

            {newsletterSubscribed ? (
              <div className="bg-[#B80000] text-white py-3.5 px-6 rounded-md font-bold text-xs tracking-wider uppercase animate-bounce">
                Subscription Confirmed! Thank you for backing independent journalism.
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto" id="newsletter-form">
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-grow px-4 py-3 text-xs bg-[#242426] border border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-[#B80000] text-stone-200"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#B80000] hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider rounded-md transition-all cursor-pointer shadow-md"
                >
                  Join Feed
                </button>
              </form>
            )}

            <p className="text-[10px] text-slate-400">
              We respect user privacy configurations. Unsubscribe from dispatches with a single click at any time.
            </p>
          </div>
        </section>

      </main>

      {/* FOOTER SECTION */}
      <footer 
        id="news-verse-footer"
        className={`border-t select-none leading-relaxed transition-colors ${
          isDark ? "bg-[#161618] border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: About News Verse */}
          <div className="space-y-4 text-left">
            <Logo isDark={isDark} hideTagline />
            <p className="text-xs text-justify leading-relaxed">
              News Verse is an elite, independent news organization serving credible regional and global facts. Striving for truth beyond simple headlines, we specialize in political investigations, high-g cricket coaching biometric analyses, eco-adapted climates, andLollywood's visual renaissance.
            </p>
          </div>

          {/* Col 2: Navigation Map */}
          <div className="space-y-3.5 text-left">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#B80000] border-b pb-2">
              Channels Map
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-xs">
              {menuItems.slice(0, 8).map((lnk) => (
                <li key={lnk}>
                  <button
                    onClick={() => {
                      setActiveCategory(lnk);
                      setSearchQuery("");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="hover:text-[#B80000] transition-colors truncate w-full text-left"
                  >
                    &bull; {lnk}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Ethical Guidelines / Policies */}
          <div className="space-y-3.5 text-left">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#B80000] border-b pb-2">
              Regulatory Disclaimers
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => alert("News Verse is committed to the highest standards of journalistic integrity. We protect whistleblowers, verify independent satellite and video dispatches, and maintain complete corporate neutrality across global offices.")} className="hover:text-[#B80000] text-left">
                  Ethical Journalism Charter
                </button>
              </li>
              <li>
                <button onClick={() => alert("Privacy Guard: News Verse collects client logs solely to optimize visual feed performance. No reader records are sold to advertisers or metadata syndicates.")} className="hover:text-[#B80000] text-left">
                  Privacy Policy Code
                </button>
              </li>
              <li>
                <button onClick={() => alert("Terms of Broadcast: Reproduction of News Verse investigative writeups, visual red carpet videos, or SVG assets is permitted solely under Creative Commons license attribution.")} className="hover:text-[#B80000] text-left">
                  Terms & Conditions of Service
                </button>
              </li>
              <li>
                <button onClick={() => alert("Corrections Desk: News Verse maintains an open ledger of factual corrections. If you notice typographical errors or statistical discrepancies, submit a dispatch under Contact immediately.")} className="hover:text-[#B80000] text-left">
                  Factual Corrections Ledger
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Information */}
          <div className="space-y-3.5 text-left">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#B80000] border-b pb-2">
              Desk Contact
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <MapPin size={14} className="text-[#B80000]" />
                <span>Sector G-6, Islamabad, PK</span>
              </li>
              <li className="flex items-start gap-2">
                <Youtube size={14} className="text-[#B80000] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <a 
                    href="http://www.youtube.com/@NewsVerseNetworkNetwork" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-[#B80000] hover:underline font-mono text-[11px] break-all block"
                  >
                    youtube.com/@NewsVerseNetworkNetwork
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-[#B80000]" />
                <span>+92 (051) 921-NEWS</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-[#B80000]" />
                <span>news.verse.network@gmail.com</span>
              </li>
            </ul>
            <div className="flex gap-3 pt-2 text-[#B80000]">
              <Facebook size={18} className="cursor-pointer hover:opacity-85" />
              <Twitter size={18} className="cursor-pointer hover:opacity-85" />
              <Instagram size={18} className="cursor-pointer hover:opacity-85" />
              <a href="http://www.youtube.com/@NewsVerseNetworkNetwork" target="_blank" rel="noreferrer" title="YouTube Channel">
                <Youtube size={18} className="cursor-pointer hover:opacity-85" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright segment */}
        <div className={`py-6 text-center text-[11px] font-mono border-t select-none ${
          isDark ? "bg-[#111112] border-slate-800" : "bg-slate-100 border-slate-200"
        }`}>
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="opacity-75">
              &copy; {new Date().getFullYear()} News Verse Group Corp. All corporate rights reserved.
            </span>
            <span className="flex items-center gap-1.5 opacity-65">
              Made with <Heart size={10} className="text-[#B80000] fill-[#B80000] animate-pulse" /> for elite international dispatches &bull; v2.4.0
            </span>
          </div>
        </div>
      </footer>



      {/* THE FLOATING DETAILED ARTICLE MODAL PORTAL */}
      {selectedArticle && (
        <ArticleModal 
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          isDark={isDark}
        />
      )}
    </div>
  );
}
