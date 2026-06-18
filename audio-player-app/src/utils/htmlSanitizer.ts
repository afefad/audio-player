export function sanitizeText(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export function sanitizeImageUrl(input: string): string {
  const value = input.trim()

  if (!value) return ''

  if (/^(?:\.{1,2}\/|\/|[a-zA-Z0-9_-]+\/|[a-zA-Z0-9_-]+\.)/.test(value)) {
    if (
      !value.startsWith('javascript:') &&
      !value.startsWith('data:text/html') &&
      !value.includes('<') &&
      !value.includes('>') &&
      !value.includes('"') &&
      !value.includes("'")
    ) {
      return value
    }
  }

  if (value.startsWith('data:')) {
    const isSafeDataImage = /^data:image\/(?:png|jpeg|jpg|webp|gif|bmp);base64,[a-z0-9+/=]+$/i.test(value)
    return isSafeDataImage ? value : ''
  }

  try {
    const url = new URL(value)

    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return url.toString()
    }

    return ''
  } catch {
    return ''
  }
}