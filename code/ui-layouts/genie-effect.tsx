"use client";
import { useRef, useEffect, useCallback, useState, JSX } from "react";
import { flushSync } from "react-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/magnified-doc";
import {
  type MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { toCanvas } from "html-to-image";

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase = "idle" | "opening" | "open" | "closing";
type Dir = "open" | "minimize";
interface Pt {
  x: number;
  y: number;
}
interface App {
  id: string;
  Icon: React.FC;
  label: string;
  accent: string;
  tb: [string, string];
}

// ─── Constants ────────────────────────────────────────────────────────────────
const WIN_W = 420;
const WIN_H = 330;
const DUR = 500;
// DPR is read lazily inside setupCanvas — never at module scope, which would
// run during SSR and either crash or hardcode a value.

// Magnification config
const ICON_BASE = 50;
const ICON_PEAK = 74;
const MAG_RANGE = 130;

// ─── Math ─────────────────────────────────────────────────────────────────────
const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const eioC = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const eIn2 = (t: number) => t * t;
const eOut2 = (t: number) => 1 - (1 - t) * (1 - t);

// ─── Brand SVG Icons ──────────────────────────────────────────────────────────
// NOTE (filed copy): the six hand-drawn brand icons (Safari, Arc, Trello,
// Dribbble, Command Code, UI Layouts) are several hundred lines of SVG path
// data each in the original paste; they are stock brand artwork, not part of
// the reusable technique. The full original paste is preserved verbatim in
// the chat transcript of 2026-11-03 11:26 PKT. Everything below — the genie
// scanline renderer, the dock magnification, the snapshot pipeline and the
// phase machine — is the complete, runnable logic of the component.

// ─── Apps ─────────────────────────────────────────────────────────────────────
// (Icon fields reference the six brand SVG components noted above.)
const APPS: App[] = [
  { id: "safari", Icon: SafariIcon, label: "Safari", accent: "#1F86F9", tb: ["#0e2238", "#081628"] },
  { id: "arc", Icon: ArcIcon, label: "Arc", accent: "#FF536A", tb: ["#3a1620", "#280f18"] },
  { id: "trello", Icon: TrelloIcon, label: "Trello", accent: "#0052CC", tb: ["#0a1838", "#061026"] },
  { id: "dribbble", Icon: DribbbleIcon, label: "Dribbble", accent: "#EA4C89", tb: ["#3a142e", "#28101f"] },
  { id: "commandcode", Icon: CommandCodeIcon, label: "Command Code", accent: "#FFFFFF", tb: ["#1a1a1a", "#0a0a0a"] },
  { id: "uilayouts", Icon: UILayoutsIcon, label: "UI Layouts", accent: "#1D04FF", tb: ["#0a0838", "#060426"] },
];

// ─── Genie scanline renderer ──────────────────────────────────────────────────
function renderGenie(
  ctx: CanvasRenderingContext2D,
  off: HTMLCanvasElement,
  W: number,
  H: number,
  rawT: number,
  dir: Dir,
  dock: Pt,
  win: Pt,
): void {
  ctx.clearRect(0, 0, W, H);
  for (let y = 0; y < WIN_H; y++) {
    const r = y / WIN_H;
    const rowXStart = dir === "minimize" ? (1 - r) * 0.65 : r * 0.65;
    const xP = clamp((rawT - rowXStart) / (1 - rowXStart), 0, 1);
    const xE = eioC(xP);
    const rowYStart = dir === "minimize" ? (1 - r) * 0.2 : r * 0.2;
    const yP = clamp((rawT - rowYStart) / (1 - rowYStart), 0, 1);
    const yE = eIn2(yP);
    let left: number, right: number, destY: number;
    if (dir === "minimize") {
      left = lerp(win.x, dock.x, xE);
      right = lerp(win.x + WIN_W, dock.x, xE);
      destY = lerp(win.y + y, dock.y, yE);
    } else {
      left = lerp(dock.x, win.x, xE);
      right = lerp(dock.x, win.x + WIN_W, xE);
      destY = lerp(dock.y, win.y + y, yE);
    }
    const rowW = right - left;
    if (rowW < 0.8) continue;
    ctx.drawImage(off, 0, y, WIN_W, 1, left, destY, rowW, 1);
  }
  const glowRaw = dir === "minimize" ? rawT : 1 - rawT;
  if (glowRaw > 0.75) {
    const a = eOut2((glowRaw - 0.75) / 0.25) * 0.3;
    const hex = Math.round(a * 255)
      .toString(16)
      .padStart(2, "0");
    const g = ctx.createRadialGradient(dock.x, dock.y, 0, dock.x, dock.y, 55);
    g.addColorStop(0, "#ffffff" + hex);
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }
}

// ─── Window content components ────────────────────────────────────────────────
// Six fake app windows (SafariContent, ArcContent, TrelloContent,
// DribbbleContent, CommandCodeContent, UILayoutsContent): static Tailwind
// mock UIs ~90 lines each in the original paste (browser chrome, kanban
// board, shot grid, terminal, template gallery). Demo content, not technique;
// structure recorded here, full text in the 2026-11-03 11:26 chat transcript.
const WindowContent: Record<string, () => JSX.Element> = {
  safari: SafariContent,
  arc: ArcContent,
  trello: TrelloContent,
  dribbble: DribbbleContent,
  commandcode: CommandCodeContent,
  uilayouts: UILayoutsContent,
};

// ─── Mac window wrapper ───────────────────────────────────────────────────────
const MacWindow = ({
  app,
  winPos,
  onClose,
  domRef,
}: {
  app: App;
  winPos: Pt;
  onClose: () => void;
  domRef: React.RefCallback<HTMLDivElement>;
}) => {
  const Content = WindowContent[app.id];
  return (
    <div
      ref={domRef}
      className="absolute flex flex-col overflow-hidden"
      style={{
        width: WIN_W,
        height: WIN_H,
        left: winPos.x,
        top: winPos.y,
        borderRadius: 13,
        background: "#1e1e1e",
        zIndex: 40,
        boxShadow:
          "0 32px 80px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.07)",
      }}
    >
      <div
        className="flex items-center px-4 shrink-0 relative"
        style={{
          height: 42,
          background: `linear-gradient(180deg,${app.tb[0]},${app.tb[1]})`,
          borderBottom: "1px solid rgba(0,0,0,.45)",
        }}
      >
        <div className="flex items-center gap-2 z-10">
          <button
            onClick={onClose}
            className="w-3.5 h-3.5 rounded-full border-none cursor-pointer hover:brightness-90 transition-all"
            style={{ background: "#ff5f57", boxShadow: "0 0 0 0.5px #e0443e" }}
          />
          <button
            onClick={onClose}
            className="w-3.5 h-3.5 rounded-full border-none cursor-pointer hover:brightness-90 transition-all"
            style={{ background: "#febc2e", boxShadow: "0 0 0 0.5px #d4a017" }}
          />
          <div
            className="w-3.5 h-3.5 rounded-full"
            style={{ background: "#28c840", boxShadow: "0 0 0 0.5px #1aab29" }}
          />
        </div>
        <span
          className="absolute inset-x-0 text-center text-xs font-medium pointer-events-none"
          style={{ color: "rgba(255,255,255,.5)" }}
        >
          {app.label}
        </span>
      </div>
      <div
        className="flex-1 overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
      >
        <Content />
      </div>
    </div>
  );
};

// ─── Magnified Dock Icon ──────────────────────────────────────────────────────
// Uses motion's useSpring/useTransform — floating-point precision can differ
// between Node (server) and V8 (client), causing hydration mismatches, so
// this only renders client-side via the `mounted` flag in <GenieEffect>.
function MagnifiedDockIcon({
  app,
  isActive,
  showDot,
  disabled,
  btnRef,
  onClick,
  mouseX,
}: {
  app: App;
  isActive: boolean;
  showDot: boolean;
  disabled: boolean;
  btnRef: (el: HTMLButtonElement | null) => void;
  onClick: () => void;
  mouseX: MotionValue<number>;
}) {
  const localRef = useRef<HTMLButtonElement>(null);
  const setRefs = useCallback(
    (el: HTMLButtonElement | null) => {
      localRef.current = el;
      btnRef(el);
    },
    [btnRef],
  );

  const distance = useTransform(mouseX, (val) => {
    const bounds = localRef.current?.getBoundingClientRect() ?? {
      x: 0,
      width: 0,
    };
    return val - bounds.x - bounds.width / 2;
  });

  const sizeSync = useTransform(
    distance,
    [-MAG_RANGE, 0, MAG_RANGE],
    [ICON_BASE, ICON_PEAK, ICON_BASE],
  );
  const size = useSpring(sizeSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const innerSize = useTransform(size, (s) => s * 0.86);

  const Icon = app.Icon;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          ref={setRefs}
          onClick={onClick}
          disabled={disabled}
          style={{
            width: size,
            height: size,
            background: isActive ? `${app.accent}28` : "transparent",
            cursor: disabled ? "default" : "pointer",
          }}
          className="relative flex items-center justify-center rounded-xl border-none"
        >
          <motion.div
            style={{
              width: innerSize,
              height: innerSize,
              filter: isActive
                ? `drop-shadow(0 4px 12px ${app.accent}99)`
                : "drop-shadow(0 2px 4px rgba(0,0,0,.4))",
              pointerEvents: "none",
            }}
            className="block"
          >
            <Icon />
          </motion.div>
          {showDot && (
            <div
              className="absolute -bottom-1 w-1 h-1 rounded-full"
              style={{ background: "rgba(255,255,255,.75)" }}
            />
          )}
        </motion.button>
      </TooltipTrigger>
      <TooltipContent className="py-1 px-3 rounded-md" sideOffset={10}>
        <p className="text-xs text-primary">{app.label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

// ─── Snapshot Stage ───────────────────────────────────────────────────────────
// Renders independently of the main component's render cycle. Captures all
// six MacWindow textures in parallel, only after the page has painted
// (idle callback), so first paint/interaction are never blocked.
function SnapshotStage({
  onReady,
}: {
  onReady: (canvases: HTMLCanvasElement[]) => void;
}) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        await new Promise((r) => requestAnimationFrame(() => r(null)));
        if (cancelled) return;

        const canvases = await Promise.all(
          refs.current
            .filter((n): n is HTMLDivElement => n !== null)
            .map((node) =>
              toCanvas(node, { pixelRatio: 1, cacheBust: false }),
            ),
        );
        if (cancelled) return;
        onReady(canvases);
      } catch (err) {
        console.error("Genie snapshot failed:", err);
        if (!cancelled) onReady([]);
      }
    };

    const ric =
      (window as unknown as { requestIdleCallback?: (cb: () => void) => number })
        .requestIdleCallback;
    const cic =
      (window as unknown as { cancelIdleCallback?: (h: number) => void })
        .cancelIdleCallback;
    let handle: number;
    if (typeof ric === "function") {
      handle = ric(run);
    } else {
      handle = window.setTimeout(run, 50);
    }

    return () => {
      cancelled = true;
      if (typeof cic === "function") cic(handle);
      else clearTimeout(handle);
    };
  }, [onReady]);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        left: -10000,
        top: 0,
        pointerEvents: "none",
      }}
    >
      {APPS.map((a, i) => (
        <div
          key={a.id}
          style={{
            position: "relative",
            width: WIN_W,
            height: WIN_H,
            marginBottom: 20,
          }}
        >
          <MacWindow
            app={a}
            winPos={{ x: 0, y: 0 }}
            onClose={() => {}}
            domRef={(el) => {
              refs.current[i] = el;
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function GenieEffect() {
  // `mounted` is the SSR-safety gate: server renders mounted=false, matching
  // the first client render; the effect flips it and the motion-using bits
  // mount. No floating-point divergence, no hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [phase, setPhase] = useState<Phase>("idle");
  const [activeApp, setActiveApp] = useState<number | null>(null);
  const [winPos, setWinPos] = useState<Pt>({ x: 0, y: 0 });
  const [snapshotsReady, setSnapshotsReady] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  // containerRef is the source of truth for layout coordinates: all
  // positioning math reads from this rect instead of window.innerWidth/
  // Height, so the component drops into any sized parent and centers there.
  const containerRef = useRef<HTMLDivElement>(null);
  const dockRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const windowRef = useRef<HTMLDivElement | null>(null);
  const offRef = useRef<HTMLCanvasElement[]>([]);
  const rafRef = useRef<number>(0);
  const stateRef = useRef<{ phase: Phase; activeApp: number | null }>({
    phase: "idle",
    activeApp: null,
  });

  const mouseX = useMotionValue(Infinity);

  const handleSnapshotsReady = useCallback((canvases: HTMLCanvasElement[]) => {
    offRef.current = canvases;
    setSnapshotsReady(true);
  }, []);

  const getContainerSize = useCallback((): { w: number; h: number } => {
    const el = containerRef.current;
    if (!el) return { w: window.innerWidth, h: window.innerHeight };
    return { w: el.clientWidth, h: el.clientHeight };
  }, []);

  const getWinPos = useCallback((): Pt => {
    const { w, h } = getContainerSize();
    return {
      x: (w - WIN_W) / 2,
      y: (h - WIN_H) / 2 - 20,
    };
  }, [getContainerSize]);

  // Dock-button center in CONTAINER-LOCAL coords (the genie canvas draws in
  // container-local coords too, so these match).
  const getDockCenter = useCallback((idx: number): Pt => {
    const btn = dockRefs.current[idx];
    const cont = containerRef.current;
    if (!btn || !cont) return { x: 0, y: 0 };
    const b = btn.getBoundingClientRect();
    const c = cont.getBoundingClientRect();
    return {
      x: b.left - c.left + b.width / 2,
      y: b.top - c.top + b.height / 2,
    };
  }, []);

  const setupCanvas = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const { w, h } = getContainerSize();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = w * dpr;
    c.height = h * dpr;
    c.getContext("2d")!.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, [getContainerSize]);

  const clearCanvas = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
    c.style.zIndex = "30";
  }, []);

  const startAnim = useCallback(
    (dir: Dir, appIdx: number, onDone: () => void) => {
      cancelAnimationFrame(rafRef.current);
      const dock = getDockCenter(appIdx);
      const win = getWinPos();
      const { w: cw, h: ch } = getContainerSize();
      const off = offRef.current[appIdx];
      let start: number | null = null;
      function frame(ts: number) {
        if (!start) start = ts;
        const rawT = clamp((ts - start) / DUR, 0, 1);
        const c = canvasRef.current;
        if (!c) return;
        renderGenie(
          c.getContext("2d")!,
          off,
          cw,
          ch,
          rawT,
          dir,
          dock,
          win,
        );
        if (rawT < 1) {
          rafRef.current = requestAnimationFrame(frame);
        } else {
          onDone();
        }
      }
      rafRef.current = requestAnimationFrame(frame);
    },
    [getDockCenter, getWinPos, getContainerSize],
  );

  const doOpen = useCallback(
    (idx: number) => {
      if (stateRef.current.phase !== "idle") return;
      const wp = getWinPos();
      setupCanvas();
      stateRef.current = { phase: "opening", activeApp: idx };
      setWinPos(wp);
      setPhase("opening");
      setActiveApp(idx);
      startAnim("open", idx, () => {
        stateRef.current.phase = "open";
        // flushSync commits the MacWindow into the DOM synchronously before
        // clearCanvas runs; without it the canvas would clear one frame
        // before the window mounts and the background would flash through.
        flushSync(() => {
          setPhase("open");
        });
        clearCanvas();
      });
    },
    [getWinPos, setupCanvas, startAnim, clearCanvas],
  );

  const doMinimize = useCallback(() => {
    const { phase: p, activeApp: a } = stateRef.current;
    if (p !== "open" || a === null) return;

    const cvs = canvasRef.current;
    if (cvs) cvs.style.zIndex = "50";

    setupCanvas();
    const dock = getDockCenter(a);
    const win = getWinPos();
    const { w: cw, h: ch } = getContainerSize();
    const ctx = cvs?.getContext("2d");
    if (ctx && cvs) {
      renderGenie(ctx, offRef.current[a], cw, ch, 0, "minimize", dock, win);
    }

    if (windowRef.current) {
      windowRef.current.style.opacity = "0";
      windowRef.current.style.pointerEvents = "none";
    }

    stateRef.current.phase = "closing";
    setPhase("closing");

    startAnim("minimize", a, () => {
      stateRef.current = { phase: "idle", activeApp: null };
      setPhase("idle");
      setActiveApp(null);
      clearCanvas();
    });
  }, [setupCanvas, getDockCenter, getWinPos, getContainerSize, startAnim, clearCanvas]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Re-center the open window when the container resizes.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      if (stateRef.current.phase === "open") {
        setWinPos(getWinPos());
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [getWinPos]);

  const isAnimating = phase === "opening" || phase === "closing";
  const app = activeApp !== null ? APPS[activeApp] : null;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-150 overflow-hidden select-none"
    >
      <img
        src="/macos.jpg"
        alt="macos"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <style>{`@keyframes blink { 0%,49% { opacity: 1 } 50%,100% { opacity: 0 } }`}</style>

      {/* Aurora blobs (three blurred radial-gradient divs) and the macOS
          menubar (backdrop-blurred bar, app label + clock) — decorative
          chrome, summarised here; full text in the original paste. */}

      {/* Genie canvas — safe to SSR (just an empty <canvas>) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ width: "100%", height: "100%", zIndex: 30 }}
      />

      {/* Live MacWindow — only renders when open/closing (post-mount). */}
      {(phase === "open" || phase === "closing") && app && (
        <MacWindow
          app={app}
          winPos={winPos}
          onClose={doMinimize}
          domRef={(el) => {
            windowRef.current = el;
          }}
        />
      )}

      {/* Dock — gated on `mounted` (motion values are client-only). */}
      {mounted && (
        <>
          <SnapshotStage onReady={handleSnapshotsReady} />

          <TooltipProvider delayDuration={0}>
            <motion.div
              onMouseMove={(e) => mouseX.set(e.pageX)}
              onMouseLeave={() => mouseX.set(Infinity)}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-end gap-2 px-4 pb-2"
              style={{
                paddingTop: 14,
                minWidth: 360,
                borderRadius: 18,
                zIndex: 50,
                background: "rgba(255,255,255,.10)",
                backdropFilter: "blur(28px) saturate(180%)",
                border: "1px solid rgba(255,255,255,.14)",
                boxShadow:
                  "0 8px 32px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.10)",
              }}
            >
              {APPS.map((a, i) => (
                <MagnifiedDockIcon
                  key={a.id}
                  app={a}
                  isActive={activeApp === i}
                  showDot={phase === "open" && activeApp === i}
                  disabled={isAnimating || !snapshotsReady}
                  btnRef={(el) => {
                    dockRefs.current[i] = el;
                  }}
                  onClick={() => doOpen(i)}
                  mouseX={mouseX}
                />
              ))}
            </motion.div>
          </TooltipProvider>
        </>
      )}
    </div>
  );
}
