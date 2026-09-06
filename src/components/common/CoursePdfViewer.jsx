import { useState, useEffect, useMemo, useRef } from "react";
import {
  FileText,
  Download,
  ExternalLink,
  Maximize2,
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { getOptimizedPdfUrl } from "../../utils/PdfUploadApi";

const STORAGE_KEY = "cha_pdf_progress";

function getPdfProgress(pdfUrl) {
  if (typeof window === "undefined" || !pdfUrl) return {};
  try {
    const saved = window.localStorage.getItem(`${STORAGE_KEY}_${pdfUrl}`);
    if (!saved) return {};
    return JSON.parse(saved);
  } catch {
    return {};
  }
}

function savePdfProgress(pdfUrl, progress) {
  if (typeof window === "undefined" || !pdfUrl) return;
  try {
    window.localStorage.setItem(`${STORAGE_KEY}_${pdfUrl}`, JSON.stringify(progress));
  } catch {
    // ignore quota errors
  }
}

export default function CoursePdfViewer({
  pdfUrl,
  title = "Course Document",
  version = "Student Edition",
  courseName = "Creators Hub Academy",
  lessonTitle = "",
  moduleNumber = 1,
  lessonNumber = 1,
  duration = "",
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 0;
  const [zoom, setZoom] = useState(100);
  const iframeRef = useRef(null);
  const [optimizedPdfUrl, setOptimizedPdfUrl] = useState(null);

  const normalizedPdfUrl = useMemo(() => {
    if (!pdfUrl) return null;
    if (pdfUrl.startsWith("http")) return pdfUrl;
    const base = import.meta.env.VITE_BASE_URL || "";
    return `${base}${pdfUrl.startsWith("/") ? "" : "/"}${pdfUrl}`;
  }, [pdfUrl]);

  const displayUrl = optimizedPdfUrl || normalizedPdfUrl;

  const canPreview = Boolean(
    displayUrl &&
      (displayUrl.startsWith("http") || displayUrl.startsWith("/uploads/"))
  );

  useEffect(() => {
    setPdfLoading(true);
    setPdfError(false);
    setCurrentPage(1);
    setOptimizedPdfUrl(null);
  }, [pdfUrl]);

  useEffect(() => {
    if (!pdfUrl || pdfUrl.startsWith("http")) return;
    getOptimizedPdfUrl(pdfUrl).then(setOptimizedPdfUrl).catch(() => {});
  }, [pdfUrl]);

  useEffect(() => {
    if (!pdfUrl) return;
    const saved = getPdfProgress(pdfUrl);
    if (saved.page) setCurrentPage(saved.page);
    if (saved.zoom) setZoom(saved.zoom);
  }, [pdfUrl]);

  useEffect(() => {
    if (!pdfUrl) return;
    savePdfProgress(pdfUrl, { page: currentPage, zoom });
  }, [currentPage, zoom, pdfUrl]);

  const handleIframeLoad = () => {
    setPdfLoading(false);
  };

  const handleIframeError = () => {
    setPdfLoading(false);
    setPdfError(true);
  };

  const goPrev = () => {
    setCurrentPage((p) => Math.max(1, p - 1));
  };
  const goNext = () => {
    setCurrentPage((p) => Math.min(totalPages || p + 1, p + 1));
  };

  const cycleZoom = () => {
    setZoom((z) => {
      const next = [75, 100, 125, 150].find((v) => v > z);
      return next || 75;
    });
  };

  return (
    <section className="w-full max-w-6xl mx-auto my-8 rounded-3xl bg-zinc-900/90 border border-amber-400/15 text-white shadow-2xl backdrop-blur-xl relative overflow-hidden">
      {/* Ambient glows */}
      <div
        className="absolute -top-24 -left-24 w-80 h-80 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute -bottom-24 -right-24 w-80 h-80 bg-amber-300/10 blur-[100px] rounded-full pointer-events-none"
        aria-hidden
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 md:p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-400/15 border border-amber-400/25 text-amber-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-600 text-black">
                {courseName}
              </span>
              <span className="text-xs font-semibold text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> {version}
              </span>
            </div>
            <h3 className="text-base md:text-lg font-bold text-white mt-1">
              {lessonTitle || title}
            </h3>
            <p className="text-[11px] text-neutral-400">
              Module {moduleNumber} • Lesson {lessonNumber}
              {duration ? ` • ${duration}` : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {canPreview && (
            <>
              <button
                onClick={goPrev}
                disabled={currentPage <= 1}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 transition disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[11px] text-neutral-400 min-w-[60px] text-center">
                {currentPage}{totalPages > 0 ? ` / ${totalPages}` : ""}
              </span>
              <button
                onClick={goNext}
                disabled={currentPage >= totalPages && totalPages > 0}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 transition disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={cycleZoom}
                className="px-2.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 text-xs font-semibold transition"
                aria-label="Zoom level"
              >
                {zoom}%
              </button>
            </>
          )}
          <a
            href={displayUrl}
            download
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs transition"
          >
            <Download className="w-3.5 h-3.5" /> Download
          </a>
          <button
            onClick={() => setIsFullscreen(true)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 transition"
            title="Fullscreen"
            aria-label="Open fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PDF Frame */}
      <div className="relative bg-black/60">
        {pdfLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
              <span className="text-xs text-neutral-400">Loading document…</span>
            </div>
          </div>
        )}

        {!canPreview && !pdfError && (
          <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
            <FileText className="w-12 h-12 text-amber-400" />
            <p className="text-neutral-300 text-sm">
              This lesson is available as a downloadable document.
            </p>
            <a
              href={displayUrl}
              download
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-semibold text-sm rounded-xl transition"
            >
              Download PDF
            </a>
          </div>
        )}

        {pdfError && (
          <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
            <div className="text-5xl">📄</div>
            <h4 className="text-lg font-bold text-white">Preview Unavailable</h4>
            <p className="text-neutral-400 text-sm max-w-md">
              The document preview could not be loaded. You can still access it
              through the download button above.
            </p>
          </div>
        )}

        {canPreview && !pdfError && (
          <iframe
            ref={iframeRef}
            src={`${displayUrl}#toolbar=0&navpanes=0&scrollbar=1`}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            title={lessonTitle || title}
            className="w-full bg-white"
            style={{ height: "70vh", transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
          />
        )}
      </div>

      {/* Curriculum pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 border-t border-white/10 text-xs">
        <div className="flex items-center gap-2 text-neutral-300">
          <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>Core Concepts & Workflow</span>
        </div>
        <div className="flex items-center gap-2 text-neutral-300">
          <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>Step-by-Step Practice</span>
        </div>
        <div className="flex items-center gap-2 text-neutral-300">
          <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>Downloadable Reference</span>
        </div>
        <div className="flex items-center gap-2 text-neutral-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Verified Course Material</span>
        </div>
      </div>

      {/* Fullscreen modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-amber-400" />
              <div>
                <h4 className="text-sm font-bold text-white">
                  {lessonTitle || title}
                </h4>
                <p className="text-[11px] text-neutral-400">
                  {courseName} • {version}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {canPreview && (
                <>
                  <button
                    onClick={goPrev}
                    disabled={currentPage <= 1}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition disabled:opacity-40"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] text-neutral-300 min-w-[50px] text-center">
                    {currentPage}
                  </span>
                  <button
                    onClick={goNext}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                aria-label="Exit fullscreen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            {canPreview && !pdfError && (
              <iframe
                src={`${displayUrl}#toolbar=1`}
                className="w-full h-full border-none bg-white"
                title="Fullscreen PDF"
              />
            )}
            {pdfError && (
              <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
                <p className="text-neutral-300">Preview unavailable in fullscreen.</p>
                <a
                  href={displayUrl}
                  download
                  className="px-5 py-2.5 bg-amber-400 text-black font-semibold text-sm rounded-xl"
                >
                  Download PDF
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
