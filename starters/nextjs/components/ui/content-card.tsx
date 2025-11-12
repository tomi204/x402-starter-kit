'use client'

import Link from 'next/link'
import { useState } from 'react'

interface ContentCardProps {
  title: string
  description: string
  price: string
  href: string
  icon: string
  gradient: string
}

export function ContentCard({ title, description, price, href, icon, gradient }: ContentCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden rounded-lg border border-red-900/30 bg-neutral-950 p-6 transition-all hover:border-red-600"
    >
      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-mono text-gray-500">
            API ENDPOINT
          </div>
          <div className="rounded bg-red-600 px-3 py-1">
            <span className="text-sm font-semibold text-white">{price}</span>
          </div>
        </div>

        <h3 className="mb-2 text-xl font-bold text-white">
          {title}
        </h3>

        <p className="mb-4 text-sm text-gray-400">
          {description}
        </p>

        <div className="flex items-center text-sm font-medium text-red-600">
          <span>Access Content</span>
          <svg
            className={`ml-2 h-4 w-4 transition-transform ${isHovered ? 'translate-x-1' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  )
}
