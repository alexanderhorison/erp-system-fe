import { useEffect, useRef, useState } from 'react'

import { registerConfirmHost } from 'src/helpers/confirm'
import ConfirmDialog from 'src/views/common/ConfirmDialog'

// ** Mounted once in _app.js. Shows whatever `confirm()` asks for, one at a time.
export default function ConfirmHost() {
  const [request, setRequest] = useState(null)
  const [open, setOpen] = useState(false)
  const pending = useRef(null)

  const settle = result => {
    setOpen(false)
    pending.current?.resolve(result)
    pending.current = null
  }

  useEffect(
    () =>
      registerConfirmHost(next => {
        // A newer prompt replaces an unanswered one, which counts as cancelled
        pending.current?.resolve(false)
        pending.current = next
        setRequest(next)
        setOpen(true)
      }),
    []
  )

  if (!request) return null

  const { title, description, confirmLabel, cancelLabel, confirmIcon, destructive } = request

  return (
    <ConfirmDialog
      open={open}
      onClose={() => settle(false)}
      onConfirm={() => settle(true)}
      title={title}
      description={description}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
      confirmIcon={confirmIcon}
      destructive={destructive}
    />
  )
}
