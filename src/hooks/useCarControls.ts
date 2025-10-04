import { useEffect, useState } from 'react'

export function useCarControls() {
  const [keys, setKeys] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    turbo: false,
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setKeys((k) => ({ ...k, turbo: true }))
        return
      }
      
      switch (e.key.toLowerCase()) {
        case 'w':
          setKeys((k) => ({ ...k, forward: true }))
          break
        case 's':
          setKeys((k) => ({ ...k, backward: true }))
          break
        case 'a':
          setKeys((k) => ({ ...k, left: true }))
          break
        case 'd':
          setKeys((k) => ({ ...k, right: true }))
          break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setKeys((k) => ({ ...k, turbo: false }))
        return
      }
      
      switch (e.key.toLowerCase()) {
        case 'w':
          setKeys((k) => ({ ...k, forward: false }))
          break
        case 's':
          setKeys((k) => ({ ...k, backward: false }))
          break
        case 'a':
          setKeys((k) => ({ ...k, left: false }))
          break
        case 'd':
          setKeys((k) => ({ ...k, right: false }))
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return keys
}

