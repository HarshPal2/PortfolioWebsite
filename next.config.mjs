/** Freedom portfolio — static export for GitHub Pages (harshdesignspal.com). */
const nextConfig = {
  output: 'export',
  trailingSlash: true,          // /projects/ and /reading/<slug>/ keep their old URLs
  images: { unoptimized: true },
  reactStrictMode: false,       // the scene controllers run once per page load, like the original scripts
  devIndicators: false,
};
export default nextConfig;
