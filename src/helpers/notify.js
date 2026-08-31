import { toast } from 'sonner'

/**
 * notify
 * -------------------------------------------------------------------------------------
 * The single notification API for the app (Sonner).
 *
 * Replaces the SweetAlert popups that used to interrupt every action. These are
 * non-blocking toasts: they never take focus and never need dismissing to
 * continue working.
 *
 * Confirmation *prompts* are not here — those are a UI concern owned by the
 * shared `ConfirmDialog` component. This module only reports outcomes.
 */

// ** Pull the human-readable message the API returned, falling back to a
// caller-supplied default. Both axios error shapes are handled: a rejected
// response, and a bare network/timeout error with no response at all.
const messageFromResponse = (response, fallback) => response?.data?.message || fallback

const messageFromError = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback

export const notifySuccess = (message, options) => toast.success(message, options)

export const notifyError = (message, options) => toast.error(message, options)

export const notifyInfo = (message, options) => toast.info(message, options)

export const notifyWarning = (message, options) => toast.warning(message, options)

/** Pending → resolved/rejected in one toast, for a long request. */
export const notifyPromise = (promise, { loading, success, error }) =>
  toast.promise(promise, { loading, success, error })

export const dismissNotification = toastId => toast.dismiss(toastId)

/** `name` created / updated / deleted successfully. */
export const notifyCreated = (name, response) =>
  notifySuccess(messageFromResponse(response, `${name} created successfully`))

export const notifyUpdated = (name, response) =>
  notifySuccess(messageFromResponse(response, `${name} updated successfully`))

export const notifyDeleted = (name, response) =>
  notifySuccess(messageFromResponse(response, `${name} deleted successfully`))

export const notifyRestored = (name, response) =>
  notifySuccess(messageFromResponse(response, `${name} restored successfully`))

/** Reports a failed request, preferring the API's own message. */
export const notifyRequestError = (error, label) =>
  notifyError(messageFromError(error, label ? `Failed to complete action on ${label}` : 'Something went wrong'))

export { messageFromError, messageFromResponse, toast }
