import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AppLayout from './layout/AppLayout';
import PageHeader from './ui/PageHeader';
import StatusBadge from './StatusBadge';
import { loginPathWithReturnTo } from '../utils/authRedirect';

const DISCUSSIONS = [
  { id: '1', title: 'Best practices for link page SEO', author: 'maya.c', replies: 12, status: 'open', lastActive: '2h ago' },
  { id: '2', title: 'Custom subdomain setup on Cloudflare', author: 'alex.dev', replies: 8, status: 'active', lastActive: '45m ago' },
  { id: '3', title: 'Weekly creator office hours — Q&A thread', author: 'linkmakeup', replies: 24, status: 'scheduled', lastActive: 'Starts Mon 3pm' },
  { id: '4', title: 'Theme ideas for portfolio-style profiles', author: 'jordan.k', replies: 5, status: 'open', lastActive: '1d ago' },
];

const SCHEDULE = [
  { id: 's1', title: 'Creator Office Hours', when: 'Mon, Aug 18 · 3:00 PM' },
  { id: 's2', title: 'Link Analytics Beta Launch', when: 'Thu, Aug 21 · 10:00 AM' },
  { id: 's3', title: 'Profile Design Workshop', when: 'Sat, Aug 23 · 1:00 PM' },
];

function ProtectedActionButton({ children, returnTo, className }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (user) navigate(returnTo);
    else navigate(loginPathWithReturnTo(returnTo));
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}

export default function DiscussionsPage() {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <PageHeader
          title="Discussions"
          description="Browse community threads — sign in to post or reply."
          actions={
            <ProtectedActionButton
              returnTo="/discussions/new"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-fg hover:bg-primary-hover text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              New Discussion
            </ProtectedActionButton>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          <section className="space-y-3">
            {DISCUSSIONS.map((thread) => (
              <article
                key={thread.id}
                className="p-4 rounded-xl bg-surface border border-border hover:border-accent hover:shadow-md transition-all duration-200 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="font-medium text-fg truncate">{thread.title}</h2>
                    <p className="text-sm text-fg-subtle mt-1">
                      by {thread.author} · {thread.replies} replies · {thread.lastActive}
                    </p>
                  </div>
                  <StatusBadge status={thread.status} />
                </div>
                <div className="mt-3 flex gap-2">
                  <button type="button" className="text-sm text-accent hover:text-accent-hover font-medium transition-colors">
                    Read thread
                  </button>
                  <span className="text-border-strong">·</span>
                  <ProtectedActionButton
                    returnTo={`/discussions/${thread.id}/reply`}
                    className="text-sm text-fg-muted hover:text-fg font-medium transition-colors"
                  >
                    Reply
                  </ProtectedActionButton>
                </div>
              </article>
            ))}
          </section>

          <aside>
            <div className="rounded-xl bg-surface border border-border p-5 lg:sticky lg:top-20 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <h2 className="font-semibold text-fg">Upcoming Schedule</h2>
              </div>
              <ul className="space-y-4">
                {SCHEDULE.map((event) => (
                  <li key={event.id} className="border-l-2 border-accent-border pl-3">
                    <p className="text-sm font-medium text-fg">{event.title}</p>
                    <p className="text-xs text-fg-muted mt-0.5">{event.when}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-5 pt-4 border-t border-border space-y-2">
                <span className="text-xs text-fg-subtle">Status legend</span>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status="open" />
                  <StatusBadge status="active" />
                  <StatusBadge status="scheduled" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}
