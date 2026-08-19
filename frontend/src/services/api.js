import { env } from '../config/env';

const API_BASE_URL = env.apiUrl;

class ApiService {
  static _responseCache = new Map();
  static _cacheTTL = 3 * 60 * 1000; // 3 minutes TTL

  static invalidateCache(pattern) {
    if (!pattern) {
      this._responseCache.clear();
      return;
    }
    for (const key of this._responseCache.keys()) {
      if (key.includes(pattern)) {
        this._responseCache.delete(key);
      }
    }
  }

  static async request(endpoint, options = {}) {
    const isGet = !options.method || options.method.toUpperCase() === 'GET';
    const useCache = isGet && options.useMemoryCache !== false;
    const cacheKey = `${options.method || 'GET'}:${endpoint}`;

    if (useCache) {
      const cached = this._responseCache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp < this._cacheTTL)) {
        return cached.data;
      }
    }

    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    const { cache, useMemoryCache, ...fetchOptions } = options;

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        credentials: 'include',
        cache: cache ?? 'default',
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = data.message
          || (response.status === 413 ? 'Image is too large. Try a smaller photo.' : null)
          || `API Request failed with status ${response.status}`;
        throw new Error(message);
      }

      if (useCache && data.success !== false) {
        this._responseCache.set(cacheKey, { data, timestamp: Date.now() });
      }

      if (!isGet) {
        this.invalidateCache();
      }

      return data;
    } catch (error) {
      if (endpoint !== '/auth/me') {
        console.error(`❌ API Error [${endpoint}]:`, error.message);
      }
      throw error;
    }
  }

  // 🏥 System Health Check
  static async checkHealth() {
    return this.request('/health');
  }

  // 📊 First-party analytics
  static async recordAnalytics({ username, eventType, linkId, referrer, deviceType }) {
    return this.request('/analytics/track', {
      method: 'POST',
      body: JSON.stringify({ username, eventType, linkId, referrer, deviceType }),
      keepalive: true,
    });
  }

  static async getMyAnalyticsSummary(period = '30d') {
    return this.request(`/analytics/me/summary?period=${encodeURIComponent(period)}`, { cache: 'no-store' });
  }

  static async getMyAnalyticsLinks(period = '30d') {
    return this.request(`/analytics/me/links?period=${encodeURIComponent(period)}`, { cache: 'no-store' });
  }

  static async getAdminAnalyticsSummary(period = '30d') {
    return this.request(`/admin/analytics/summary?period=${encodeURIComponent(period)}`, { cache: 'no-store' });
  }

  static async getAdminAnalyticsPages({ page = 1, limit = 10, search = '', sort = 'views', status = 'all' } = {}) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set('search', search);
    if (sort && sort !== 'views') params.set('sort', sort);
    if (status && status !== 'all') params.set('status', status);
    return this.request(`/admin/analytics/pages?${params.toString()}`, { cache: 'no-store' });
  }

  // 📤 CSV export helpers (server-generated .csv downloads)
  static async requestCsv(endpoint) {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      credentials: 'include',
      headers: { Accept: 'text/csv' },
      cache: 'no-store',
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      const message = data.message || `Export failed with status ${response.status}`;
      throw new Error(message);
    }

    return response.blob();
  }

  static async getAdminUsersCsv({ search = '', status = 'all' } = {}) {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status && status !== 'all') params.set('status', status);
    return this.requestCsv(`/admin/users/export?${params.toString()}`);
  }

  static async getAdminProfilesCsv({ search = '', status = 'all' } = {}) {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status && status !== 'all') params.set('status', status);
    return this.requestCsv(`/admin/profiles/export?${params.toString()}`);
  }

  static async getAdminLinksCsv({ search = '', status = 'all' } = {}) {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status && status !== 'all') params.set('status', status);
    return this.requestCsv(`/admin/links/export?${params.toString()}`);
  }

  static async getAdminAuditLogsCsv({ action = 'all', actor = '' } = {}) {
    const params = new URLSearchParams();
    if (action && action !== 'all') params.set('action', action);
    if (actor) params.set('actor', actor);
    return this.requestCsv(`/admin/audit-logs/export?${params.toString()}`);
  }

  static async getAdminAnalyticsPagesCsv({ search = '', status = 'all' } = {}) {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status && status !== 'all') params.set('status', status);
    return this.requestCsv(`/admin/analytics/export?${params.toString()}`);
  }

  // 🔐 Authentication Endpoints
  static async signupWithEmail(data) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async loginWithEmail(data) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async verifyEmail(data) {
    return this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async resendVerificationCode(data) {
    return this.request('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async sendWalletEmail(data) {
    return this.request('/wallet/send-email', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async getGoogleAuthUrl() {
    return this.request('/auth/google');
  }

  static async mockLogin() {
    return this.request('/auth/mock-login', {
      method: 'POST',
    });
  }

  static async getCurrentUser() {
    return this.request('/auth/me', { cache: 'no-store' });
  }

  static async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // 🔍 Profile & Username Onboarding
  static async checkUsernameAvailability(username) {
    return this.request(`/profiles/check-availability?username=${encodeURIComponent(username)}`);
  }

  static async createProfile(profileData) {
    return this.request('/profiles', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  static async updateProfile(profileData) {
    return this.request('/profiles/me', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
      cache: 'no-store',
    });
  }

  static async getAvatarUploadSignature() {
    return this.request('/profiles/avatar-upload-signature', {
      method: 'POST',
    });
  }

  static async getPublicProfile(username) {
    return this.request(`/profiles/${encodeURIComponent(username)}`);
  }

  // 🔗 Link Management (Protected)
  static async getUserLinks() {
    return this.request('/links');
  }

  // 📊 Public analytics tracking (fire-and-forget)
  static async postAnalytics(endpoint, payload) {
    try {
      await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
        cache: 'no-store',
        keepalive: true,
      });
    } catch {
      // Ignore tracking failures silently
    }
  }

  static trackPageView(profileId) {
    return this.postAnalytics('/analytics/page-view', { profileId });
  }

  static trackLinkClick(profileId, linkId) {
    return this.postAnalytics('/analytics/link-click', { profileId, linkId });
  }

  static async createLink(linkData) {
    return this.request('/links', {
      method: 'POST',
      body: JSON.stringify(linkData),
    });
  }

  static async updateLink(id, updateData) {
    return this.request(`/links/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
  }

  static async deleteLink(id) {
    return this.request(`/links/${id}`, {
      method: 'DELETE',
    });
  }

  static async reorderLinks(linkIds) {
    return this.request('/links/reorder', {
      method: 'PATCH',
      body: JSON.stringify({ linkIds }),
    });
  }

  static async getAdminStats() {
    return this.request('/admin/stats', { cache: 'no-store' });
  }

  static async adminSearch(q, limit = 8) {
    const params = new URLSearchParams({ q, limit: String(limit) });
    return this.request(`/admin/search?${params.toString()}`, { cache: 'no-store' });
  }

  static async getAdminNotes({ targetType, targetId }) {
    const params = new URLSearchParams({ targetType, targetId });
    return this.request(`/admin/notes?${params.toString()}`, { cache: 'no-store' });
  }

  static async createAdminNote({ targetType, targetId, body }) {
    return this.request('/admin/notes', {
      method: 'POST',
      body: JSON.stringify({ targetType, targetId, body }),
    });
  }

  static async deleteAdminNote(noteId) {
    return this.request(`/admin/notes/${encodeURIComponent(noteId)}`, {
      method: 'DELETE',
    });
  }

  static async getAdminUsers({ page = 1, limit = 20, search = '', status = 'all' } = {}) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set('search', search);
    if (status && status !== 'all') params.set('status', status);
    return this.request(`/admin/users?${params.toString()}`, { cache: 'no-store' });
  }

  static async getAdminUser(userId) {
    return this.request(`/admin/users/${encodeURIComponent(userId)}`, { cache: 'no-store' });
  }

  static async getAdminProfiles({ page = 1, limit = 20, search = '', status = 'all' } = {}) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set('search', search);
    if (status && status !== 'all') params.set('status', status);
    return this.request(`/admin/profiles?${params.toString()}`, { cache: 'no-store' });
  }

  static async getAdminUsersExport({ search = '', status = 'all' } = {}) {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status && status !== 'all') params.set('status', status);
    return this.request(`/admin/users/export?${params.toString()}`, { cache: 'no-store' });
  }

  static async getAdminProfilesExport({ search = '', status = 'all' } = {}) {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status && status !== 'all') params.set('status', status);
    return this.request(`/admin/profiles/export?${params.toString()}`, { cache: 'no-store' });
  }

  static async getAdminLinksExport({ search = '', status = 'all' } = {}) {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status && status !== 'all') params.set('status', status);
    return this.request(`/admin/links/export?${params.toString()}`, { cache: 'no-store' });
  }

  static async getAdminLinks({ page = 1, limit = 20, search = '', status = 'all' } = {}) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set('search', search);
    if (status && status !== 'all') params.set('status', status);
    return this.request(`/admin/links?${params.toString()}`, { cache: 'no-store' });
  }

  static async patchAdminLink(linkId, { isActive, reason }) {
    return this.request(`/admin/links/${encodeURIComponent(linkId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive, reason }),
    });
  }

  static async deleteAdminLink(linkId, { reason }) {
    return this.request(`/admin/links/${encodeURIComponent(linkId)}`, {
      method: 'DELETE',
      body: JSON.stringify({ reason }),
    });
  }

  static async patchAdminProfileSuspension(profileId, { suspended, reason }) {
    return this.request(`/admin/profiles/${encodeURIComponent(profileId)}/suspension`, {
      method: 'PATCH',
      body: JSON.stringify({ suspended, reason }),
    });
  }

  static async getAdminAuditLogs({
    page = 1,
    limit = 20,
    action = 'all',
    actor = '',
    targetId,
    targetIds,
  } = {}) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (action && action !== 'all') params.set('action', action);
    if (actor) params.set('actor', actor);
    if (targetId) params.set('targetId', targetId);
    if (targetIds?.length) params.set('targetIds', targetIds.join(','));
    return this.request(`/admin/audit-logs?${params.toString()}`, { cache: 'no-store' });
  }

  static async sendAdminOnboardingReminder(userId) {
    return this.request(`/admin/users/${encodeURIComponent(userId)}/remind-onboarding`, {
      method: 'POST',
    });
  }

  static async sendAdminBulkOnboardingReminders() {
    return this.request('/admin/users/remind-all-onboarding', {
      method: 'POST',
    });
  }

  static async getAdminAuditLogsExport({ action = 'all', actor = '' } = {}) {
    const params = new URLSearchParams();
    if (action && action !== 'all') params.set('action', action);
    if (actor) params.set('actor', actor);
    return this.request(`/admin/audit-logs/export?${params.toString()}`, { cache: 'no-store' });
  }

  // 📈 Admin analytics
  static async getAdminAnalytics({ period = '30d' } = {}) {
    return this.request(`/admin/analytics?period=${encodeURIComponent(period)}`, { cache: 'no-store' });
  }

  static async getAdminAnalyticsPages({ page = 1, limit = 20, search = '', status = 'all', sort = 'views', period = '30d' } = {}) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set('search', search);
    if (status && status !== 'all') params.set('status', status);
    if (sort && sort !== 'views') params.set('sort', sort);
    if (period) params.set('period', period);
    return this.request(`/admin/analytics/pages?${params.toString()}`, { cache: 'no-store' });
  }

  static async getAdminAnalyticsPagesExport({ search = '', status = 'all' } = {}) {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status && status !== 'all') params.set('status', status);
    return this.request(`/admin/analytics/export?${params.toString()}`, { cache: 'no-store' });
  }

  // 💳 NFC Orders API
  static async createNfcOrder(orderData) {
    this.invalidateCache('/admin/orders');
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  static async getAdminOrders({ page = 1, limit = 10, search = '', status = 'all' } = {}) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set('search', search);
    if (status && status !== 'all') params.set('status', status);
    return this.request(`/admin/orders?${params.toString()}`, { useMemoryCache: true });
  }

  static async updateAdminOrderStatus(orderId, status) {
    this.invalidateCache('/admin/orders');
    return this.request(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }
}

export default ApiService;
