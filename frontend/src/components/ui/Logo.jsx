import logoSvg from '../../assets/logo.svg';

export function Logo({ className = '', height }) {
  const style = height ? { height: `${height}px` } : undefined;

  return (
    <div
      className={`inline-flex items-center select-none ${className}`}
      style={style}
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
