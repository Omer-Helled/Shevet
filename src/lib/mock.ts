// Shared enums + Hebrew labels for listing and board categories.

export type StayType = "exchange" | "host" | "volunteer" | "petsit";

export const stayTypeLabel: Record<StayType, string> = {
  exchange: "חילופי בתים",
  host: "משפחה מארחת",
  volunteer: "תמורת התנדבות",
  petsit: "תמורת שמירה",
};

export type BoardKind = "volunteer" | "job" | "offer" | "package";

export const boardKindLabel: Record<BoardKind, string> = {
  volunteer: "התנדבות",
  job: "עבודה",
  offer: "הצעת עזרה",
  package: "העברת חבילה",
};
