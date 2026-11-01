export default function Logo({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="20" fill="var(--wine)" />
      <ellipse cx="20" cy="27.5" rx="10.5" ry="3" stroke="var(--gold)" strokeWidth="2.2" />
      <path
        d="M14 20.5c-1.3-2.6-1-5.3 1-8"
        stroke="var(--gold)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M20 21.5c-0.8-3.2-0.3-6.4 1-9.5"
        stroke="var(--gold)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M26 20.5c1.3-2.6 1-5.3-1-8"
        stroke="var(--gold)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
