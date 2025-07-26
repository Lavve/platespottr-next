import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  devIndicators: false,
  output: 'standalone',
  headers: async () => {
    return [
      {
        source: '/service-worker.js',
        headers: [
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
    ]
  },
  webpack: config => {
    config.module.rules.push({
      test: /\.json$/,
      type: 'json',
    })
    return config
  },
}

export default withNextIntl(nextConfig)
