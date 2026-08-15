import logoSvg from '../../assets/logo.svg';

export function Logo({ className = '', height = 48 }) {
  return (
    <div
      className={`inline-flex items-center select-none ${className}`}
      style={{ height: `${height}px` }}
    >
      <img
        src={logoSvg}
        alt="LinkMakeup"
        className="h-full w-auto object-contain"
      />
    </div>
  );
}

export default Logo;
