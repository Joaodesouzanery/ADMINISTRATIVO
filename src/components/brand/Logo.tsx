interface LogoProps {
  size?: number
  showText?: boolean
  textColor?: string
}

export function Logo({ size = 36, showText = true, textColor = 'text-white' }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <svg width={size} height={size} viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer drop */}
        <path
          d="M50 8 C50 8, 8 52, 8 74 C8 96, 27 112, 50 112 C73 112, 92 96, 92 74 C92 52, 50 8, 50 8Z"
          stroke="#64D4E8"
          strokeWidth="6"
          fill="none"
          strokeLinejoin="round"
        />
        {/* Inner drop */}
        <path
          d="M50 32 C50 32, 26 60, 26 74 C26 88, 37 100, 50 100 C63 100, 74 88, 74 74 C74 60, 50 32, 50 32Z"
          stroke="#64D4E8"
          strokeWidth="5"
          fill="none"
          strokeLinejoin="round"
        />
      </svg>
      {showText && (
        <div>
          <div className={`font-bold text-lg leading-tight tracking-wide ${textColor}`}>
            Atlântico
          </div>
        </div>
      )}
    </div>
  )
}
