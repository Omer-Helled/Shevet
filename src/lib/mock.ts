// Temporary in-memory data so the interface is clickable before Supabase is wired in.

export type StayType = "exchange" | "host" | "volunteer" | "petsit";

export const stayTypeLabel: Record<StayType, string> = {
  exchange: "חילופי בתים",
  host: "משפחה מארחת",
  volunteer: "תמורת התנדבות",
  petsit: "תמורת שמירה",
};

export type Stay = {
  id: string;
  title: string;
  city: string;
  country: string;
  type: StayType;
  rating: number;
  badges: string[];
};

export const stays: Stay[] = [
  { id: "1", title: "דירת גג בלב מרסיי", city: "מרסיי", country: "צרפת", type: "exchange", rating: 4.9, badges: ["כשר", "עירוב", "סוכה"] },
  { id: "2", title: "אירוח אצל משפחת לוי", city: "בורו פארק", country: "ניו יורק", type: "host", rating: 5.0, badges: ["שומר שבת", "גלאט"] },
  { id: "3", title: "בית עם חתול בגולדרס גרין", city: "לונדון", country: "אנגליה", type: "petsit", rating: 4.8, badges: ["כשר", "עירוב"] },
  { id: "4", title: "דירה ליד הים", city: "הרצליה", country: "ישראל", type: "exchange", rating: 4.7, badges: ["כשר", "סוכה"] },
  { id: "5", title: "חדר תמורת עזרה בקהילה", city: "בואנוס איירס", country: "ארגנטינה", type: "volunteer", rating: 4.6, badges: ["כשר", "ליד בית כנסת"] },
  { id: "6", title: "בית משפחתי בשכונה דתית", city: "אנטוורפן", country: "בלגיה", type: "host", rating: 4.9, badges: ["שומר שבת", "מקווה קרוב"] },
];

export type HubKind = "synagogue" | "kosher" | "mikveh" | "event";

export type Hub = {
  id: string;
  name: string;
  kind: HubKind;
  meta: string;
  distance: string;
};

export const hubs: Hub[] = [
  { id: "1", name: "בית חב\"ד תל אביב מרכז", kind: "synagogue", meta: "מניין 18:30", distance: "1.2 ק\"מ" },
  { id: "2", name: 'מסעדת "הקצב" · בשרי גלאט', kind: "kosher", meta: "פתוח עכשיו", distance: "600 מ'" },
  { id: "3", name: "מקווה נשים מרכזי", kind: "mikveh", meta: "פתוח עד 22:00", distance: "1.8 ק\"מ" },
  { id: "4", name: "ערב שירה בציבור קהילתי", kind: "event", meta: "הערב 20:00", distance: "900 מ'" },
];

export type BoardKind = "volunteer" | "job" | "offer" | "package";

export const boardKindLabel: Record<BoardKind, string> = {
  volunteer: "התנדבות",
  job: "עבודה",
  offer: "הצעת עזרה",
  package: "העברת חבילה",
};

export type BoardItem = {
  id: string;
  title: string;
  place: string;
  kind: BoardKind;
  meta: string;
};

export const board: BoardItem[] = [
  { id: "1", title: "מתנדבים לחלוקת חבילות מזון לפני שבת", place: "ירושלים, ישראל", kind: "volunteer", meta: "כל יום שישי" },
  { id: "2", title: "דרוש מדריך נוער לקהילה", place: "מיאמי, ארה\"ב", kind: "job", meta: "משרה חלקית" },
  { id: "3", title: "מלווה עברית לעולים חדשים", place: "ברלין, גרמניה", kind: "offer", meta: "פנוי בערבים" },
  { id: "4", title: "טס לניו יורק ב-3.7 — אשמח להעביר חבילה", place: "תל אביב ← ניו יורק", kind: "package", meta: "עד 5 ק\"ג" },
  { id: "5", title: "ביקור קשישים בבית האבות הקהילתי", place: "טורונטו, קנדה", kind: "volunteer", meta: "ימי ראשון" },
];

export type Convo = {
  id: string;
  name: string;
  initials: string;
  last: string;
  time: string;
  unread?: number;
};

export const convos: Convo[] = [
  { id: "1", name: "משפחת לוי", initials: "מל", last: "נשמח לארח אתכם לשבת הקרובה!", time: "09:24", unread: 2 },
  { id: "2", name: "דניאל מ.", initials: "דמ", last: "התאריכים מתאימים לי, נתאם?", time: "אתמול" },
  { id: "3", name: "קהילת מרסיי", initials: "קמ", last: "הוספנו אירוע חדש לפורים", time: "ב׳" },
];
