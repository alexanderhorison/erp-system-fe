// ** Imperative confirmation prompt.
// Renders the shared ConfirmDialog (through the single <ConfirmHost /> mounted in
// _app.js) and resolves true on confirm, false on cancel/close. Use it where a
// prompt has to be awaited from non-component code (thunks, helpers); inside a
// component, render <ConfirmDialog /> directly.

let showRequest = null

export const registerConfirmHost = handler => {
  showRequest = handler

  return () => {
    if (showRequest === handler) showRequest = null
  }
}

export const confirm = options =>
  new Promise(resolve => {
    if (!showRequest) {
      resolve(false)

      return
    }

    showRequest({ ...options, resolve })
  })
