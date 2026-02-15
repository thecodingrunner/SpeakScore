// components/landing/Mascot.tsx
'use client';

/**
 * Koko — SpeakScore's friendly mascot
 * A round, kawaii speech-bubble character with a microphone antenna.
 * Designed to feel warm, encouraging, and distinctly Japanese-friendly.
 */

interface MascotProps {
  size?: number;
  className?: string;
  expression?: 'happy' | 'excited' | 'thinking' | 'cheering' | 'waving';
}

export const Mascot = ({ size = 120, className = '', expression = 'happy' }: MascotProps) => {
  const eyeVariants = {
    happy: { left: { d: 'M32 42 Q36 36 40 42', stroke: '#3d2c2c' }, right: { d: 'M56 42 Q60 36 64 42', stroke: '#3d2c2c' } },
    excited: { left: { d: 'M33 39 L37 43 M37 39 L33 43', stroke: '#3d2c2c' }, right: { d: 'M59 39 L63 43 M63 39 L59 43', stroke: '#3d2c2c' } },
    thinking: { left: { d: 'M32 42 Q36 36 40 42', stroke: '#3d2c2c' }, right: { d: 'M56 40 A4 4 0 1 1 64 40 A4 4 0 1 1 56 40', stroke: '#3d2c2c' } },
    cheering: { left: { d: 'M33 39 L37 43 M37 39 L33 43', stroke: '#3d2c2c' }, right: { d: 'M59 39 L63 43 M63 39 L59 43', stroke: '#3d2c2c' } },
    waving: { left: { d: 'M32 42 Q36 36 40 42', stroke: '#3d2c2c' }, right: { d: 'M56 40 Q60 42 64 40', stroke: '#3d2c2c' } },
  };

  const eyes = eyeVariants[expression];
  const isXEyes = expression === 'excited' || expression === 'cheering';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Koko the SpeakScore mascot"
    >
      {/* Body glow */}
      <circle cx="48" cy="52" r="34" fill="oklch(var(--p) / 0.15)" />

      {/* Main body — soft rounded shape */}
      <ellipse cx="48" cy="52" rx="30" ry="28" fill="oklch(var(--p))" />

      {/* Body highlight — gives 3D roundness */}
      <ellipse cx="42" cy="42" rx="16" ry="12" fill="oklch(var(--pc) / 0.3)" />

      {/* Microphone antenna */}
      <line x1="48" y1="24" x2="48" y2="14" stroke="oklch(var(--n))" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="48" cy="11" r="4" fill="oklch(var(--a))" />
      <circle cx="48" cy="11" r="2" fill="oklch(var(--ac) / 0.3)" />

      {/* Cheeks — kawaii blush */}
      <ellipse cx="28" cy="52" rx="6" ry="4" fill="oklch(var(--er) / 0.25)" />
      <ellipse cx="68" cy="52" rx="6" ry="4" fill="oklch(var(--er) / 0.25)" />

      {/* Eyes */}
      {isXEyes ? (
        <>
          <path d={eyes.left.d} stroke={eyes.left.stroke} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d={eyes.right.d} stroke={eyes.right.stroke} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </>
      ) : expression === 'thinking' ? (
        <>
          <path d={eyes.left.d} stroke={eyes.left.stroke} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <circle cx="60" cy="40" r="4" fill="#3d2c2c" />
          <circle cx="61.5" cy="38.5" r="1.5" fill="white" />
        </>
      ) : (
        <>
          <path d={eyes.left.d} stroke={eyes.left.stroke} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d={eyes.right.d} stroke={eyes.right.stroke} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </>
      )}

      {/* Mouth */}
      {expression === 'excited' || expression === 'cheering' ? (
        <ellipse cx="48" cy="56" rx="5" ry="4" fill="#3d2c2c" />
      ) : expression === 'thinking' ? (
        <circle cx="52" cy="56" r="2.5" fill="#3d2c2c" />
      ) : (
        <path d="M43 54 Q48 60 53 54" stroke="#3d2c2c" strokeWidth="2" strokeLinecap="round" fill="none" />
      )}

      {/* Tiny arms/hands */}
      {expression === 'waving' ? (
        <>
          <path d="M20 55 Q14 48 18 42" stroke="oklch(var(--p))" strokeWidth="5" strokeLinecap="round" fill="none" />
          <circle cx="17" cy="41" r="3" fill="oklch(var(--p))" />
          <path d="M76 55 Q82 52 80 58" stroke="oklch(var(--p))" strokeWidth="5" strokeLinecap="round" fill="none" />
        </>
      ) : expression === 'cheering' ? (
        <>
          <path d="M20 48 Q12 38 16 32" stroke="oklch(var(--p))" strokeWidth="5" strokeLinecap="round" fill="none" />
          <circle cx="15" cy="31" r="3" fill="oklch(var(--p))" />
          <path d="M76 48 Q84 38 80 32" stroke="oklch(var(--p))" strokeWidth="5" strokeLinecap="round" fill="none" />
          <circle cx="81" cy="31" r="3" fill="oklch(var(--p))" />
        </>
      ) : (
        <>
          <path d="M20 55 Q14 52 16 48" stroke="oklch(var(--p))" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M76 55 Q82 52 80 48" stroke="oklch(var(--p))" strokeWidth="5" strokeLinecap="round" fill="none" />
        </>
      )}

      {/* Little feet */}
      <ellipse cx="40" cy="78" rx="6" ry="3" fill="oklch(var(--p))" />
      <ellipse cx="56" cy="78" rx="6" ry="3" fill="oklch(var(--p))" />
    </svg>
  );
};

/** Small inline mascot for badges, labels, etc. */
export const MascotMini = ({ size = 32, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <ellipse cx="16" cy="18" rx="11" ry="10" fill="oklch(var(--p))" />
    <ellipse cx="14" cy="15" rx="5" ry="4" fill="oklch(var(--pc) / 0.25)" />
    <line x1="16" y1="8" x2="16" y2="4" stroke="oklch(var(--n))" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="16" cy="3" r="2" fill="oklch(var(--a))" />
    <path d="M11 17 Q13 14 15 17" stroke="#3d2c2c" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M18 17 Q20 14 22 17" stroke="#3d2c2c" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M14 21 Q16 23 18 21" stroke="#3d2c2c" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

/** Sakura petal SVG for decorative use */
export const SakuraPetal = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M10 2 Q14 6 12 10 Q14 14 10 18 Q6 14 8 10 Q6 6 10 2Z"
      fill="oklch(var(--p) / 0.4)"
    />
  </svg>
);

export default Mascot;