export type IconKey =
  | "bank" | "card" | "wallet" | "globe" | "train"
  | "phone" | "cash" | "briefcase" | "home" | "star"
  | "shield" | "airplane";

export const ICON_KEYS: IconKey[] = [
  "bank", "card", "wallet", "globe", "train", "phone",
  "cash", "briefcase", "home", "star", "shield", "airplane",
];

export const ICON_LABELS: Record<IconKey, string> = {
  bank: "Bank", card: "Card", wallet: "Wallet", globe: "Globe",
  train: "Transit", phone: "Phone", cash: "Cash", briefcase: "Work",
  home: "Home", star: "Star", shield: "Shield", airplane: "Travel",
};

interface Props {
  icon: string;
  color: string;
  size?: number;
}

export default function AccountIcon({ icon, color, size = 18 }: Props) {
  const p = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: color,
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (icon as IconKey) {
    case "bank":
      return (
        <svg {...p}>
          <path d="M3 21h18M3 10h18M5 6l7-3 7 3" />
          <path d="M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11" />
        </svg>
      );
    case "card":
      return (
        <svg {...p}>
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 10h20M7 15h4" />
        </svg>
      );
    case "wallet":
      return (
        <svg {...p}>
          <path d="M20 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
          <path d="M16 13h.01" strokeWidth={2.5} />
        </svg>
      );
    case "globe":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
        </svg>
      );
    case "train":
      return (
        <svg {...p}>
          <rect x="4" y="3" width="16" height="13" rx="3" />
          <path d="M8 20l4-4 4 4M8 8h8M8 12h8" />
        </svg>
      );
    case "phone":
      return (
        <svg {...p}>
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <path d="M12 17h.01" strokeWidth={2.5} />
        </svg>
      );
    case "cash":
      return (
        <svg {...p}>
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <circle cx="12" cy="12" r="3" />
          <path d="M6 12h.01M18 12h.01" strokeWidth={2.5} />
        </svg>
      );
    case "briefcase":
      return (
        <svg {...p}>
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M12 12v4M10 14h4" />
        </svg>
      );
    case "home":
      return (
        <svg {...p}>
          <path d="M3 12l9-9 9 9" />
          <path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" />
        </svg>
      );
    case "star":
      return (
        <svg {...p}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    case "shield":
      return (
        <svg {...p}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case "airplane":
      return (
        <svg {...p}>
          <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0011.5 2 1.5 1.5 0 0010 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </svg>
      );
    default:
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="5" />
        </svg>
      );
  }
}
