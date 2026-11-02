"use client";

import { liquidMetalFragmentShader, ShaderMount, type ShaderMountUniforms } from "@paper-design/shaders";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  type ButtonHTMLAttributes,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from "react";

import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

/** A still frame of the liquid metal: used before the shader starts and wherever a live shader isn't worth its cost. */
export const CHROME =
  "conic-gradient(from 210deg at 50% 50%, #f4f4f6 0deg, #77777f 45deg, #e8e8ee 95deg, #2c2c32 150deg, #ffe1e1 185deg, #c9d3ff 215deg, #3a3a42 265deg, #ededf2 320deg, #f4f4f6 360deg)";

/** The black pill from the 21st.dev Liquid Metal Button. */
export const METAL_FILL = "linear-gradient(180deg, #202020 0%, #000000 100%)";

/** A 2px chrome rim around a fill, for elements that don't run the shader. */
export const chromeRim = (fill: string = METAL_FILL, width = 2): CSSProperties => ({
  border: `${width}px solid transparent`,
  background: `${fill} padding-box, ${CHROME} border-box`,
});

/**
 * Liquid-metal settings for @paper-design/shaders 0.0.82, which needs colour,
 * image and sizing uniforms that the original component did not pass.
 * Shape 0 fills the whole canvas, so the rim works on pills, circles and long clips alike.
 */
const LIQUID_METAL_UNIFORMS: ShaderMountUniforms = {
  u_colorBack: [0, 0, 0, 0],
  u_colorTint: [1, 1, 1, 1],
  u_repetition: 4,
  u_softness: 0.5,
  u_shiftRed: 0.3,
  u_shiftBlue: 0.3,
  u_distortion: 0,
  u_contour: 0,
  u_angle: 45,
  u_shape: 0,
  u_isImage: false,
  u_fit: 0,
  u_scale: 1,
  u_rotation: 0,
  u_offsetX: 0.1,
  u_offsetY: -0.1,
  u_originX: 0.5,
  u_originY: 0.5,
  u_worldWidth: 0,
  u_worldHeight: 0,
};

const IDLE_SPEED = 0.6;
const HOVER_SPEED = 1;
const CLICK_SPEED = 2.4;

/**
 * Mounts the liquid-metal shader into the returned ref's element.
 * The shader freezes when the visitor prefers reduced motion.
 */
export function useLiquidMetal<T extends HTMLElement>(enabled = true) {
  const ref = useRef<T>(null);
  const mount = useRef<ShaderMount | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduced = usePrefersReducedMotion();
  const idle = reduced ? 0 : IDLE_SPEED;
  const idleRef = useRef(idle);

  useEffect(() => {
    idleRef.current = idle;
    mount.current?.setSpeed(idle);
  }, [idle]);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    let shader: ShaderMount | null = null;
    try {
      shader = new ShaderMount(el, liquidMetalFragmentShader, LIQUID_METAL_UNIFORMS, undefined, idleRef.current);
    } catch {
      // No WebGL: the chrome background on the element stays as the fallback.
      shader = null;
    }
    mount.current = shader;
    return () => {
      if (timer.current) clearTimeout(timer.current);
      shader?.dispose();
      mount.current = null;
    };
  }, [enabled]);

  const hover = useCallback(() => {
    if (!reduced) mount.current?.setSpeed(HOVER_SPEED);
  }, [reduced]);

  const leave = useCallback(() => {
    mount.current?.setSpeed(idleRef.current);
  }, []);

  const kick = useCallback(() => {
    if (reduced) return;
    mount.current?.setSpeed(CLICK_SPEED);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => mount.current?.setSpeed(idleRef.current), 300);
  }, [reduced]);

  return { ref, hover, leave, kick };
}

/** An absolutely positioned liquid-metal (or still chrome) layer. */
export function LiquidMetalSurface({
  live = true,
  className,
  style,
}: {
  live?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const { ref } = useLiquidMetal<HTMLSpanElement>(live);
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn("pointer-events-none absolute overflow-hidden", className)}
      style={{ background: CHROME, ...style }}
    />
  );
}

