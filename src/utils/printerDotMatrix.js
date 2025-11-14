import { swalToastError } from 'src/helpers/swalFunction'
import { swalConfirmationOnly } from 'src/helpers/swalFunctionPos'
import axios from 'src/configs/axios'
import { setPrinterStatus } from 'src/store/apps/config/configPrinter'

export const printSalesOrder = async (dispatch, code) => {
  swalConfirmationOnly({
    title: 'Print Sales Order',
    text: 'Apakah anda yakin ingin mencetak Sales Order ini?',
    showCancelButton: true,
    confirmButtonText: 'Ya, Cetak',
    cancelButtonText: 'Tidak',
    onClickYes: async () => {
      let retryAttempt = 0
      const maxRetries = 1
      while (retryAttempt <= maxRetries) {
        try {
          dispatch(setPrinterStatus({ printing: true }))

          await axios.post(`/sales-order/print/${code}`)

          dispatch(setPrinterStatus({ printing: false }))
          return // Success, exit retry loop
        } catch (error) {
          swalToastError({
            label: 'Print Error',
            error: error.message || 'Gagal mencetak Sales Order'
          })
          dispatch(setPrinterStatus({ printing: false }))
          break
        }
      }
    }
  })
}
