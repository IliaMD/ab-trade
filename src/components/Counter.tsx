import React, { useState, useEffect } from 'react'

const sessionKey = 'TabHash'
const localKey = 'TabsOpen'

export const Counter = () => {
  const [index, setIndex] = useState(0)
  const [tabsCount, setTabsCount] = useState(Object.keys(JSON.parse(localStorage.getItem(localKey) || '{}')).length + 1)

  useEffect(() => {
    const updateIndex = () => {
      const hash = sessionStorage.getItem(sessionKey)
      const tabs = JSON.parse(localStorage.getItem(localKey) || '{}')
      const orderedTabs = Object.keys(tabs).sort((a, b) => tabs[a] - tabs[b])
      const currentIndex = orderedTabs.findIndex(tab => tab === hash)
      setIndex(currentIndex + 1)
    }

    const updateTabsCount = () => {
      const tabs = Object.keys(JSON.parse(localStorage.getItem(localKey) || '{}')).length
      setTabsCount(tabs)
    }

    const handleWindowUnload = (e: Event) => {
      let hash = sessionStorage.getItem(sessionKey)
      let tabs = JSON.parse(localStorage.getItem(localKey) || '{}')
      delete tabs[hash as string]
      localStorage.setItem(localKey, JSON.stringify(tabs))
      updateIndex()
    }

    const handleWindowLoad = (e: Event) => {
      const key = +new Date()
      let hash = 'tab_' + key
      sessionStorage.setItem(sessionKey, hash)
      let tabs = JSON.parse(localStorage.getItem(localKey) || '{}')
      tabs[hash] = key
      localStorage.setItem(localKey, JSON.stringify(tabs))
      updateIndex()
    }

    updateIndex()

    window.onunload = handleWindowUnload
    window.onload = handleWindowLoad

    window.addEventListener('storage', updateIndex)
    window.addEventListener('storage', updateTabsCount)

    return () => {
      window.removeEventListener('storage', updateIndex)
      window.removeEventListener('storage', updateTabsCount)
    }
  }, [])

  return (
    <div>
      <a href="/" target="_blank">
        Открыть новую вкладку
      </a>
      <p>
        Вкладка {index} из {tabsCount}
      </p>
    </div>
  )
}
