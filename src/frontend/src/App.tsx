import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  CheckCircle,
  Download,
  Film,
  Loader2,
  Play,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Constants ─────────────────────────────────────────────────────────────────
const DEFAULT_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

type CartoonStyle =
  | "Anime"
  | "Comic Book"
  | "Watercolor"
  | "Pixar 3D"
  | "Classic Cartoon";

const STYLE_FILTERS: Record<CartoonStyle, string> = {
  Anime: "contrast(1.4) saturate(2.5) brightness(1.1) hue-rotate(10deg)",
  "Comic Book": "contrast(2) saturate(1.8) brightness(1.05) grayscale(0.2)",
  Watercolor:
    "contrast(0.9) saturate(1.6) brightness(1.15) blur(0.4px) hue-rotate(15deg)",
  "Pixar 3D": "contrast(1.3) saturate(2.2) brightness(1.2) hue-rotate(-5deg)",
  "Classic Cartoon":
    "contrast(1.6) saturate(3) brightness(1.1) hue-rotate(25deg)",
};

const STYLE_GRADIENTS: Record<CartoonStyle, string> = {
  Anime: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  "Comic Book": "linear-gradient(135deg, #ef4444, #f97316)",
  Watercolor: "linear-gradient(135deg, #06b6d4, #3b82f6)",
  "Pixar 3D": "linear-gradient(135deg, #f59e0b, #ec4899)",
  "Classic Cartoon": "linear-gradient(135deg, #10b981, #6366f1)",
};

