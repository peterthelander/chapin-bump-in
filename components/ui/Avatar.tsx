type AvatarProps = {
  name: string;
  seed: string;
  size?: "sm" | "md" | "lg";
};

const getAvatarUrl = (seed: string): string =>
  `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(seed)}`;

export function Avatar({ name, seed, size = "md" }: AvatarProps) {
  return (
    <div className={`avatar avatar-${size}`.trim()} aria-label={`${name} avatar`}>
      <img src={getAvatarUrl(seed)} alt={`${name} avatar`} className="avatar-image" />
    </div>
  );
}
