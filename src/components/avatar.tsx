import Image from "next/image";

// Renders a profile photo if available, otherwise an initials circle. Works in server and client components.
export function Avatar({
  name,
  src,
  size = 36,
}: {
  name: string;
  src?: string | null;
  size?: number;
}) {
  if (src) {
    return (
      <span
        className="relative shrink-0 overflow-hidden rounded-full bg-surface-2"
        style={{ width: size, height: size }}
      >
        <Image src={src} alt={name} fill sizes={`${size}px`} className="object-cover" />
      </span>
    );
  }
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full bg-accent text-[#3a1c0e]"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
    >
      {name.trim().slice(0, 2)}
    </span>
  );
}
