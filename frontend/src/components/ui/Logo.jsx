import logoLiteSvg from '../../assets/logo-lite.svg';
import logoDarkSvg from '../../assets/logo-d.svg';
import { useTheme } from '../../contexts/ThemeContext';

export function Logo({ className = '', height, forceDark = false }) {
  const { theme } = useTheme();
  const style = height ? { height: `${height}px` } : undefined;
  const isDark = forceDark || theme === 'dark';
  const src = isDark ? logoDarkSvg : logoLiteSvg;

  return (
    <div
      className={`inline-flex items-center select-none ${className}`}
      style={style}
    >
      <img
        src={src}
        alt="Link Make Up"
        className="h-full w-auto object-contain"
      />
    </div>
  );
}

export default Logo;
