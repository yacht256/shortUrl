'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

type Link = {
  id: number
  slug: string
  targetUrl: string
  createdAt: string
}

export default function HomePage() {
  const router = useRouter()
  const [links, setLinks] = useState<Link[]>([])
  const [url, setUrl] = useState('')
  const [slug, setSlug] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [lastShortUrl, setLastShortUrl] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    fetchLinks()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchLinks() {
    const res = await fetch('/api/links')
    if (res.ok) {
      const data = await res.json()
      setLinks(data.links)
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    setLastShortUrl('')

    const body: { url: string; slug?: string } = { url }
    if (slug.trim()) body.slug = slug.trim()

    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    setSubmitting(false)

    if (res.ok) {
      const data = await res.json()
      setLastShortUrl(data.shortUrl)
      setUrl('')
      setSlug('')
      await fetchLinks()
    } else {
      const data = await res.json()
      setError(data.error ?? 'Failed to create short link')
    }
  }

  async function handleCopy(text: string) {
    await navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(null), 2000)
  }

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <h1 className="text-lg font-semibold text-zinc-900">URL Shortener</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-zinc-500 hover:text-zinc-900"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10 flex flex-col gap-8">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="url" className="text-sm font-medium text-zinc-700">
                URL to shorten
              </label>
              <input
                id="url"
                type="url"
                required
                autoFocus
                placeholder="https://example.com/very/long/url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="slug" className="text-sm font-medium text-zinc-700">
                Custom slug{' '}
                <span className="font-normal text-zinc-400">(optional)</span>
              </label>
              <input
                id="slug"
                type="text"
                placeholder="my-link"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="self-start rounded-md bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
            >
              {submitting ? 'Shortening…' : 'Shorten'}
            </button>
          </form>
        </div>

        {lastShortUrl && (
          <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-5 py-4 shadow-sm">
            <span className="truncate text-sm font-medium text-zinc-900">{lastShortUrl}</span>
            <button
              onClick={() => handleCopy(lastShortUrl)}
              className="ml-4 shrink-0 rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
            >
              {copied === lastShortUrl ? 'Copied!' : 'Copy'}
            </button>
          </div>
        )}

        {links.length > 0 && (
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Recent links
            </h2>
            <div className="divide-y divide-zinc-100 rounded-lg border border-zinc-200 bg-white shadow-sm">
              {links.map((link) => {
                const shortUrl = `${window.location.origin}/${link.slug}`
                return (
                  <div key={link.id} className="flex items-center gap-4 px-5 py-3">
                    <span className="w-28 shrink-0 truncate text-sm font-medium text-zinc-900">
                      /{link.slug}
                    </span>
                    <span className="flex-1 truncate text-sm text-zinc-500">
                      {link.targetUrl}
                    </span>
                    <button
                      onClick={() => handleCopy(shortUrl)}
                      className="shrink-0 rounded-md border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                    >
                      {copied === shortUrl ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
