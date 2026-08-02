interface AppLogoProps {
  size?: number;
}

export function AppLogo({ size = 48 }: AppLogoProps) {
  return (
    <div
      className="bg-black rounded-full flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <span
        className="text-white font-extrabold"
        style={{ fontSize: size * 0.32 }}
      >
        3D
      </span>
    </div>
  );
}
