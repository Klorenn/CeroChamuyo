"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { CheckCircle, Wine, ExternalLink, Star, ChevronDown, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  RedWineGlass,
  WhiteWineGlass,
  RoseWineGlass,
  SparklingWineGlass,
} from "@/components/wine-glasses"
import { useFreighter } from "@/hooks/useFreighter"
import { config } from "@/lib/stellar"
import { buildLeaveReviewTx, submitSignedTransaction, formatAddress, getAllWineStats, getRecentReviews } from "@/lib/contract"

interface OnChainReview {
  wine_id: number;
  score: number;
  ia_notes: string;
  tx_hash: string;
  ledger: number;
}

interface WineData {
  wine_id: number;
  name: string;
  vintage: number | string;
  region: string;
  country: string;
  country_code: string;
  grapes: string[];
  type: string;
  category: string;
  winery: string;
  reference_score: number;
  reference_source: string;
  on_chain_stats: { total_score: number; review_count: number; average: number } | null;
}

interface OnChainReviewWithWine extends OnChainReview {
  wine_name: string;
  wine_region: string;
  wine_variety: string;
  wine_vintage: number | string;
  wine_winery: string;
}

const winesData: WineData[] = [
  { wine_id: 1, name: "Nicolas Catena Zapata", vintage: 2020, region: "Valle de Uco", country: "Argentina", country_code: "AR", grapes: ["Cabernet Sauvignon", "Malbec"], type: "Red", category: "icon", winery: "Catena Zapata", reference_score: 96, reference_source: "Wine Advocate", on_chain_stats: null },
  { wine_id: 2, name: "Finca Piedra Infinita", vintage: 2021, region: "Paraje Altamira", country: "Argentina", country_code: "AR", grapes: ["Malbec"], type: "Red", category: "icon", winery: "Zuccardi", reference_score: 97, reference_source: "Tim Atkin MW", on_chain_stats: null },
  { wine_id: 3, name: "Gran Enemigo Gualtallary", vintage: 2020, region: "Gualtallary", country: "Argentina", country_code: "AR", grapes: ["Cabernet Franc"], type: "Red", category: "icon", winery: "El Enemigo", reference_score: 97, reference_source: "James Suckling", on_chain_stats: null },
  { wine_id: 4, name: "Vina Cobos Chanares", vintage: 2019, region: "Valle de Uco", country: "Argentina", country_code: "AR", grapes: ["Malbec"], type: "Red", category: "icon", winery: "Vina Cobos", reference_score: 95, reference_source: "Wine Spectator", on_chain_stats: null },
  { wine_id: 5, name: "Cheval des Andes", vintage: 2018, region: "Las Compuertas", country: "Argentina", country_code: "AR", grapes: ["Cabernet Sauvignon", "Malbec"], type: "Red", category: "icon", winery: "Terrazas / Cheval Blanc", reference_score: 96, reference_source: "Decanter", on_chain_stats: null },
  { wine_id: 6, name: "Felipe Rutini", vintage: 2019, region: "Valle de Uco", country: "Argentina", country_code: "AR", grapes: ["Cabernet Sauvignon", "Merlot", "Malbec"], type: "Red", category: "icon", winery: "Rutini Wines", reference_score: 95, reference_source: "Descorchados", on_chain_stats: null },
  { wine_id: 7, name: "Luigi Bosca De Sangre", vintage: 2021, region: "Lujan de Cuyo", country: "Argentina", country_code: "AR", grapes: ["Malbec"], type: "Red", category: "premium", winery: "Luigi Bosca", reference_score: 93, reference_source: "Wine Advocate", on_chain_stats: null },
  { wine_id: 8, name: "D.V. Catena", vintage: 2020, region: "Valle de Uco", country: "Argentina", country_code: "AR", grapes: ["Cabernet Sauvignon", "Malbec"], type: "Red", category: "premium", winery: "Catena Zapata", reference_score: 94, reference_source: "James Suckling", on_chain_stats: null },
  { wine_id: 9, name: "Numina", vintage: 2021, region: "Valle de Uco", country: "Argentina", country_code: "AR", grapes: ["Cabernet Sauvignon", "Malbec", "Cabernet Franc"], type: "Red", category: "premium", winery: "Salentein", reference_score: 93, reference_source: "Descorchados", on_chain_stats: null },
  { wine_id: 10, name: "Gran Dante", vintage: 2020, region: "Lujan de Cuyo", country: "Argentina", country_code: "AR", grapes: ["Malbec"], type: "Red", category: "premium", winery: "Dante Robino", reference_score: 92, reference_source: "Tim Atkin MW", on_chain_stats: null },
  { wine_id: 11, name: "Bramare", vintage: 2020, region: "Valle de Uco", country: "Argentina", country_code: "AR", grapes: ["Malbec"], type: "Red", category: "premium", winery: "Vina Cobos", reference_score: 93, reference_source: "Wine Spectator", on_chain_stats: null },
  { wine_id: 12, name: "Lote 51 Malbec", vintage: 2021, region: "Lujan de Cuyo", country: "Argentina", country_code: "AR", grapes: ["Malbec"], type: "Red", category: "premium", winery: "Norton", reference_score: 91, reference_source: "Descorchados", on_chain_stats: null },
  { wine_id: 13, name: "Trumpeter", vintage: 2021, region: "Valle de Uco", country: "Argentina", country_code: "AR", grapes: ["Malbec"], type: "Red", category: "classic", winery: "Rutini Wines", reference_score: 89, reference_source: "Wine Enthusiast", on_chain_stats: null },
  { wine_id: 14, name: "Terrazas Reserva Malbec", vintage: 2021, region: "Valle de Uco", country: "Argentina", country_code: "AR", grapes: ["Malbec"], type: "Red", category: "classic", winery: "Terrazas de los Andes", reference_score: 90, reference_source: "James Suckling", on_chain_stats: null },
  { wine_id: 15, name: "Terrazas Reserva Chardonnay", vintage: 2022, region: "Valle de Uco", country: "Argentina", country_code: "AR", grapes: ["Chardonnay"], type: "White", category: "classic", winery: "Terrazas de los Andes", reference_score: 89, reference_source: "Decanter", on_chain_stats: null },
  { wine_id: 16, name: "Alamos Malbec", vintage: 2021, region: "Mendoza", country: "Argentina", country_code: "AR", grapes: ["Malbec"], type: "Red", category: "classic", winery: "Alamos (Catena)", reference_score: 87, reference_source: "Wine Enthusiast", on_chain_stats: null },
  { wine_id: 17, name: "Nicasia Red Blend", vintage: 2020, region: "Altamira", country: "Argentina", country_code: "AR", grapes: ["Malbec", "Cabernet Sauvignon", "Cabernet Franc"], type: "Red", category: "classic", winery: "Catena Zapata", reference_score: 91, reference_source: "Wine Advocate", on_chain_stats: null },
  { wine_id: 18, name: "Septima Obra", vintage: 2020, region: "Agrelo", country: "Argentina", country_code: "AR", grapes: ["Malbec"], type: "Red", category: "classic", winery: "Bodega Septima", reference_score: 89, reference_source: "Descorchados", on_chain_stats: null },
  { wine_id: 19, name: "El Esteco Don David Cabernet Sauvignon", vintage: 2020, region: "Mendoza", country: "Argentina", country_code: "AR", grapes: ["Cabernet Sauvignon"], type: "Red", category: "classic", winery: "El Esteco", reference_score: 88, reference_source: "Tim Atkin MW", on_chain_stats: null },
  { wine_id: 20, name: "White Bones Chardonnay", vintage: 2021, region: "Gualtallary", country: "Argentina", country_code: "AR", grapes: ["Chardonnay"], type: "White", category: "white", winery: "Catena Zapata", reference_score: 95, reference_source: "Wine Advocate", on_chain_stats: null },
  { wine_id: 21, name: "White Stones Chardonnay", vintage: 2021, region: "Gualtallary", country: "Argentina", country_code: "AR", grapes: ["Chardonnay"], type: "White", category: "white", winery: "Catena Zapata", reference_score: 96, reference_source: "James Suckling", on_chain_stats: null },
  { wine_id: 22, name: "Zuccardi Poligonos Verdejo", vintage: 2022, region: "Valle de Uco", country: "Argentina", country_code: "AR", grapes: ["Verdejo"], type: "White", category: "white", winery: "Zuccardi", reference_score: 92, reference_source: "Descorchados", on_chain_stats: null },
  { wine_id: 23, name: "Zuccardi Poligonos Semillon", vintage: 2021, region: "Valle de Uco", country: "Argentina", country_code: "AR", grapes: ["Semillon"], type: "White", category: "white", winery: "Zuccardi", reference_score: 93, reference_source: "Tim Atkin MW", on_chain_stats: null },
  { wine_id: 24, name: "Lagarde Goes Pink", vintage: 2022, region: "Lujan de Cuyo", country: "Argentina", country_code: "AR", grapes: ["Malbec", "Pinot Noir"], type: "Rose", category: "white", winery: "Lagarde", reference_score: 89, reference_source: "Descorchados", on_chain_stats: null },
  { wine_id: 25, name: "Susana Balbo Signature White Blend", vintage: 2022, region: "Valle de Uco", country: "Argentina", country_code: "AR", grapes: ["Torrontes", "Riesling", "Viognier"], type: "White", category: "white", winery: "Susana Balbo", reference_score: 91, reference_source: "Wine Spectator", on_chain_stats: null },
  { wine_id: 26, name: "Chandon Extra Brut", vintage: "NV", region: "Mendoza", country: "Argentina", country_code: "AR", grapes: ["Chardonnay", "Pinot Noir"], type: "Sparkling", category: "sparkling", winery: "Chandon", reference_score: 87, reference_source: "Descorchados", on_chain_stats: null },
  { wine_id: 27, name: "Chandon Methode Traditionnelle Extra Brut", vintage: 2019, region: "Mendoza", country: "Argentina", country_code: "AR", grapes: ["Chardonnay", "Pinot Noir"], type: "Sparkling", category: "sparkling", winery: "Chandon", reference_score: 90, reference_source: "Tim Atkin MW", on_chain_stats: null },
  { wine_id: 28, name: "Alyda Van Dulken", vintage: 2018, region: "Valle de Uco", country: "Argentina", country_code: "AR", grapes: ["Chardonnay", "Pinot Noir"], type: "Sparkling", category: "sparkling", winery: "Salentein", reference_score: 92, reference_source: "Descorchados", on_chain_stats: null },
  { wine_id: 29, name: "Cruzat Rose", vintage: "NV", region: "Mendoza", country: "Argentina", country_code: "AR", grapes: ["Pinot Noir"], type: "Sparkling", category: "sparkling", winery: "Cruzat", reference_score: 88, reference_source: "Wine Enthusiast", on_chain_stats: null },
];

