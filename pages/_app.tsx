import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="min-h-screen w-full bg-black relative overflow-auto font-inter">
        {/* Dark Grid Lines Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, #262626 1px, transparent 1px),
              linear-gradient(to bottom, #262626 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px", // Adjust grid size as needed
          }}
        />
        {/* Your Content Here */}
        <div className="relative z-10">
          <Component {...pageProps} />
        </div>
        <Toaster position="top-right" />
      </div>
    </>
  )
}
