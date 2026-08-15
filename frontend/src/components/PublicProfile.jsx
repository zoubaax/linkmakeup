import { getPlatformIcon, getPlatformContainerStyle } from './SocialIcons';
import { env } from '../config/env';
import AppLayout from './layout/AppLayout';
import { SkeletonProfile } from './ui/Skeleton';
import { DEFAULT_THEME } from '../utils/themePresets';
import { StatusPill } from './StatusPill';

export default function PublicProfile() {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    ApiService.getPublicProfile(username)
      .then((res) => { if (res.success && res.data) setData(res.data); else setNotFound(true); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-app flex items-center justify-center">
        <SkeletonProfile />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-app flex flex-col items-center justify-center text-center px-6 py-24 gap-6">
        <span className="text-6xl">🔍</span>
        <h1 className="text-3xl font-bold text-fg">Profile Not Found</h1>
        <p className="text-fg-muted max-w-xs leading-relaxed">
          <strong className="text-accent">/{username}</strong> does not exist on LinkMakeup yet.
        </p>
        <Link to="/" className="px-6 py-3 rounded-xl bg-primary text-primary-fg hover:bg-primary-hover font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]">
          Create Your Own Page
        </Link>
      </div>
    );
  }

  const { profile, links } = data;
  const theme = profile.themeConfig || DEFAULT_THEME;

  const bgStyle = theme.backgroundColor ? { backgroundColor: theme.backgroundColor } : {};
  const cardStyle = theme.cardColor ? { backgroundColor: theme.cardColor, borderColor: 'rgba(0,0,0,0.06)' } : {};
  const textStyle = theme.textColor ? { color: theme.textColor } : {};
  const accentStyle = theme.accentColor ? { color: theme.accentColor } : {};

  return (
    <div style={bgStyle} className="min-h-screen py-12 px-4 transition-colors duration-300">
      <div className="max-w-sm mx-auto flex flex-col items-center gap-4">
        
        {/* Elevated Hero Card */}
        <div style={cardStyle} className="w-full rounded-3xl p-6 border shadow-md flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="relative w-24 h-24 mb-3">
            <div
              style={{ backgroundColor: theme.accentColor }}
              className="absolute -inset-1 rounded-full opacity-20"
            />
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              className="relative w-full h-full rounded-full object-cover border-2 border-white bg-slate-100 shadow-md"
            />
          </div>

          {/* Name & Role */}
          <h1 style={textStyle} className="font-bold text-2xl tracking-tight">{profile.displayName}</h1>
          {profile.role && (
            <p style={{ ...textStyle, opacity: 0.85 }} className="text-sm font-semibold mt-0.5 leading-snug">
              {profile.role}
            </p>
          )}
          {profile.bio && <p style={{ ...textStyle, opacity: 0.7 }} className="text-sm leading-relaxed mt-1.5 max-w-xs">{profile.bio}</p>}
          
          {/* Status Badge (rendered only if showStatusBadge is true) */}
          {profile.showStatusBadge !== false && profile.statusBadge && (
            <StatusPill statusBadge={profile.statusBadge} className="mt-3" />
          )}

          {/* Subdomain pill */}
          <div
            style={{ backgroundColor: 'rgba(0,0,0,0.03)', color: theme.accentColor }}
            className="mt-3.5 inline-block px-3.5 py-1 rounded-full border border-black/10 text-xs font-mono font-semibold"
          >
            {profile.username}.{env.appDomain}
          </div>
        </div>

        {/* Links Stack */}
        <div className="w-full flex flex-col gap-3">
          {links.length === 0 ? (
            <p style={{ ...textStyle, opacity: 0.6 }} className="text-center text-sm py-6">No links added yet.</p>
          ) : (
            links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                style={cardStyle}
                className="group flex items-center justify-between px-4 py-3.5 rounded-2xl border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getPlatformContainerStyle(link.icon || link.title)}`}>
                    {getPlatformIcon(link.icon || link.title, 'w-5 h-5')}
                  </div>
                  <div className="text-left min-w-0">
                    <span style={textStyle} className="font-bold text-sm block truncate leading-snug">{link.title}</span>
                    {link.subtitle && (
                      <span style={{ ...textStyle, opacity: 0.6 }} className="text-xs font-medium block truncate mt-0.5 leading-snug">{link.subtitle}</span>
                    )}
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center shrink-0 group-hover:bg-black/10 transition-colors">
                  <svg style={accentStyle} className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            ))
          )}
        </div>

        <Link to="/" style={{ ...textStyle, opacity: 0.5 }} className="mt-4 flex items-center gap-1 text-xs hover:opacity-100 transition-opacity">
          Powered by <span style={accentStyle} className="font-bold">LinkMakeup</span>
        </Link>
      </div>
    </div>
  );
}
