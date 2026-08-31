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
  return runRequest({ axiosRequest, dispatchRequest, label, successMessage: `"${name}" berhasil dihapus` })
}

// DELETE WITHOUT PROMPT
// Confirmation is handled by the shared `ConfirmDialog` component, so this only
// performs the request and reports the outcome.
export async function swalDeleteConfirmed({ label, name = 'Data', axiosRequest, dispatchRequest }) {
  return runRequest({ axiosRequest, dispatchRequest, label, successMessage: `"${name}" berhasil dihapus` })
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
    successMessage: `${name} berhasil ditambahkan`
  })
}

// EDIT
export async function swalConfirmationEdit({ label, name = 'Data', axiosRequest, dispatchRequest }) {
  return runRequest({ axiosRequest, dispatchRequest, label, successMessage: `${name} berhasil diubah` })
}

// RESTORE
export async function swalConfirmationRestore({ label, name = 'Data', axiosRequest, dispatchRequest }) {
  return runRequest({ axiosRequest, dispatchRequest, label, successMessage: `${name} berhasil dikembalikan` })
}

// DEFAULT SUCCESS
export function swalSuccess({ name, response }) {
  return notifySuccess(messageFromResponse(response, `"${name}" berhasil dihapus`))
}

// DEFAULT ERROR
export function swalError({ error, label }) {
  return notifyError(messageFromError(error, `Gagal melakukan aksi pada ${label}`))
}

export function swalToastError({ error, label }) {
  return notifyError(messageFromError(error, `Gagal melakukan aksi pada ${label}`))
}

export function swalToastSuccess({ response, label }) {
  return notifySuccess(messageFromResponse(response, `Berhasil melakukan aksi pada ${label}`))
}

export function swalNotifSuccess({ message }) {
  return notifySuccess(message || 'Berhasil')
}

export function swalNotifError({ message }) {
  return notifyError(message || 'Gagal')
}

export function swalInfo(message) {
  return notifyInfo(message || 'Email Telah Dikirim')
}
