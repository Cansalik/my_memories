// ── Couple identity ───────────────────────────────────────
export const PARTNER_1 = "Neşet";
export const PARTNER_2 = "Müzeyyen";
export const COUPLE_NAME = `${PARTNER_1} & ${PARTNER_2}`;
export const COUPLE_TAGLINE = "Her yıldız bir anımızı temsil ediyor";
export const COUPLE_QUOTE = "Seninle her an, gökyüzünde bir yıldız oldu.";

// ── Relationship timer ────────────────────────────────────
export const RELATIONSHIP_START = new Date("2022-03-03T00:00:00");

// ── Site metadata ─────────────────────────────────────────
export const SITE_TITLE = `${COUPLE_NAME} ✦ Bizim Yıldızlarımız`;
export const SITE_DESCRIPTION = COUPLE_TAGLINE;

// ── Admin ─────────────────────────────────────────────────
export const ADMIN_COOKIE = "nm_admin_auth";
export const ADMIN_SESSION_HOURS = 24;

// ── Color palette (mirrors Tailwind config) ───────────────
export const COLORS = {
  navyDeep: "#070F1E",
  navy: "#0B1D3A",
  navyLight: "#112347",
  gold: "#F5D27A",
  goldLight: "#FAE4A4",
  goldDim: "#C9A84C",
  cream: "#FFF7E6",
  rose: "#E8A4B8",
} as const;

// ── Animation defaults ────────────────────────────────────
export const FADE_UP = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7 },
} as const;

// ── Constellation canvas ──────────────────────────────────
export const STAR_COUNT = 72;
export const STAR_HIT_RADIUS = 22;
