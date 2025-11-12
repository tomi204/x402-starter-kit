'use client'

interface Stat {
  label: string
  value: string
}

export function Stats() {
  const stats: Stat[] = [
    {
      label: 'Transaction Speed',
      value: '<1s'
    },
    {
      label: 'Network Fee',
      value: '~$0.001'
    },
    {
      label: 'Chain ID',
      value: '43113'
    }
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border border-red-900/30 bg-neutral-950 p-6 text-center"
        >
          <div className="text-3xl font-bold text-red-600 mb-2">
            {stat.value}
          </div>
          <div className="text-sm text-gray-400 font-mono uppercase tracking-wider">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}
