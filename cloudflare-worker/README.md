# LinkMakeup social-preview Worker

This is the source for the existing `subdomain-router` Worker. It makes
previews for user subdomains dynamic while retaining the original Vercel
forwarding behaviour for normal browser traffic.

## Deploy

1. In Cloudflare, create a Worker from this directory and deploy it with:

   ```bash
   npx wrangler deploy
   ```

2. The existing Worker route must remain attached in **Workers & Pages →
   subdomain-router → Settings → Triggers**:

   ```text
   *.linkmakeup.com/*
   ```

   This wildcard also covers `api.linkmakeup.com`. That is safe: the Worker
   explicitly bypasses reserved hostnames such as `api`, `www`, and `app`.

3. Keep the wildcard DNS record pointed at Vercel, as it is now. The Worker
   runs before that origin is contacted; normal users still receive Vercel's
   React application.

## Verify

After deployment, this request must show profile metadata rather than the
generic LinkMakeup metadata:

```bash
curl -sSL -A 'WhatsApp/2.24.24.79' https://mee.linkmakeup.com/ | grep 'og:title'
```

The expected title currently begins with `Nasiri Najat`.
