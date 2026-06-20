import { IconMapPin } from "@tabler/icons-react";
import { MapPanel } from "@/components/map-panel";

export default function DiscoverPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-4 md:px-6">
      <h1 className="mb-1 text-lg font-medium">מוקדים יהודיים בקרבתך</h1>
      <p className="mb-3 flex items-center gap-1.5 text-sm text-muted">
        <IconMapPin size={15} stroke={1.75} />
        בתי כנסת לפי המיקום שלך — אשר גישה למיקום לתוצאות מדויקות.
      </p>
      <MapPanel />
    </div>
  );
}
