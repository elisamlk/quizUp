import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },

  async redirects() {
    return [
      {
        source:
          "/quiz/quiz-nature-plantes-medicinales-connaissances-naturelles",
        destination:
          "/quiz/quiz-plantes-medicinales-phytotherapie",
        permanent: true,
      },
      {
        source:
          "/quiz/quiz-geographie-montagnes-et-sommets-celebres",
        destination:
          "/quiz/quiz-geographie-grandes-montagnes-du-monde",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;


