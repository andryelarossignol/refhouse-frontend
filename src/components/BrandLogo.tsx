export function BrandLogo() {
  return (
    <div className="brand-logo" aria-label="RefHouse">
      <svg className="brand-logo-mark" viewBox="0 0 132 98" role="img" aria-hidden="true">
        <circle cx="27" cy="14" r="12" fill="none" stroke="#ff6b00" strokeWidth="5" />
        <path
          d="M53 85a33 33 0 1 1 0-66h58v18H74"
          fill="none"
          stroke="#0c0c0c"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
        />
        <path
          d="M29 79a26 26 0 0 1-7-17 25 25 0 0 1 25-25h49"
          fill="none"
          stroke="#0c0c0c"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
        />
        <path
          d="M35 57h54l-19 12-7 16"
          fill="none"
          stroke="#ff6b00"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="5"
        />
        <rect x="38" y="48" width="12" height="12" rx="2.5" fill="#ff6b00" />
        <rect x="54" y="48" width="12" height="12" rx="2.5" fill="#ff6b00" />
        <rect x="38" y="64" width="12" height="12" rx="2.5" fill="#ff6b00" />
        <rect x="54" y="64" width="12" height="12" rx="2.5" fill="#ff6b00" />
        <path d="M28 92a21 21 0 0 0 33-12" fill="none" stroke="#ff6b00" strokeLinecap="round" strokeWidth="5" />
      </svg>
      <span className="brand-logo-wordmark">RefHouse</span>
    </div>
  )
}
