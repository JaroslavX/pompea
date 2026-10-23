const routes = [
  "4uda_paramanu", "4uda_vervytsi", "5kratnyj_paraman", "feedback", "feedback2",
  "istorija_deviatnytsi", "istorija_paramanu", "istorija_vervytsi",
  "jak_molytysia_devytnitsy", "jak_molytysia_na_vervytsi", "obitnytsi_vervytsi",
  "obovjazky_paramanu", "peremogy_vervytsi", "pozertva", "successful",
  "ymovy_perestorogy", "zelenyj_paraman",
];

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Do not advertise the framework in responses.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Adds ?dpl=<id> to static asset URLs so stale nginx/browser caches are bypassed.
  // Bump this on every deploy.
  deploymentId: "d10231822",
  // The host's nginx/rewrite rules do not forward /_next/image to the app, so serve public/ files directly.
  images: { unoptimized: true },
  // Old PHP site URLs (/files/<name>.php and /<name>.php) -> new routes
  async redirects() {
    return [
      { source: "/files/index.php", destination: "/", permanent: true },
      { source: "/index.php", destination: "/", permanent: true },
      ...routes.flatMap((r) => [
        { source: `/files/${r}.php`, destination: `/${r}`, permanent: true },
        { source: `/${r}.php`, destination: `/${r}`, permanent: true },
      ]),
    ];
  },
};

export default nextConfig;