type MetalShape = "pill" | "circle";

interface MetalShellProps {
  /** Run the live shader. Off by default: a page should only run a handful. */
  live?: boolean;
  shape?: MetalShape;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
}

const shellClass = "metal relative inline-flex shrink-0 rounded-full p-[2px] has-[:disabled]:opacity-40";
const shellShadow =
  "0 0 0 1px rgba(0,0,0,0.3), 0 20px 12px rgba(0,0,0,0.08), 0 9px 9px rgba(0,0,0,0.12), 0 2px 5px rgba(0,0,0,0.15)";
const innerClass =
  "relative z-[1] inline-flex items-center justify-center gap-2 rounded-full text-[#ededf0] [text-shadow:0_1px_2px_rgba(0,0,0,0.5)] outline-offset-4 focus-visible:outline-2 focus-visible:outline-playhead disabled:cursor-not-allowed";

function innerSize(shape: MetalShape) {
  return shape === "circle" ? "size-10" : "h-[38px] px-[18px] text-[13px] font-medium";
}

/** Classes and fill for an element placed inside a MetalShell. */
export const metalInner = cn(innerClass, innerSize("pill"));
export const metalFill: CSSProperties = { background: METAL_FILL };

interface LiquidMetalControls {
  hover: () => void;
  leave: () => void;
  kick: () => void;
}

/**
 * A persistent liquid-metal rim whose content can change (a link, then a button, then a hint)
 * without tearing down and re-creating the WebGL context each time.
 */
export function MetalShell({
  live = false,
  className,
  children,
}: {
  live?: boolean;
  className?: string;
  children: (metal: LiquidMetalControls) => ReactNode;
}) {
  const { ref: surfaceRef, hover, leave, kick } = useLiquidMetal<HTMLSpanElement>(live);
  return (
    <span className={cn(shellClass, className)} style={{ boxShadow: shellShadow }}>
      <span ref={surfaceRef} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-full" style={{ background: CHROME }} />
      {children({ hover, leave, kick })}
    </span>
  );
}

export function MetalButton({
  live = false,
  shape = "pill",
  className,
  innerClassName,
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  type = "button",
  ...rest
}: MetalShellProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const { ref: surfaceRef, hover, leave, kick } = useLiquidMetal<HTMLSpanElement>(live);
  return (
    <span className={cn(shellClass, className)} style={{ boxShadow: shellShadow }}>
      <span ref={surfaceRef} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-full" style={{ background: CHROME }} />
      <button
        type={type}
        {...rest}
        onMouseEnter={(e) => {
          hover();
          onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          leave();
          onMouseLeave?.(e);
        }}
        onClick={(e) => {
          kick();
          onClick?.(e);
        }}
        className={cn(innerClass, innerSize(shape), "cursor-pointer", innerClassName)}
        style={{ background: METAL_FILL }}
      >
        {children}
      </button>
    </span>
  );
}

export function MetalLink({
  live = false,
  shape = "pill",
  className,
  innerClassName,
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: MetalShellProps & ComponentProps<typeof Link>) {
  const { ref: surfaceRef, hover, leave, kick } = useLiquidMetal<HTMLSpanElement>(live);
  return (
    <span className={cn(shellClass, className)} style={{ boxShadow: shellShadow }}>
      <span ref={surfaceRef} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-full" style={{ background: CHROME }} />
      <Link
        {...rest}
        onMouseEnter={(e) => {
          hover();
          onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          leave();
          onMouseLeave?.(e);
        }}
        onClick={(e) => {
          kick();
          onClick?.(e);
        }}
        className={cn(innerClass, innerSize(shape), "no-underline", innerClassName)}
        style={{ background: METAL_FILL }}
      >
        {children}
      </Link>
    </span>
  );
}
