import { useEffect } from 'react'
import { useSettings } from 'src/@core/hooks/useSettings'

/**
 * Collapses the nav sidebar for as long as the calling page is mounted, then
 * restores whatever collapsed/expanded state the user had before. Used on
 * wide, two-column pages (order forms, detail pages) that need the extra
 * width — hovering the collapsed rail still temporarily expands it.
 */
export default function useCollapsedSidebar() {
  const { settings, saveSettings } = useSettings()

  useEffect(() => {
    const wasNavCollapsed = settings.navCollapsed
    if (!wasNavCollapsed) {
      saveSettings({ ...settings, navCollapsed: true })
    }
    return () => {
      saveSettings({ ...settings, navCollapsed: wasNavCollapsed })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