// ─── Stars Background ─────────────────────────────────────────────────────────
function StarField() {
  const stars = Array.from({ length: 120 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.7 + 0.1,
    animDelay: Math.random() * 4,
  }));

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full star-twinkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            background: "white",
            opacity: s.opacity,
            animationDelay: `${s.animDelay}s`,
          }}
        />
      ))}
      {/* Nebula glow vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, oklch(0.45 0.18 275 / 0.15), transparent 50%), radial-gradient(ellipse at 70% 80%, oklch(0.40 0.20 240 / 0.12), transparent 50%)",
        }}
      />
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header() {
  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: "oklch(0.09 0.035 265 / 0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid oklch(0.22 0.07 265 / 0.8)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm text-white"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.52 0.25 275), oklch(0.65 0.22 255))",
              boxShadow: "0 0 16px oklch(0.52 0.25 275 / 0.5)",
              border: "1px solid oklch(0.55 0.22 255 / 0.6)",
            }}
          >
            AI
          </div>
          <span className="font-display font-bold text-lg text-foreground">
            Cartoon<span className="gradient-text">AI 4K</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {["Home", "Features", "Pricing", "Blog"].map((item) => (
            <button
              key={item}
              type="button"
              className="text-sm transition-colors text-muted-foreground hover:text-foreground"
              data-ocid={`nav.${item.toLowerCase()}.link`}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="text-sm px-4 py-2 rounded-full transition-all text-muted-foreground hover:text-foreground"
            style={{
              border: "1px solid oklch(0.30 0.07 265)",
              background: "oklch(0.14 0.05 265 / 0.6)",
            }}
            data-ocid="nav.download.button"
          >
            <Download className="w-3.5 h-3.5 inline mr-1.5" />
            Download
          </button>
          <button
            type="button"
            className="text-sm px-4 py-2 rounded-full transition-all text-muted-foreground hover:text-foreground"
            style={{
              border: "1px solid oklch(0.30 0.07 265)",
              background: "oklch(0.14 0.05 265 / 0.6)",
            }}
            data-ocid="nav.login.button"
          >
            Login
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── Video Card ───────────────────────────────────────────────────────────────
function VideoCard({
  label,
  videoRef,
  videoSrc,
  filterStyle,
  isCartoon,
  isConverting,
  isDone,
}: {
  label: string;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  videoSrc: string;
  filterStyle?: string;
  isCartoon?: boolean;
  isConverting?: boolean;
  isDone?: boolean;
}) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden flex-1"
      style={{
        background: "oklch(0.13 0.05 265)",
        border: "1px solid oklch(0.22 0.07 265)",
        boxShadow: isCartoon
          ? "0 0 30px oklch(0.52 0.25 275 / 0.3), 0 0 60px oklch(0.52 0.25 275 / 0.1)"
          : "0 0 20px oklch(0.09 0.035 265 / 0.5)",
      }}
      data-ocid={isCartoon ? "cartoon.panel" : "original.panel"}
    >
      {/* Label bar */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{
          background: "oklch(0.11 0.04 265 / 0.9)",
          borderBottom: "1px solid oklch(0.22 0.07 265)",
        }}
      >
        <span
          className="text-xs font-bold tracking-widest uppercase"
          style={{
            color: isCartoon ? "oklch(0.82 0.14 205)" : "oklch(0.70 0.05 265)",
          }}
        >
          {label}
        </span>
        {isCartoon && (
          <div className="flex items-center gap-1.5">
            <Badge
              className="text-[10px] font-bold px-2 py-0.5 border-0"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.52 0.25 275), oklch(0.65 0.22 255))",
                color: "white",
              }}
            >
              4K
            </Badge>
            <Badge
              className="text-[10px] font-bold px-2 py-0.5 border-0"
              style={{
                background: "oklch(0.20 0.07 265)",
                color: "oklch(0.82 0.14 205)",
                border: "1px solid oklch(0.82 0.14 205 / 0.3)",
              }}
            >
              60fps
            </Badge>
          </div>
        )}
      </div>

      {/* Video */}
      <div className="relative" style={{ aspectRatio: "16/9" }}>
        {/* biome-ignore lint/a11y/useMediaCaption: demo video without captions */}
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full h-full object-cover"
          style={{
            filter: filterStyle || "none",
            transition: "filter 0.4s ease",
          }}
          controls
          playsInline
          crossOrigin="anonymous"
        />

        {/* Converting overlay */}
        <AnimatePresence>
          {isConverting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
              style={{ background: "oklch(0.09 0.035 265 / 0.75)" }}
              data-ocid="convert.loading_state"
            >
              <Loader2
                className="w-10 h-10 animate-spin mb-3"
                style={{ color: "oklch(0.82 0.14 205)" }}
              />
              <p className="text-sm font-semibold text-foreground">
                Converting to Cartoon...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Done pulse overlay */}
        <AnimatePresence>
          {isDone && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 0.8, times: [0, 0.3, 1] }}
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, oklch(0.52 0.25 275 / 0.5), transparent 70%)",
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Upload Area ──────────────────────────────────────────────────────────────
function UploadArea({ onFileSelect }: { onFileSelect: (url: string) => void }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("video/")) return;
    const url = URL.createObjectURL(file);
    onFileSelect(url);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-8">
      <label
        htmlFor="video-file-input"
        className="relative rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 cursor-pointer transition-all"
        style={{
          background: isDragOver
            ? "oklch(0.52 0.25 275 / 0.08)"
            : "oklch(0.13 0.05 265 / 0.7)",
          border: `1.5px dashed ${
            isDragOver ? "oklch(0.52 0.25 275 / 0.9)" : "oklch(0.30 0.07 265)"
          }`,
          backdropFilter: "blur(12px)",
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        data-ocid="upload.dropzone"
      >
        <input
          id="video-file-input"
          ref={inputRef}
          type="file"
          accept="video/mp4,video/mov,video/webm,video/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "oklch(0.52 0.25 275 / 0.15)",
              border: "1px solid oklch(0.52 0.25 275 / 0.4)",
            }}
          >
            <Upload
              className="w-5 h-5"
              style={{ color: "oklch(0.72 0.18 275)" }}
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Upload your own video
            </p>
            <p className="text-xs text-muted-foreground">
              Drag &amp; drop MP4, MOV, or WebM — or click to browse
            </p>
          </div>
        </div>
        <span
          className="text-sm font-semibold px-5 py-2 rounded-full flex-shrink-0 transition-all"
          style={{
            background: "oklch(0.22 0.07 265)",
            border: "1px solid oklch(0.52 0.25 275 / 0.5)",
            color: "oklch(0.72 0.18 275)",
          }}
          data-ocid="upload.button"
        >
          Browse Files
        </span>
      </label>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [videoSrc, setVideoSrc] = useState(DEFAULT_VIDEO);
  const [selectedStyle, setSelectedStyle] = useState<CartoonStyle>("Anime");
  const [sharpness, setSharpness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [isConverting, setIsConverting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [doneMsg, setDoneMsg] = useState(false);

  const leftRef = useRef<HTMLVideoElement>(null);
  const rightRef = useRef<HTMLVideoElement>(null);
  const syncingRef = useRef(false);

  // Compute combined filter
  const computedFilter = useCallback(() => {
    const base = STYLE_FILTERS[selectedStyle];
    const c = contrast / 100;
    const s = saturation / 100;
    const sharp = sharpness / 100;
    return `${base} contrast(${c}) saturate(${s}) brightness(${0.95 + sharp * 0.1})`;
  }, [selectedStyle, sharpness, contrast, saturation]);

  // Sync videos — re-bind on mount only; refs are stable
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally re-run when videoSrc changes to re-bind on new elements
  useEffect(() => {
    const left = leftRef.current;
    const right = rightRef.current;
    if (!left || !right) return;

    const onPlay = () => {
      if (syncingRef.current) return;
      syncingRef.current = true;
      right.play().catch(() => {});
      syncingRef.current = false;
    };
    const onPause = () => {
      if (syncingRef.current) return;
      syncingRef.current = true;
      right.pause();
      syncingRef.current = false;
    };
    const onSeeked = () => {
      if (syncingRef.current) return;
      syncingRef.current = true;
      right.currentTime = left.currentTime;
      syncingRef.current = false;
    };

    left.addEventListener("play", onPlay);
    left.addEventListener("pause", onPause);
    left.addEventListener("seeked", onSeeked);

    return () => {
      left.removeEventListener("play", onPlay);
      left.removeEventListener("pause", onPause);
      left.removeEventListener("seeked", onSeeked);
    };
  }, [videoSrc]);

  const handleConvert = () => {
    if (isConverting) return;
    setIsDone(false);
    setDoneMsg(false);
    setIsConverting(true);
    setTimeout(() => {
      setIsConverting(false);
      setIsDone(true);
      setDoneMsg(true);
      setTimeout(() => setIsDone(false), 900);
    }, 2200);
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = videoSrc;
    a.download = "cartoon_4k_video.mp4";
    a.click();
  };

  const handleFileSelect = (url: string) => {
    setVideoSrc(url);
    setDoneMsg(false);
    setIsDone(false);
  };

  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <div className="dark min-h-screen relative">
      <StarField />

      <div className="relative" style={{ zIndex: 1 }}>
        <Header />

        <main>
          {/* ── Hero ── */}
          <section className="pt-16 pb-10 px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-6"
                style={{
                  background: "oklch(0.52 0.25 275 / 0.12)",
                  border: "1px solid oklch(0.52 0.25 275 / 0.35)",
                  color: "oklch(0.72 0.18 275)",
                }}
              >
                <Sparkles className="w-3 h-3" />
                AI-Powered Cartoon Video Conversion
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl leading-tight mb-5"
              >
                Transform Videos to{" "}
                <span className="gradient-text">Stunning Cartoon 4K</span> with
                AI
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base text-muted-foreground max-w-xl mx-auto mb-8"
              >
                Upload any video and watch it transform into a vibrant cartoon
                masterpiece. Choose from 5 unique styles with real-time preview.
              </motion.p>

              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-bold text-base"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.52 0.25 275), oklch(0.65 0.22 255), oklch(0.72 0.20 310))",
                  boxShadow:
                    "0 0 30px oklch(0.52 0.25 275 / 0.5), 0 0 60px oklch(0.52 0.25 275 / 0.2)",
                }}
                data-ocid="hero.primary_button"
                onClick={() =>
                  document
                    .getElementById("preview")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <Zap className="w-4 h-4" />
                Get Started for Free
              </motion.button>
            </div>
          </section>

          {/* ── Upload Area ── */}
          <UploadArea onFileSelect={handleFileSelect} />

          {/* ── Video Preview ── */}
          <section id="preview" className="max-w-7xl mx-auto px-6 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex flex-col lg:flex-row gap-4"
            >
              <VideoCard
                label="ORIGINAL"
                videoRef={leftRef}
                videoSrc={videoSrc}
              />
              <VideoCard
                label="CARTOON 4K"
                videoRef={rightRef}
                videoSrc={videoSrc}
                filterStyle={computedFilter()}
                isCartoon
                isConverting={isConverting}
                isDone={isDone}
              />
            </motion.div>
          </section>

          {/* ── Controls ── */}
          <section className="max-w-7xl mx-auto px-6 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="rounded-2xl p-6 md:p-8"
              style={{
                background: "oklch(0.13 0.05 265 / 0.8)",
                border: "1px solid oklch(0.22 0.07 265)",
                backdropFilter: "blur(16px)",
              }}
            >
              {/* Style Preset */}
              <div className="mb-8">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
                  Style Preset
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(STYLE_FILTERS) as CartoonStyle[]).map(
                    (style) => (
                      <button
                        type="button"
                        key={style}
                        onClick={() => setSelectedStyle(style)}
                        className="text-sm font-semibold px-5 py-2 rounded-full transition-all"
                        style={{
                          background:
                            selectedStyle === style
                              ? STYLE_GRADIENTS[style]
                              : "oklch(0.18 0.06 265)",
                          color:
                            selectedStyle === style
                              ? "white"
                              : "oklch(0.65 0.05 265)",
                          border:
                            selectedStyle === style
                              ? "none"
                              : "1px solid oklch(0.25 0.07 265)",
                          boxShadow:
                            selectedStyle === style
                              ? "0 0 16px oklch(0.52 0.25 275 / 0.4)"
                              : "none",
                          transform:
                            selectedStyle === style
                              ? "scale(1.05)"
                              : "scale(1)",
                        }}
                        data-ocid={`style.${style.toLowerCase().replace(" ", "_")}.toggle`}
                      >
                        {style}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Enhancements */}
              <div className="mb-8">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-5">
                  Enhancements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(
                    [
                      {
                        label: "Sharpness",
                        value: sharpness,
                        setter: setSharpness,
                        key: "sharpness",
                      },
                      {
                        label: "Contrast",
                        value: contrast,
                        setter: setContrast,
                        key: "contrast",
                      },
                      {
                        label: "Saturation",
                        value: saturation,
                        setter: setSaturation,
                        key: "saturation",
                      },
                    ] as const
                  ).map(({ label, value, setter, key }) => (
                    <div key={key}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">
                          {label}
                        </span>
                        <span
                          className="text-sm font-bold"
                          style={{ color: "oklch(0.72 0.18 275)" }}
                        >
                          {value}%
                        </span>
                      </div>
                      <Slider
                        value={[value]}
                        min={0}
                        max={200}
                        step={1}
                        onValueChange={(v) => setter(v[0])}
                        data-ocid={`enhancement.${key}.input`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <motion.button
                  type="button"
                  whileHover={{
                    scale: 1.02,
                    boxShadow:
                      "0 0 40px oklch(0.52 0.25 275 / 0.7), 0 0 80px oklch(0.52 0.25 275 / 0.3)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleConvert}
                  disabled={isConverting}
                  className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-white font-bold text-sm tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.52 0.25 275), oklch(0.65 0.22 255), oklch(0.72 0.20 310))",
                    boxShadow:
                      "0 0 25px oklch(0.52 0.25 275 / 0.5), 0 0 50px oklch(0.52 0.25 275 / 0.2)",
                  }}
                  data-ocid="convert.primary_button"
                >
                  {isConverting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <Film className="w-4 h-4" />
                      Convert to Cartoon →
                    </>
                  )}
                </motion.button>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: "oklch(0.18 0.06 265)",
                    border: "1px solid oklch(0.52 0.25 275 / 0.4)",
                    color: "oklch(0.72 0.18 275)",
                  }}
                  data-ocid="download.button"
                >
                  <Download className="w-4 h-4" />
                  Download Video
                </button>

                <AnimatePresence>
                  {doneMsg && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-sm font-semibold"
                      style={{ color: "oklch(0.72 0.22 155)" }}
                      data-ocid="convert.success_state"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Done! 4K Cartoon Ready
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </section>

          {/* ── Features Grid ── */}
          <section className="max-w-7xl mx-auto px-6 pb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <p
                className="text-xs font-bold tracking-widest uppercase mb-3"
                style={{ color: "oklch(0.72 0.18 275)" }}
              >
                Why CartoonAI 4K
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-extrabold">
                Packed with{" "}
                <span className="gradient-text">Powerful Features</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  icon: Film,
                  title: "5 Cartoon Styles",
                  desc: "Anime, Comic Book, Watercolor, Pixar 3D, and Classic Cartoon — each with unique visual character.",
                  gradient: "oklch(0.52 0.25 275 / 0.2)",
                },
                {
                  icon: Zap,
                  title: "Instant Preview",
                  desc: "CSS filter-based real-time preview lets you see the transformation immediately as you adjust settings.",
                  gradient: "oklch(0.65 0.22 255 / 0.2)",
                },
                {
                  icon: Play,
                  title: "Synchronized Playback",
                  desc: "Both original and cartoon panels play in perfect sync — pause, seek, and scrub together.",
                  gradient: "oklch(0.72 0.20 310 / 0.2)",
                },
                {
                  icon: Upload,
                  title: "Any Video Format",
                  desc: "Upload MP4, MOV, or WebM. The default BigBuckBunny sample loads instantly on first visit.",
                  gradient: "oklch(0.52 0.25 275 / 0.2)",
                },
                {
                  icon: CheckCircle,
                  title: "Enhancement Sliders",
                  desc: "Fine-tune Sharpness, Contrast, and Saturation to perfect your cartoon style.",
                  gradient: "oklch(0.65 0.22 255 / 0.2)",
                },
                {
                  icon: Download,
                  title: "Free Download",
                  desc: "Download your cartoon video directly to your device with one click.",
                  gradient: "oklch(0.72 0.20 310 / 0.2)",
                },
              ].map((feat, i) => (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="p-6 rounded-2xl transition-all"
                  style={{
                    background: "oklch(0.13 0.05 265 / 0.7)",
                    border: "1px solid oklch(0.22 0.07 265)",
                    backdropFilter: "blur(12px)",
                  }}
                  data-ocid={`features.item.${i + 1}`}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background: feat.gradient,
                      border: "1px solid oklch(0.52 0.25 275 / 0.3)",
                    }}
                  >
                    <feat.icon
                      className="w-5 h-5"
                      style={{ color: "oklch(0.72 0.18 275)" }}
                    />
                  </div>
                  <h3 className="font-display font-bold text-base text-foreground mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feat.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>
        </main>

        {/* ── Footer ── */}
        <footer
          className="py-10 px-6 text-center"
          style={{
            borderTop: "1px solid oklch(0.22 0.07 265)",
            background: "oklch(0.09 0.035 265 / 0.95)",
          }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-left">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.52 0.25 275), oklch(0.65 0.22 255))",
                    }}
                  >
                    AI
                  </div>
                  <span className="font-display font-bold text-foreground">
                    Cartoon<span className="gradient-text">AI 4K</span>
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Transform any video into stunning 4K cartoon art with
                  AI-powered style presets.
                </p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
                  Product
                </h4>
                <ul className="space-y-1.5">
                  {["Features", "Pricing", "Blog", "Changelog"].map((item) => (
                    <li key={item}>
                      <button
                        type="button"
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
                  Support
                </h4>
                <ul className="space-y-1.5">
                  {[
                    "Documentation",
                    "Contact",
                    "Privacy Policy",
                    "Terms of Service",
                  ].map((item) => (
                    <li key={item}>
                      <button
                        type="button"
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div
              className="pt-6 text-xs text-muted-foreground"
              style={{ borderTop: "1px solid oklch(0.22 0.07 265)" }}
            >
              © {year}. Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
