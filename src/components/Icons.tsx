import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// Iconic Roblox Tilted Hexagon Coin with Center Square Hole (Emerald & Gold)
export const RobuxIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
  >
    <defs>
      <linearGradient id="rbxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#34d399" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <g transform="translate(12, 12) rotate(15) translate(-12, -12)">
      <polygon
        points="12,2 20.66,7 20.66,17 12,22 3.34,17 3.34,7"
        fill="url(#rbxGrad)"
        stroke="#6ee7b7"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <rect
        x="9"
        y="9"
        width="6"
        height="6"
        rx="1"
        fill="#0b0f17"
        stroke="#34d399"
        strokeWidth="1"
      />
    </g>
  </svg>
);

// Gold Robux Variant (for in-game store passes)
export const RobuxGoldIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
  >
    <defs>
      <linearGradient id="rbxGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>
    <g transform="translate(12, 12) rotate(15) translate(-12, -12)">
      <polygon
        points="12,2 20.66,7 20.66,17 12,22 3.34,17 3.34,7"
        fill="url(#rbxGoldGrad)"
        stroke="#fde68a"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <rect
        x="9"
        y="9"
        width="6"
        height="6"
        rx="1"
        fill="#0b0f17"
        stroke="#fbbf24"
        strokeWidth="1"
      />
    </g>
  </svg>
);

// British Pound Sterling (£) Seal Coin
export const SterlingCoinIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
  >
    <defs>
      <linearGradient id="gbpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" fill="url(#gbpGrad)" stroke="#6ee7b7" strokeWidth="1.2" />
    <circle cx="12" cy="12" r="8" fill="none" stroke="#34d399" strokeWidth="0.8" strokeDasharray="2 1.5" />
    <path
      d="M14.5 7.5C13.8 6.6 12.6 6.5 11.7 7C10.5 7.7 10 9 10 10.5V16.5H15M8.5 12H13M8.5 16.5H15.5"
      stroke="#ffffff"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// GamePass VIP Ticket Icon
export const GamePassTicketIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
  >
    <path
      d="M3 8C3 7.44772 3.44772 7 4 7H20C20.5523 7 21 7.44772 21 8V10C20 10 19 10.8954 19 12C19 13.1046 20 14 21 14V16C21 16.5523 20.5523 17 20 17H4C3.44772 17 3 16.5523 3 16V14C4 14 5 13.1046 5 12C5 10.8954 4 10 3 10V8Z"
      fill="#d97706"
      fillOpacity="0.2"
      stroke="#fbbf24"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M10 7V17M14 7V17"
      stroke="#fbbf24"
      strokeWidth="1.2"
      strokeDasharray="2 2"
    />
    <circle cx="12" cy="12" r="1.5" fill="#fde68a" />
  </svg>
);

// Developer Product Potion / Consumable Elixir Icon
export const DevProductPotionIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
  >
    <path
      d="M9 3H15M10 3V6L5.5 15.5C4.7 17.2 5.9 19 7.8 19H16.2C18.1 19 19.3 17.2 18.5 15.5L14 6V3"
      stroke="#38bdf8"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 14C8.5 13 11 15 13 14C15 13 16.5 14 17 14.5"
      stroke="#0284c7"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <circle cx="10" cy="16" r="1" fill="#bae6fd" />
    <circle cx="14" cy="16.5" r="0.75" fill="#bae6fd" />
  </svg>
);

// Luau Script File Icon with Native Lua Crescent & Planet Mark
export const LuauScriptIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
  >
    <rect
      x="4"
      y="3"
      width="16"
      height="18"
      rx="3"
      fill="#0369a1"
      fillOpacity="0.2"
      stroke="#38bdf8"
      strokeWidth="1.4"
    />
    <circle cx="10" cy="10" r="3" stroke="#38bdf8" strokeWidth="1.2" />
    <circle cx="14.5" cy="8.5" r="1" fill="#7dd3fc" />
    <path
      d="M7 16H17M7 18H13"
      stroke="#94a3b8"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

// DevEx Bank Vault & Shield Icon
export const DevExVaultIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
  >
    <rect
      x="3"
      y="4"
      width="18"
      height="16"
      rx="3"
      fill="#064e3b"
      fillOpacity="0.3"
      stroke="#10b981"
      strokeWidth="1.5"
    />
    <circle cx="12" cy="12" r="4.5" stroke="#34d399" strokeWidth="1.5" />
    <path
      d="M12 9.5V14.5M9.5 12H14.5M10.2 10.2L13.8 13.8M13.8 10.2L10.2 13.8"
      stroke="#6ee7b7"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <circle cx="17.5" cy="7" r="1" fill="#34d399" />
  </svg>
);
