type AvatarProps = {
  name: string;
  size?: "sm" | "md" | "lg";
};

export function Avatar({ name, size = "md" }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={`avatar avatar-${size}`.trim()} aria-label={`${name} avatar`}>
      {initials}
    </div>
  );
}
