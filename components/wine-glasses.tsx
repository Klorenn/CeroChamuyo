"use client"

interface WineGlassProps {
  className?: string
}

export function RedWineGlass({ className }: WineGlassProps) {
  return (
    <svg
      viewBox="0 0 120 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Glass bowl */}
      <path
        d="M30 40 C30 40, 20 80, 35 110 C45 130, 55 135, 60 135 C65 135, 75 130, 85 110 C100 80, 90 40, 90 40"
        stroke="#1a1a1a"
        strokeWidth="2"
        fill="none"
      />
      {/* Wine fill */}
      <path
        d="M35 55 C35 55, 28 85, 40 108 C48 122, 55 125, 60 125 C65 125, 72 122, 80 108 C92 85, 85 55, 85 55 Z"
        fill="#722F37"
        opacity="0.85"
      />
      {/* Wine surface highlight */}
      <ellipse cx="60" cy="55" rx="25" ry="6" fill="#8B3A42" opacity="0.6" />
      {/* Glass rim */}
      <ellipse cx="60" cy="40" rx="30" ry="8" stroke="#1a1a1a" strokeWidth="2" fill="none" />
      {/* Stem */}
      <line x1="60" y1="135" x2="60" y2="175" stroke="#1a1a1a" strokeWidth="2" />
      {/* Base */}
      <ellipse cx="60" cy="178" rx="25" ry="6" stroke="#1a1a1a" strokeWidth="2" fill="none" />
    </svg>
  )
}

export function WhiteWineGlass({ className }: WineGlassProps) {
  return (
    <svg
      viewBox="0 0 120 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Glass bowl - slightly narrower for white wine */}
      <path
        d="M35 40 C35 40, 28 75, 40 105 C48 120, 55 125, 60 125 C65 125, 72 120, 80 105 C92 75, 85 40, 85 40"
        stroke="#1a1a1a"
        strokeWidth="2"
        fill="none"
      />
      {/* Wine fill */}
      <path
        d="M40 60 C40 60, 34 85, 44 102 C50 112, 55 115, 60 115 C65 115, 70 112, 76 102 C86 85, 80 60, 80 60 Z"
        fill="#E8D5A3"
        opacity="0.7"
      />
      {/* Wine surface highlight */}
      <ellipse cx="60" cy="60" rx="20" ry="5" fill="#F0E6C8" opacity="0.5" />
      {/* Glass rim */}
      <ellipse cx="60" cy="40" rx="25" ry="7" stroke="#1a1a1a" strokeWidth="2" fill="none" />
      {/* Stem */}
      <line x1="60" y1="125" x2="60" y2="175" stroke="#1a1a1a" strokeWidth="2" />
      {/* Base */}
      <ellipse cx="60" cy="178" rx="22" ry="5" stroke="#1a1a1a" strokeWidth="2" fill="none" />
    </svg>
  )
}

export function RoseWineGlass({ className }: WineGlassProps) {
  return (
    <svg
      viewBox="0 0 120 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Glass bowl */}
      <path
        d="M32 40 C32 40, 22 78, 38 108 C47 125, 55 130, 60 130 C65 130, 73 125, 82 108 C98 78, 88 40, 88 40"
        stroke="#1a1a1a"
        strokeWidth="2"
        fill="none"
      />
      {/* Wine fill */}
      <path
        d="M38 58 C38 58, 30 82, 42 105 C49 117, 55 120, 60 120 C65 120, 71 117, 78 105 C90 82, 82 58, 82 58 Z"
        fill="#E8B4B8"
        opacity="0.75"
      />
      {/* Wine surface highlight */}
      <ellipse cx="60" cy="58" rx="22" ry="5" fill="#F0C8CC" opacity="0.5" />
      {/* Glass rim */}
      <ellipse cx="60" cy="40" rx="28" ry="7" stroke="#1a1a1a" strokeWidth="2" fill="none" />
      {/* Stem */}
      <line x1="60" y1="130" x2="60" y2="175" stroke="#1a1a1a" strokeWidth="2" />
      {/* Base */}
      <ellipse cx="60" cy="178" rx="24" ry="5" stroke="#1a1a1a" strokeWidth="2" fill="none" />
    </svg>
  )
}

export function SparklingWineGlass({ className }: WineGlassProps) {
  return (
    <svg
      viewBox="0 0 120 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Flute bowl - tall and narrow */}
      <path
        d="M45 30 C45 30, 42 100, 50 125 C54 135, 57 138, 60 138 C63 138, 66 135, 70 125 C78 100, 75 30, 75 30"
        stroke="#1a1a1a"
        strokeWidth="2"
        fill="none"
      />
      {/* Wine fill */}
      <path
        d="M48 45 C48 45, 45 95, 52 118 C55 126, 57 128, 60 128 C63 128, 65 126, 68 118 C75 95, 72 45, 72 45 Z"
        fill="#F5E6B8"
        opacity="0.6"
      />
      {/* Bubbles */}
      <circle cx="55" cy="80" r="1.5" fill="#FFFFFF" opacity="0.8" />
      <circle cx="62" cy="95" r="1" fill="#FFFFFF" opacity="0.7" />
      <circle cx="58" cy="110" r="1.2" fill="#FFFFFF" opacity="0.6" />
      <circle cx="65" cy="70" r="1" fill="#FFFFFF" opacity="0.8" />
      <circle cx="54" cy="100" r="0.8" fill="#FFFFFF" opacity="0.7" />
      <circle cx="63" cy="85" r="1.3" fill="#FFFFFF" opacity="0.6" />
      {/* Wine surface highlight */}
      <ellipse cx="60" cy="45" rx="12" ry="3" fill="#FFF8E7" opacity="0.5" />
      {/* Glass rim */}
      <ellipse cx="60" cy="30" rx="15" ry="5" stroke="#1a1a1a" strokeWidth="2" fill="none" />
      {/* Stem */}
      <line x1="60" y1="138" x2="60" y2="175" stroke="#1a1a1a" strokeWidth="2" />
      {/* Base */}
      <ellipse cx="60" cy="178" rx="20" ry="5" stroke="#1a1a1a" strokeWidth="2" fill="none" />
    </svg>
  )
}
