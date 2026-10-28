import React, { useEffect, useRef } from 'react'

// Don't download the demo clip until it scrolls near the viewport
export default function DemoVideo() {
  const ref = useRef(null)

  useEffect(() => {
    const video = ref.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        video.src = '/enjoyingtheshow2.mp4'
        video.play().catch(() => {})
        observer.disconnect()
      },
      { rootMargin: '200px' }
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      width="640"
      height="230"
      aria-label="Demo: audience faces being summarized into a live emotion chart"
    />
  )
}
