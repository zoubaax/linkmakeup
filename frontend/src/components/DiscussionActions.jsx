import { Link, useParams } from 'react-router-dom';
import AppLayout from './layout/AppLayout';

const inputClass =
  'w-full px-3.5 py-2.5 bg-surface-alt border border-border rounded-xl text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-emerald-500 transition-colors';

export default function NewDiscussionPage() {
  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <Link to="/discussions" className="text-sm text-fg-muted hover:text-fg transition-colors">
          ← Back to discussions
        </Link>
        <h1 className="text-2xl font-bold text-fg mt-4">Start a new discussion</h1>
        <p className="text-fg-muted text-sm mt-2">
          You&apos;re signed in. Discussion posting will be available in a future update.
        </p>
        <div className="mt-8 p-6 rounded-xl bg-surface border border-border shadow-sm">
          <label htmlFor="title" className="block text-sm font-medium text-fg-muted mb-2">Title</label>
          <input id="title" type="text" placeholder="What's on your mind?" disabled className={`${inputClass} opacity-60 cursor-not-allowed`} />
          <button type="button" disabled className="mt-4 px-4 py-2 rounded-lg bg-emerald-600/50 text-white/70 text-sm font-semibold cursor-not-allowed">
            Post discussion
          </button>
        </div>
      </div>
    </AppLayout>
  );
}

export function ReplyDiscussionPage() {
  const { id } = useParams();

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <Link to="/discussions" className="text-sm text-fg-muted hover:text-fg transition-colors">
          ← Back to discussions
        </Link>
        <h1 className="text-2xl font-bold text-fg mt-4">Reply to discussion</h1>
        <p className="text-fg-muted text-sm mt-2">
          Thread #{id} — you&apos;re signed in and can reply once posting is enabled.
        </p>
        <div className="mt-8 p-6 rounded-xl bg-surface border border-border shadow-sm">
          <textarea rows={4} placeholder="Write your reply..." disabled className={`${inputClass} resize-none opacity-60 cursor-not-allowed`} />
          <button type="button" disabled className="mt-4 px-4 py-2 rounded-lg bg-blue-600/50 text-white/70 text-sm font-semibold cursor-not-allowed">
            Post reply
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
