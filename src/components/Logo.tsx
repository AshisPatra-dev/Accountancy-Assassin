// ============================================================
// ACCOUNTANCY ASSASSIN — Brand Logo
// Uses the official uploaded PNG logo as the primary brand image.
// The original artwork: hooded figure forming an "A" with a dollar-sword
// and an upward-trending arrow, in the brand teal (#1AB0AA) on dark navy.
//
// Two variants:
//   full  — the PNG logo rendered in an <img> or as a background
//   mark  — a compact square mark (teal circle + "AA" monogram) for favicons/badges
// ============================================================

import React from 'react';
import logoSrc from '/logo.png';

export interface LogoProps {
  /** Rendered size in px. For 'full', this is the height; width scales proportionally. */
  size?: number;
  variant?: 'full' | 'mark';
  className?: string;
  /** Alt text override */
  alt?: string;
}

// Brand teal extracted from the uploaded logo
export const BRAND_TEAL       = '#1AB0AA';
export const BRAND_TEAL_DARK  = '#0D7A76';
export const BRAND_TEAL_LIGHT = '#4FD1CC';
export const BRAND_TEAL_BG    = '#071C1B'; // near-black teal, matches logo background

export function Logo({ size = 48, variant = 'full', className, alt }: LogoProps) {
  if (variant === 'full') {
    return (
      <img
        src={logoSrc}
        alt={alt ?? 'Accountancy Assassin'}
        height={size}
        // Let the browser preserve aspect ratio naturally
        style={{ height: size, width: 'auto', display: 'block' }}
        className={className}
        draggable={false}
      />
    );
  }

  // 'mark' variant: compact teal circle with AA monogram for tight spaces
  const r = size / 2;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={alt ?? 'Accountancy Assassin mark'}
    >
      <defs>
        <radialGradient id="markGrad" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#0D7A76" />
          <stop offset="100%" stopColor="#071C1B" />
        </radialGradient>
        <linearGradient id="tealsword" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BRAND_TEAL_LIGHT} />
          <stop offset="100%" stopColor={BRAND_TEAL_DARK} />
        </linearGradient>
      </defs>
      {/* Outer ring */}
      <circle cx="24" cy="24" r="23" fill="url(#markGrad)" stroke={BRAND_TEAL} strokeWidth="1.4" />
      <circle cx="24" cy="24" r="19" stroke={BRAND_TEAL_DARK} strokeWidth="0.8" strokeDasharray="3 2" opacity="0.7" />
      {/* AA monogram */}
      <text
        x="24"
        y="29"
        textAnchor="middle"
        fontFamily="'Newsreader', Georgia, serif"
        fontWeight="700"
        fontSize="15"
        fill="url(#tealsword)"
        letterSpacing="-0.5"
      >
        AA
      </text>
    </svg>
  );
}
