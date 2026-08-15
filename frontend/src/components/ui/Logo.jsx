import logoLiteSvg from '../../assets/logo-lite.svg';
import logoDarkSvg from '../../assets/logo-d.svg';
import { useTheme } from '../../contexts/ThemeContext';

export function Logo({ className = '', height }) {
  const { theme } = useTheme();
  const style = height ? { height: `${height}px` } : undefined;
  const src = theme === 'dark' ? logoDarkSvg : logoLiteSvg;

  return (
    <div
      className={`inline-flex items-center select-none ${className}`}
      style={style}
    >
      <img
        src={src}
        alt="LinkMakeup"
        className="h-full w-auto object-contain"
      />
    </div>
  );
}

export default Logo;
