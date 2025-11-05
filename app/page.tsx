'use client'

import dynamic from 'next/dynamic'

const TomatoScene = dynamic(() => import('./components/TomatoScene'), {
  ssr: false,
})

export default function Home() {
  return (
    <main>
      <TomatoScene />
    </main>
  )
}
