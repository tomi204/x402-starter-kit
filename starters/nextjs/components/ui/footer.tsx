export function Footer() {
  return (
    <footer className="border-t border-red-900/30 bg-black/50 backdrop-blur-sm py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <span>Built with</span>
          <span className="text-red-500 animate-pulse">❤️</span>
          <span>for</span>
          <a
            href="https://github.com/tomi204"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-red-500 transition-colors hover:text-red-400"
          >
            tomi204
          </a>
        </div>
      </div>
    </footer>
  )
}
