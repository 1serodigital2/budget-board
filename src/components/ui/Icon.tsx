interface IconProps {
  name: string;
  size?: number;
  filled?: boolean;
  className?: string;
}

/** Material Symbols (Rounded) glyph. Decorative by default. */
const Icon = ({ name, size = 20, filled = false, className = "" }: IconProps) => (
  <span
    aria-hidden="true"
    className={`icon ${filled ? "icon-filled" : ""} ${className}`}
    style={{ fontSize: size }}
  >
    {name}
  </span>
);

export default Icon;
