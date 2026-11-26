export function LogoMark({ size = 44 }: { size?: number }) {
  return (
    <svg
      className="logo-mark"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="48" height="48" rx="12" fill="#ff5a1f" />
      <g
        stroke="#1a1a1a"
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <path d="M24 9L38 17L24 25L10 17Z" fill="#ffffff" />
        <path d="M10 17L24 25V40L10 32Z" fill="#ffffff" />
        <path d="M24 25L38 17V32L24 40Z" fill="#1a1a1a" />
        <path d="M10 22L24 30M10 27L24 35" fill="none" strokeWidth="1.6" />
      </g>
    </svg>
  );
}

export function Logo() {
  return (
    <div className="logo">
      <LogoMark />
      <span className="wordmark" aria-label="printesu">
        printesu
      </span>
    </div>
  );
}
