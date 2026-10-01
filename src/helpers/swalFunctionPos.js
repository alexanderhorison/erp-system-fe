import swal from 'src/pages/sweetalert'
import { swalError } from './swalFunction'
import { messageFromError, messageFromResponse, notifyError, notifySuccess, toast } from 'src/helpers/notify'
import { environtmentColor } from 'src/helpers/getEnvirontmentColor'

// ONLY FOR ADD
export async function swalConfirmationChargePos({
  label,
  text,
  width = 300,
  name = 'Data',
  axiosRequest,
  dispatchRequest,
  title,
  // The caller already asked for confirmation (shared ConfirmDialog), so go straight to the request
  skipPrompt = false
}) {
  try {
    const result = skipPrompt
      ? { isConfirmed: true }
      : await swal.fire({
          title: title,
          text: text,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Iya',
          cancelButtonText: 'Tidak',
          reverseButtons: true,
          confirmButtonColor: environtmentColor(),
          width: width
        })
    if (result.dismiss) {
    } else {
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
  onClickYes = () => {},
  onClickNo = () => {},
  title,
  successMessage = 'Sukses',
  autoSuccess = true
}) {
  const result = await swal.fire({
    title: title,
    text: text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Iya',
    cancelButtonText: 'Tidak',
    reverseButtons: true,
    confirmButtonColor: environtmentColor()
  })

  if (result.isConfirmed) {
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
  } else if (result.dismiss === swal.DismissReason.cancel) {
    onClickNo()
  }
}
