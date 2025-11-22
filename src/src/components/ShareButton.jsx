import { useState } from 'react'
import { generateShareableURL, copyToClipboard } from '../utils/urlSharing'
import { useLanguage } from '../hooks/useLanguage'

function ShareButton({ path, data, className = '' }) {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = generateShareableURL(path, data)
    const success = await copyToClipboard(url)
    
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      className={`share-btn ${className}`}
      onClick={handleShare}
      title={t.shareCalculation}
    >
      {copied ? (
        <>
          <span className="share-icon">✓</span>
          <span>{t.linkCopied}</span>
        </>
      ) : (
        <>
          <span className="share-icon">🔗</span>
          <span>{t.shareLink}</span>
        </>
      )}
    </button>
  )
}

export default ShareButton

