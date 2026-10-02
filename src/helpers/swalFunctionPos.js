import { swalError } from './swalFunction'
import { confirm } from 'src/helpers/confirm'
import { messageFromError, messageFromResponse, notifyError, notifySuccess, toast } from 'src/helpers/notify'

// ONLY FOR ADD
export async function swalConfirmationChargePos({
  label,
  text,
  name = 'Data',
  axiosRequest,
  dispatchRequest,
  title,
  // The caller already asked for confirmation (shared ConfirmDialog), so go straight to the request
  skipPrompt = false
}) {
  try {
    const confirmed =
      skipPrompt ||
      (await confirm({
        title,
        description: text,
        confirmLabel: 'Iya',
        cancelLabel: 'Tidak',
        confirmIcon: 'tabler:check',
        destructive: false
      }))

    if (confirmed) {
      // Progress is a toast, not a popup: it never blocks the cashier
      const loadingId = toast.loading('Memproses...')

      try {
        const response = await axiosRequest()
        if (dispatchRequest) {
          dispatchRequest(response)
        }
        notifySuccess(messageFromResponse(response, `${name} berhasil ditambahkan`))
      } finally {
        toast.dismiss(loadingId)
      }
    }
  } catch (error) {
    swalError({ error, label })
    throw error
  }
}

export async function swalConfirmationOnly({
  text,
  description,
  onClickYes = () => {},
  onClickNo = () => {},
  title,
  successMessage = 'Sukses',
  autoSuccess = true,
  confirmButtonText = 'Iya',
  cancelButtonText = 'Tidak',
  confirmIcon = 'tabler:check',
  destructive = false
}) {
  const confirmed = await confirm({
    title,
    description: description || text,
    confirmLabel: confirmButtonText,
    cancelLabel: cancelButtonText,
    confirmIcon,
    destructive
  })

  if (confirmed) {
    const loadingId = toast.loading('Memproses...')
    try {
      // await caller's async operation
      await onClickYes()

      toast.dismiss(loadingId)

      // show success if caller didn't handle it
      if (autoSuccess) {
        notifySuccess(successMessage)
      }
    } catch (error) {
      toast.dismiss(loadingId)
      notifyError(messageFromError(error, 'Terjadi kesalahan'))
      throw error
    }
  } else {
    onClickNo()
  }
}
