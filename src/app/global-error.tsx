// app/global-error.tsx
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-2xl mb-4">Beklenmeyen bir hata oluştu</h2>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Tekrar dene
          </button>
        </div>
      </body>
    </html>
  )
}

