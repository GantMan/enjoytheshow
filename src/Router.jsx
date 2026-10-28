import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router'

import Footer from './Footer'
import App from './App'
import NotFound from './NotFound'

// Heavy pages (TensorFlow.js, Amplify, Victory) are split out of the homepage bundle
const Room = lazy(() => import('./Room'))
const WatchRoom = lazy(() => import('./WatchRoom'))

export default function Router() {
  return (
    <div className="site-container">
      <main>
        <Suspense fallback={<p className="centerme loading">Raising the curtain…</p>}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/room/:id" element={<Room />} />
            <Route path="/watch/:id" element={<WatchRoom />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
