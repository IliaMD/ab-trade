import React, { useState, useEffect } from 'react'

const sessionKey = 'TabHash'
const localKey = 'TabsOpen'

type LocalStorageTabs = Record<string, number>

const getLocalStorageTabs = (): LocalStorageTabs => {
  return JSON.parse(localStorage.getItem(localKey) || '{}')
}

const setLocalStorageTabs = (tabs: LocalStorageTabs) => {
  localStorage.setItem(localKey, JSON.stringify(tabs))
}

export const Counter = () => {
  const [index, setIndex] = useState(0)
  const [tabsCount, setTabsCount] = useState(Object.keys(getLocalStorageTabs()).length + 1)

  useEffect(() => {
    const updateIndex = () => {
      const hash = sessionStorage.getItem(sessionKey)
      const tabs = getLocalStorageTabs()
      const orderedTabs = Object.keys(tabs).sort((a, b) => tabs[a] - tabs[b])
      const currentIndex = orderedTabs.findIndex(tab => tab === hash)
      setIndex(currentIndex + 1)
    }

    const updateTabsCount = () => {
      const hash = sessionStorage.getItem(sessionKey)
      const tabs = getLocalStorageTabs()

      if (!tabs[hash] && hash) {
        const key = +new Date()
        tabs[hash] = key
        setLocalStorageTabs(tabs)
        updateIndex()
      }

      setTabsCount(Object.keys(tabs).length)
    }

    const handleWindowUnload = (e: Event) => {
      let hash = sessionStorage.getItem(sessionKey)
      let tabs = getLocalStorageTabs()
      delete tabs[hash as string]
      setLocalStorageTabs(tabs)
      updateIndex()
    }

    const handleWindowLoad = (e: Event) => {
      const key = +new Date()
      let hash = 'tab_' + key
      sessionStorage.setItem(sessionKey, hash)
      let tabs = getLocalStorageTabs()
      tabs[hash] = key
      setLocalStorageTabs(tabs)
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