function formatTxHash(hash: string): string {
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

const wineGlasses = [
  { component: RedWineGlass, name: "Malbec", description: "La cepa estrella" },
  { component: RedWineGlass, name: "Cabernet Franc", description: "Frescura herbal" },
  { component: WhiteWineGlass, name: "Chardonnay", description: "Blanco de altura" },
  { component: WhiteWineGlass, name: "Torrontes", description: "Floral intenso" },
  { component: RoseWineGlass, name: "Rosado", description: "Consumo joven" },
  { component: SparklingWineGlass, name: "Espumante", description: "Metodo tradicional" },
]

// Hook for scroll animations
function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}

// Animated section component
function AnimatedSection({ 
  children, 
  className = "",
  animation = "fade-up",
  delay = ""
}: { 
  children: React.ReactNode
  className?: string
  animation?: "fade-up" | "fade-in" | "slide-left" | "slide-right" | "scale-in"
  delay?: string
}) {
  const { ref, isVisible } = useScrollAnimation()
  
  return (
    <div 
      ref={ref}
      className={`animate-on-scroll animate-${animation} ${delay} ${isVisible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </div>
  )
}

export default function HomePage() {
  const { connected, address, isLoading, connect, disconnect, sign, checkConnection } = useFreighter();
  const [review, setReview] = useState("")
  const [selectedWine, setSelectedWine] = useState<number>(1)
  const [score, setScore] = useState<number>(5)
  const [currentWineIndex, setCurrentWineIndex] = useState(0)
  const [headerVisible, setHeaderVisible] = useState(false)
  const [txStatus, setTxStatus] = useState<"idle" | "building" | "signing" | "submitting" | "success" | "error">("idle")
  const [txHash, setTxHash] = useState<string | null>(null)
  const [txError, setTxError] = useState<string | null>(null)
  const [wineStats, setWineStats] = useState<Map<number, { totalScore: number; reviewCount: number; average: number }>>(new Map())
  const [recentReviews, setRecentReviews] = useState<OnChainReview[]>([])
  const [loadingData, setLoadingData] = useState(false)

  useEffect(() => {
    setHeaderVisible(true)
    const interval = setInterval(() => {
      setCurrentWineIndex((prev) => (prev + 1) % wineGlasses.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const loadOnChainData = useCallback(async () => {
    setLoadingData(true);
    try {
      const wineIds = winesData.map(w => w.wine_id);
      const stats = await getAllWineStats(wineIds);
      setWineStats(stats);
      
      const reviews = await getRecentReviews(10);
      setRecentReviews(reviews);
    } catch (error) {
      console.error("Error loading on-chain data:", error);
    }
    setLoadingData(false);
  }, []);

  useEffect(() => {
    loadOnChainData();
  }, [loadOnChainData])

  const handleConnect = async () => {
    if (connected) {
      disconnect();
    } else {
      try {
        await connect();
      } catch (error) {
        console.error("Failed to connect:", error);
      }
    }
  }

  const analyzeWithAI = useCallback((text: string): string => {
    const lowerText = text.toLowerCase();
    let analysis = "";
    
    if (lowerText.includes("excelente") || lowerText.includes("increible") || lowerText.includes("espectacular")) {
      analysis = "Vino de calidad excepcional con caracter distintivo. ";
    } else if (lowerText.includes("bueno") || lowerText.includes("muy bueno") || lowerText.includes("recomendable")) {
      analysis = "Vino correcto con buenas caracteristicas. ";
    } else if (lowerText.includes("regular") || lowerText.includes("normal") || lowerText.includes("aceptable")) {
      analysis = "Vino con perfil basico pero agradable. ";
    } else if (lowerText.includes("malo") || lowerText.includes("terrible") || lowerText.includes("desilusionante")) {
      analysis = "Vino que no cumple expectativas. ";
    }
    
    if (lowerText.includes("fruta") || lowerText.includes("aromas") || lowerText.includes("sabores")) {
      analysis += "Presencia notable de frutas y complejidad aromatica. ";
    }
    if (lowerText.includes("tanino") || lowerText.includes("taninos") || lowerText.includes("astringente")) {
      analysis += "Estructura tannica marcada. ";
    }
    if (lowerText.includes("acidez") || lowerText.includes("acido") || lowerText.includes("fresco")) {
      analysis += "Acidez bien equilibrada. ";
    }
    if (lowerText.includes("roble") || lowerText.includes("barrrica") || lowerText.includes("vanilla") || lowerText.includes("tostado")) {
      analysis += "Influencia de madera bien integrada. ";
    }
    
    if (!analysis) {
      analysis = "Vino con identidad propia. ";
    }
    
    analysis += `"${text.slice(0, 50)}${text.length > 50 ? "..." : ""}"`;
    
    return analysis;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!review.trim() || !connected || !address) return;

    setTxStatus("building");
    setTxError(null);
    setTxHash(null);

    try {
      const iaNotes = analyzeWithAI(review);
      setTxStatus("signing");
      
      const xdr = await buildLeaveReviewTx(address, selectedWine, score, iaNotes);
      const signedXdr = await sign(xdr, config.networkPassphrase);
      
      setTxStatus("submitting");
      const result = await submitSignedTransaction(signedXdr);
      
      setTxHash(result.stellarExpertUrl);
      setTxStatus("success");
      setReview("");
      setScore(5);
      await checkConnection();
      
      await loadOnChainData();
      
      setTimeout(() => {
        setTxStatus("idle");
        setTxHash(null);
      }, 5000);
    } catch (error) {
      console.error("Transaction failed:", error);
      setTxError(error instanceof Error ? error.message : "Transaction failed");
      setTxStatus("error");
      setTimeout(() => setTxStatus("idle"), 5000);
    }
  }

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  const getStatusMessage = () => {
    switch (txStatus) {
      case "building": return "Construyendo transaccion...";
      case "signing": return "Esperando firma en Freighter...";
      case "submitting": return "Enviando a la red Stellar...";
      case "success": return "Reseña sellada exitosamente!";
      case "error": return txError || "Error en la transaccion";
      default: return null;
    }
  }

  return (
    <div
      className="min-h-screen bg-background"
      style={{ minHeight: "100vh", backgroundColor: "oklch(0.98 0.002 75)" }}
    >
      {/* Navigation */}
      <nav
        className={`flex items-center justify-between px-6 py-8 md:px-12 lg:px-24 transition-all duration-1000 ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div className="flex flex-col" style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <span className="font-serif text-2xl md:text-3xl italic tracking-tight text-foreground">
            Cero Chamuyo
          </span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-0.5">
            vino sin versos
          </span>
        </div>
        <div className="flex items-center gap-6" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection("escribir")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Escribir
            </button>
            <button 
              onClick={() => scrollToSection("muro")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              El Muro
            </button>
            <button 
              onClick={() => scrollToSection("ranking")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Ranking
            </button>
          </nav>
          {isLoading ? (
            <Button
              variant="ghost"
              disabled
              className="text-sm font-normal text-foreground border border-border px-4 py-2"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
            </Button>
          ) : connected && address ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 border border-border rounded-sm">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs font-mono text-muted-foreground">
                  {formatAddress(address)}
                </span>
              </div>
              <Button
                variant="ghost"
                onClick={handleConnect}
                className="text-sm font-normal text-foreground hover:bg-transparent hover:text-muted-foreground border border-border px-4 py-2"
              >
                Desconectar
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              onClick={handleConnect}
              className="text-sm font-normal text-foreground hover:bg-transparent hover:text-muted-foreground border border-border px-4 py-2"
            >
              Conectar Freighter
            </Button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="min-h-[85vh] flex flex-col justify-center px-6 md:px-12 lg:px-24"
        style={{
          minHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
          {/* Wine Glass Carousel */}
          <div
            className={`relative flex flex-col items-center order-2 lg:order-1 lg:ml-6 xl:ml-10 lg:mt-8 transition-all duration-1000 delay-300 ${headerVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}
            style={{ maxWidth: "100%" }}
          >
            <div className="hero-wine-glass-root relative w-64 h-80 md:w-80 md:h-[430px] lg:w-[420px] lg:h-[540px]">
              {wineGlasses.map((wine, index) => {
                const GlassComponent = wine.component
                return (
                  <div
                    key={wine.name}
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${
                      index === currentWineIndex 
                        ? "opacity-100 scale-100" 
                        : "opacity-0 scale-95"
                    }`}
                  >
                    <GlassComponent className="w-full h-full" />
                  </div>
                )
              })}
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm font-medium text-foreground tracking-widest uppercase transition-all duration-300">
                {wineGlasses[currentWineIndex].name}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {wineGlasses[currentWineIndex].description}
              </p>
            </div>
            {/* Carousel indicators */}
            <div className="flex gap-2 mt-3">
              {wineGlasses.map((wine, index) => (
                <button
                  key={wine.name}
                  onClick={() => setCurrentWineIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentWineIndex
                      ? "bg-primary scale-125"
                      : "bg-border hover:bg-muted-foreground"
                  }`}
                  aria-label={`Ver ${wine.name}`}
                />
              ))}
            </div>
          </div>

          {/* Text Content */}
          <div className={`max-w-2xl order-1 lg:order-2 text-center lg:text-left transition-all duration-1000 delay-500 ${headerVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-foreground leading-[1.1] text-balance">
              La verdad del vino, en la blockchain.
            </h1>
            <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Opiniones reales, verificadas con IA y selladas en Stellar.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                onClick={() => scrollToSection("escribir")}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-sm font-medium tracking-wide"
              >
                Escribir reseña
              </Button>
              <Button
                variant="ghost"
                onClick={() => scrollToSection("muro")}
                className="text-foreground hover:bg-transparent hover:text-muted-foreground border border-border px-8 py-3"
              >
                Ver El Muro
              </Button>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className={`flex justify-center mt-16 transition-all duration-1000 delay-700 ${headerVisible ? "opacity-100" : "opacity-0"}`}>
          <button 
            onClick={() => scrollToSection("escribir")}
            className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="text-xs uppercase tracking-widest mb-2">Explorar</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </button>
        </div>
      </section>

      {/* Section: Escribir reseña */}
      <section id="escribir" className="px-6 py-24 md:px-12 lg:px-24">
        <div className="border-t border-border pt-16">
          <AnimatedSection animation="fade-up">
            <div className="text-center mb-16">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">01</span>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground mt-4 mb-4">
                Tu Opinion Cuenta
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Escribe tu reseña honesta y dejala sellada para siempre en la blockchain de Stellar.
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Form */}
            <AnimatedSection animation="slide-left" delay="delay-200">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label
                    htmlFor="wine"
                    className="block text-xs uppercase tracking-widest text-muted-foreground mb-4"
                  >
                    Selecciona el vino
                  </label>
                  <select
                    id="wine"
                    value={selectedWine}
                    onChange={(e) => setSelectedWine(Number(e.target.value))}
                    className="w-full bg-transparent text-foreground text-base border-0 border-b border-border focus:border-foreground focus:outline-none pb-4 transition-colors"
                  >
                    {winesData.map((wine) => (
                      <option key={wine.wine_id} value={wine.wine_id}>
                        {wine.name} ({wine.vintage}) - {wine.winery}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label
                    className="block text-xs uppercase tracking-widest text-muted-foreground mb-4"
                  >
                    Tu puntuacion
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setScore(s)}
                        className="p-2 transition-all hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            s <= score
                              ? "fill-primary text-primary"
                              : "text-border hover:text-primary/50"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-4 text-muted-foreground text-sm">
                      {score}/5
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="review"
                    className="block text-xs uppercase tracking-widest text-muted-foreground mb-4"
                  >
                    Tu opinion honesta {!connected && <span className="normal-case font-normal">(conecta Freighter para publicar)</span>}
                  </label>
                  <textarea
                    id="review"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Contanos que te parecio el vino..."
                    rows={6}
                    className="w-full bg-transparent text-foreground text-base leading-relaxed placeholder:text-muted-foreground/50 border-0 border-b border-border focus:border-foreground focus:outline-none resize-none transition-colors pb-4"
                  />
                </div>
                
                {txStatus !== "idle" && getStatusMessage() && (
                  <div className={`flex items-center gap-3 p-4 rounded-sm ${
                    txStatus === "success" ? "bg-green-500/10 border border-green-500/30" :
                    txStatus === "error" ? "bg-red-500/10 border border-red-500/30" :
                    "bg-muted border border-border"
                  }`}>
                    {txStatus === "success" ? (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : txStatus === "error" ? (
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    ) : (
                      <Loader2 className="w-5 h-5 animate-spin text-primary flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className={`text-sm ${
                        txStatus === "success" ? "text-green-500" :
                        txStatus === "error" ? "text-red-500" :
                        "text-foreground"
                      }`}>
                        {getStatusMessage()}
                      </p>
                      {txHash && (
                        <a
                          href={txHash}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 mt-1"
                        >
                          Ver en Stellar Expert
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={!review.trim() || !connected || txStatus !== "idle"}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-sm font-medium tracking-wide transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {txStatus !== "idle" ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Procesando...
                    </span>
                  ) : (
                    "Sellar en Stellar"
                  )}
                </Button>
                {!connected && (
                  <p className="text-xs text-muted-foreground">
                    Conecta tu wallet Freighter para publicar
                  </p>
                )}
              </form>
            </AnimatedSection>

            {/* Recent Reviews */}
            <AnimatedSection animation="slide-right" delay="delay-300">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground">
                  Reseñas recientes on-chain
                </h3>
                <button
                  onClick={loadOnChainData}
                  disabled={loadingData}
                  className="p-2 hover:bg-muted/50 rounded transition-colors"
                  title="Actualizar datos"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingData ? "animate-spin" : ""}`} />
                </button>
              </div>
              {loadingData ? (
                <div className="py-12 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground text-sm mt-3">Cargando reseñas...</p>
                </div>
              ) : recentReviews.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground text-sm">
                    Aun no hay reseñas on-chain.
                  </p>
                  <p className="text-muted-foreground/60 text-xs mt-2">
                    Conecta tu wallet y se el primero en dejar una reseña.
                  </p>
                </div>
              ) : (
                <div className="space-y-0">
                  {recentReviews.map((review) => {
                    const wine = winesData.find(w => w.wine_id === review.wine_id);
                    if (!wine) return null;
                    return (
                      <article
                        key={review.tx_hash}
                        className="py-6 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors -mx-4 px-4"
                      >
                        <div className="flex items-start gap-3 mb-2">
                          <Wine className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-serif text-lg text-foreground">
                              {wine.name}
                            </h4>
                            <span className="text-xs text-muted-foreground/70">{wine.winery} - {wine.region}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4 pl-7">
                          {review.ia_notes}
                        </p>
                        <div className="flex items-center justify-between pl-7">
                          <div className="flex items-center gap-1 text-sm text-foreground">
                            <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                            <span className="font-medium">{review.score}</span>
                            <span className="text-muted-foreground">/ 5.0</span>
                          </div>
                          <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/70">
                            <CheckCircle className="w-3 h-3 text-primary" />
                            <a
                              href={`https://stellar.expert/explorer/testnet/tx/${review.tx_hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-mono hover:text-foreground transition-colors"
                            >
                              {formatTxHash(review.tx_hash)}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Section: El Muro On-Chain */}
      <section id="muro" className="px-6 py-24 md:px-12 lg:px-24 bg-muted/30">
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">02</span>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mt-4 mb-4">
              El Muro On-Chain
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Reseñas inmutables verificadas por IA. El contraste entre lo que decís y lo que el sommelier detecta.
            </p>
          </div>
        </AnimatedSection>
        
        <div className="max-w-4xl mx-auto">
          {loadingData ? (
            <div className="py-16 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
              <p className="text-muted-foreground text-sm mt-3">Cargando datos on-chain...</p>
            </div>
          ) : recentReviews.length === 0 ? (
            <div className="py-16 text-center">
              <Wine className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">
                No hay reseñas on-chain aun.
              </p>
              <p className="text-muted-foreground/60 text-sm mt-2">
                Los vinos aparecerán aquí cuando alguien deje una reseña.
              </p>
            </div>
          ) : (
            (() => {
              const wineIdsWithReviews = [...new Set(recentReviews.map(r => r.wine_id))];
              const winesWithReviews = wineIdsWithReviews
                .map(id => winesData.find(w => w.wine_id === id))
                .filter((w): w is WineData => w !== undefined)
                .map(wine => {
                  const stats = wineStats.get(wine.wine_id);
                  return {
                    ...wine,
                    stats,
                  };
                })
                .filter(w => w.stats && w.stats.reviewCount > 0)
                .sort((a, b) => (b.stats?.average || 0) - (a.stats?.average || 0));
              
              return winesWithReviews.map((wine, index) => {
                const wineReviews = recentReviews.filter(r => r.wine_id === wine.wine_id);
                const stats = wine.stats!;
                
                return (
                  <AnimatedSection 
                    key={wine.wine_id} 
                    animation="fade-up" 
                    delay={`delay-${(index + 1) * 100}`}
                  >
                    <article className="py-10 border-b border-border group">
                      <div className="flex items-start justify-between mb-8">
                        <div>
                          <h3 className="font-serif text-2xl md:text-3xl text-foreground group-hover:text-primary transition-colors">
                            {wine.name}
                          </h3>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs uppercase tracking-widest text-primary/70">{wine.winery}</span>
                            <span className="text-xs text-muted-foreground/60">|</span>
                            <span className="text-xs text-muted-foreground">{wine.region}</span>
                            <span className="text-xs text-muted-foreground/60">|</span>
                            <span className="text-xs text-muted-foreground">{wine.grapes.join(", ")}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 fill-primary text-primary" />
                          <span className="text-2xl font-serif text-foreground">{stats.average.toFixed(1)}</span>
                          <span className="text-sm text-muted-foreground">/ 5.0</span>
                        </div>
                      </div>
                      
                      {wineReviews.map((review, rIndex) => (
                        <div key={`${review.tx_hash}-${rIndex}`} className={rIndex > 0 ? "mt-6 pt-6 border-t border-border/50" : ""}>
                          <div className="p-6 bg-background rounded-sm border-l-2 border-primary">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs uppercase tracking-widest text-primary/70">
                                Analisis Sommelier IA
                              </span>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
                                <span className="font-mono">{formatTxHash(review.tx_hash)}</span>
                                <a
                                  href={`https://stellar.expert/explorer/testnet/tx/${review.tx_hash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </div>
                            <p className="text-sm text-foreground leading-relaxed">
                              {review.ia_notes}
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground/60">
                        <CheckCircle className="w-3 h-3 text-primary" />
                        <span>{stats.reviewCount} reseña{stats.reviewCount !== 1 ? "s" : ""} verificada{stats.reviewCount !== 1 ? "s" : ""}</span>
                      </div>
                    </article>
                  </AnimatedSection>
                );
              });
            })()
          )}
        </div>
      </section>

      {/* Section: Leaderboard */}
      <section id="ranking" className="px-6 py-24 md:px-12 lg:px-24">
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">03</span>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mt-4 mb-4">
              Ranking Sin Chamuyo
            </h2>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Ranking Inmutable
            </p>
          </div>
        </AnimatedSection>
        
        <div className="max-w-2xl mx-auto">
          {loadingData ? (
            <div className="py-16 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
              <p className="text-muted-foreground text-sm mt-3">Cargando ranking...</p>
            </div>
          ) : wineStats.size === 0 ? (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">
                No hay rankings disponibles.
              </p>
              <p className="text-muted-foreground/60 text-sm mt-2">
                El ranking se genera automaticamente con las resenas on-chain.
              </p>
            </div>
          ) : (
            (() => {
              const leaderboardData = Array.from(wineStats.entries())
                .map(([wineId, stats]) => {
                  const wine = winesData.find(w => w.wine_id === wineId);
                  return wine ? { wineId, wine, stats, score: stats.average } : null;
                })
                .filter((item): item is { wineId: number; wine: WineData; stats: { totalScore: number; reviewCount: number; average: number }; score: number } => item !== null)
                .sort((a, b) => b.score - a.score)
                .map((item, index) => ({ rank: index + 1, ...item }));
              
              return (
                <>
                  <div className="border-y border-border">
                    <div className="hidden md:grid md:grid-cols-[56px_1.8fr_1fr_0.8fr_0.8fr] gap-4 px-4 py-4 text-[11px] uppercase tracking-[0.24em] text-muted-foreground/80 border-b border-border">
                      <span>#</span>
                      <span>Vino</span>
                      <span>Region</span>
                      <span className="text-right">Score</span>
                      <span className="text-right">Reviews</span>
                    </div>

                    {leaderboardData.map((item, index) => (
                      <AnimatedSection
                        key={item.wineId}
                        animation="fade-up"
                        delay={`delay-${(index + 1) * 100}`}
                      >
                        <article
                          className={`grid grid-cols-[44px_1fr_auto] md:grid-cols-[56px_1.8fr_1fr_0.8fr_0.8fr] gap-4 items-center px-4 py-6 border-b border-border/80 transition-colors hover:bg-muted/20 ${
                            item.rank === 1 ? "bg-muted/25" : ""
                          }`}
                        >
                          <span
                            className={`font-serif leading-none ${
                              item.rank === 1 ? "text-5xl text-[#722F37]" : "text-4xl text-muted-foreground/45"
                            }`}
                          >
                            {item.rank}
                          </span>

                          <div className="min-w-0">
                            <h4 className={`font-serif truncate ${item.rank === 1 ? "text-4xl text-[#722F37]" : "text-3xl text-foreground"}`}>
                              {item.wine.name}
                            </h4>
                            <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-primary/70">
                              {item.wine.winery}
                            </p>
                          </div>

                          <p className="hidden md:block text-lg text-foreground/80 truncate">{item.wine.region}</p>

                          <div className="text-right">
                            <p className="font-serif text-4xl text-foreground leading-none">{item.score.toFixed(1)}</p>
                            <p className="text-xs text-muted-foreground mt-1">/5</p>
                          </div>

                          <div className="text-right">
                            <p className="text-3xl font-serif text-foreground leading-none">{item.stats.reviewCount}</p>
                            <p className="text-xs text-muted-foreground mt-1">resenas</p>
                          </div>
                        </article>
                      </AnimatedSection>
                    ))}
                  </div>

                  <AnimatedSection animation="fade-in" delay="delay-600">
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground/70">
                      <p>Puntajes auditados on-chain</p>
                      <p>{wineStats.size} vino{wineStats.size !== 1 ? "s" : ""} con resenas</p>
                    </div>
                  </AnimatedSection>
                </>
              );
            })()
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" aria-hidden />
        <div className="bg-muted/25 px-6 py-14 md:px-12 lg:px-24">
          <AnimatedSection animation="fade-up">
            <div className="max-w-6xl mx-auto">
              <div className="grid gap-12 md:grid-cols-12 md:gap-10 lg:gap-14">
                <div className="md:col-span-5 text-center md:text-left">
                  <span className="font-serif text-2xl italic tracking-tight text-foreground">
                    Cero Chamuyo
                  </span>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground mt-2">
                    vino sin versos
                  </p>
                  <p className="mt-5 text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto md:mx-0">
                    Reseñas de vino auditadas por IA e inmutables en Stellar. Sin chamuyo: solo lo que probaste, sellado on-chain.
                  </p>
                </div>

                <nav
                  className="md:col-span-3 flex flex-col items-center md:items-start gap-3"
                  aria-label="Pie de página"
                >
                  <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80">
                    Secciones
                  </span>
                  <div className="flex flex-col gap-2.5 text-sm">
                    <button
                      type="button"
                      onClick={() => scrollToSection("escribir")}
                      className="text-muted-foreground hover:text-foreground transition-colors text-left"
                    >
                      Escribir reseña
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollToSection("muro")}
                      className="text-muted-foreground hover:text-foreground transition-colors text-left"
                    >
                      El Muro
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollToSection("ranking")}
                      className="text-muted-foreground hover:text-foreground transition-colors text-left"
                    >
                      Ranking
                    </button>
                  </div>
                </nav>

                <div className="md:col-span-4 flex flex-col items-center md:items-end gap-5 text-center md:text-right">
                  <div>
                    <p className="text-xs font-medium text-foreground/90">
                      Stellar blockchain
                    </p>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed max-w-[260px] md:ml-auto">
                      Las reseñas quedan registradas de forma verificable; cada voto es trazable en la red.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-5 gap-y-2 text-xs">
                    <a
                      href="https://x.com/kl0ren"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
                    >
                      X · @kl0ren
                    </a>
                    <a
                      href="https://github.com/Klorenn"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
                    >
                      GitHub · @Klorenn
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-14 pt-8 border-t border-border/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground/80">
                <p>© {new Date().getFullYear()} Cero Chamuyo</p>
                <p className="text-center sm:text-right">Mendoza · Argentina</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </footer>
    </div>
  )
}
