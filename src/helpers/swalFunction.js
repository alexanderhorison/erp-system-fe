import {
  messageFromError,
  messageFromResponse,
  notifyError,
  notifyInfo,
  notifySuccess
} from 'src/helpers/notify'

/**
 * swalFunction
 * -------------------------------------------------------------------------------------
 * Notification helpers. Despite the name (kept so the ~430 existing call sites
 * keep working), these no longer use SweetAlert — every one now raises a Sonner
 * toast. See `src/helpers/notify.js` for the underlying API.
 *
 * New code should import from `src/helpers/notify` directly.
 *
 * The `swalConfirmation*` helpers used to *block* on a SweetAlert prompt and
 * only fire the request if the user confirmed. Confirmation is now owned by the
 * shared `ConfirmDialog` component, so these perform the request immediately and
 * report the outcome. Their signatures, return values and thrown errors are
 * unchanged, so callers keep working — but a caller that has not yet adopted
 * `ConfirmDialog` will no longer prompt before acting.
 */

// ** Runs the request, fires the follow-up dispatch, and reports the outcome.
// Shared by every helper below so success/error handling stays identical.
const runRequest = async ({ axiosRequest, dispatchRequest, label, successMessage }) => {
  try {
    const response = await axiosRequest()
    if (dispatchRequest) {
      dispatchRequest()
    }
    notifySuccess(messageFromResponse(response, successMessage))

    return response
  } catch (error) {
    swalError({ error, label })
    throw error
  }
}

// DELETE
export async function swalConfirmationDelete({ label, name = 'Data', axiosRequest, dispatchRequest }) {
  return runRequest({ axiosRequest, dispatchRequest, label, successMessage: `${name} deleted successfully` })
}

// DELETE WITHOUT PROMPT
// Confirmation is handled by the shared `ConfirmDialog` component, so this only
// performs the request and reports the outcome.
export async function swalDeleteConfirmed({ label, name = 'Data', axiosRequest, dispatchRequest }) {
  return runRequest({ axiosRequest, dispatchRequest, label, successMessage: `${name} deleted successfully` })
}

// ADD
export async function swalConfirmationAdd({
  label,
  name = 'Data',
  axiosRequest,
  dispatchRequest,
  paymentSelection = false
}) {
  // ** `paymentSelection` used to render a radio group inside the prompt and
  // pass the chosen terms to the request. With the prompt gone the request is
  // called with the option the radio defaulted to ("NO_PAYMENT" => false), so
  // the behaviour matches a user who accepted the default.
  return runRequest({
    axiosRequest: paymentSelection ? () => axiosRequest(false) : axiosRequest,
    dispatchRequest,
    label,
    successMessage: `${name} added successfully`
  })
}

// EDIT
export async function swalConfirmationEdit({ label, name = 'Data', axiosRequest, dispatchRequest }) {
  return runRequest({ axiosRequest, dispatchRequest, label, successMessage: `${name} updated successfully` })
}

// RESTORE
export async function swalConfirmationRestore({ label, name = 'Data', axiosRequest, dispatchRequest }) {
  return runRequest({ axiosRequest, dispatchRequest, label, successMessage: `${name} restored successfully` })
}

// DEFAULT SUCCESS
export function swalSuccess({ name, response }) {
  return notifySuccess(messageFromResponse(response, `${name} saved successfully`))
}

// DEFAULT ERROR
export function swalError({ error, label }) {
  return notifyError(messageFromError(error, `Failed to complete action on ${label}`))
}

export function swalToastError({ error, label }) {
  return notifyError(messageFromError(error, `Failed to complete action on ${label}`))
}

export function swalToastSuccess({ response, label }) {
  return notifySuccess(messageFromResponse(response, `${label} completed successfully`))
}

export function swalNotifSuccess({ message }) {
  return notifySuccess(message || 'Success')
}

export function swalNotifError({ message }) {
  return notifyError(message || 'Failed')
}

export function swalInfo(message) {
  return notifyInfo(message || 'Email has been sent')
}
