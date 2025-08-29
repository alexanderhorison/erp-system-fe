import { swalToastError } from 'src/helpers/swalFunction'
import { swalConfirmationOnly } from 'src/helpers/swalFunctionPos'
import axios from 'src/configs/axios'
import { setPrinterStatus } from 'src/store/apps/config/configPrinter'

// 🔹 QZ Tray Connection and Print Functions
let qzInstance = null

// 🔹 Check status koneksi QZ Tray secara detail
export const getQZTrayStatus = () => {
  try {
    const status = {
      scriptLoaded: typeof window !== 'undefined' && !!window.qz,
      version: null,
      websocketExists: false,
      isActive: false,
      qzInstanceExists: !!qzInstance,
      timestamp: new Date().toLocaleString()
    }

    if (status.scriptLoaded) {
      status.version = window.qz.version || 'Unknown'
      status.websocketExists = !!window.qz.websocket

      if (status.websocketExists) {
        try {
          status.isActive = window.qz.websocket.isActive()
        } catch (e) {
          status.isActive = false
        }
      }
    }
    return status
  } catch (error) {
    console.error('❌ Error getting QZ status:', error)
    return { error: error.message }
  }
}

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

          // 🔹 Check status koneksi terlebih dahulu
          const status = getQZTrayStatus()
          console.log('📊 Status Printer:', status)

          // 🔹 Gunakan direct connection yang berhasil di manual test
          console.log(`🔄 Menghubungkan printer (Attempt ${retryAttempt + 1}/${maxRetries + 1})`)
          await connectToQZTrayDirect()
          console.log('✅ Printer connected')

          // 🔹 Fetch data transaksi dari backend
          const response = await axios.post(`/sales-order/print/${code}`)
          const salesOrderData = response.data.data

          // 🔹 Print via QZ Tray ke printer LX-310
          await printViaQZTray({ printData: salesOrderData.buffer, printerSetting: salesOrderData.printerSetting })

          console.log('✅ Berhasil mencetak Sales Order!')
          dispatch(setPrinterStatus({ printing: false }))
          return // Success, exit retry loop
        } catch (error) {
          console.error(`❌ Gagal mencetak Sales Order (Attempt ${retryAttempt + 1}):`, error)

          // Jika error adalah "open connection already exists" dan masih ada retry
          if (error.message && error.message.includes('open connection') && retryAttempt < maxRetries) {
            console.log('🔄 Detected connection conflict, attempting force reset...')
            await forceResetQZTray()
            retryAttempt++
            continue // Try again
          }

          // Jika sudah habis retry atau error lain
          swalToastError({
            label: 'Print Error',
            error: error.message || 'Gagal mencetak Sales Order'
          })
          dispatch(setPrinterStatus({ printing: false }))
          break // Exit retry loop
        }
      }
    }
  })
}

export const connectToQZTrayDirect = async () => {
  try {
    // Pastikan window dan qz ada
    if (typeof window === 'undefined') {
      throw new Error('Window object tidak ada')
    }

    // Wait untuk QZ script loading jika belum ada
    let retryCount = 0
    const maxRetries = 10

    while (!window.qz && retryCount < maxRetries) {
      console.log(`⏳ Menunggu QZ script loading... (${retryCount + 1}/${maxRetries})`)
      await new Promise(resolve => setTimeout(resolve, 500))
      retryCount++
    }

    if (!window.qz) {
      throw new Error('QZ Tray script tidak bisa dimuat setelah 5 detik')
    }

    console.log('✅ QZ Tray script version:', window.qz.version)

    // 🔹 Check apakah sudah ada koneksi aktif
    if (window.qz.websocket.isActive()) {
      qzInstance = window.qz
      return true
    }

    // 🔹 Jika ada koneksi tapi tidak aktif, disconnect dulu
    try {
      if (qzInstance || window.qz.websocket) {
        console.log('🔄 Disconnecting existing inactive connection...')
        await window.qz.websocket.disconnect()
        qzInstance = null
        // Wait sebentar setelah disconnect
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    } catch (disconnectError) {
      console.log('ℹ️ No previous connection to disconnect:', disconnectError.message)
    }

    // Direct connection seperti yang berhasil di browser console
    console.log('🔄 Connecting directly to QZ Tray...')
    await window.qz.websocket.connect()

    qzInstance = window.qz
    console.log('✅ QZ Tray connected successfully (direct method)')

    return true
  } catch (error) {
    console.error('❌ Direct connection failed:', error)
    throw error
  }
}

export const disconnectQZTray = async () => {
  try {
    // Check apakah ada window.qz
    if (typeof window !== 'undefined' && window.qz && window.qz.websocket) {
      // Check apakah ada koneksi aktif
      if (window.qz.websocket.isActive()) {
        console.log('🔄 Disconnecting active QZ Tray connection...')
        await window.qz.websocket.disconnect()
        console.log('✅ QZ Tray terputus')
      } else {
        console.log('ℹ️ QZ Tray sudah tidak aktif')
      }
    }

    // Reset instance
    qzInstance = null
  } catch (error) {
    console.error('❌ Error saat memutus QZ Tray:', error)
    // Reset instance meskipun ada error
    qzInstance = null
  }
}

// 🔹 Force reset koneksi QZ Tray (untuk troubleshooting)
export const forceResetQZTray = async () => {
  try {
    console.log('🔄 Force resetting QZ Tray connection...')

    // Force disconnect apapun kondisinya
    if (typeof window !== 'undefined' && window.qz && window.qz.websocket) {
      try {
        await window.qz.websocket.disconnect()
      } catch (e) {
        console.log('ℹ️ Force disconnect error (expected):', e.message)
      }
    }

    // Reset instance
    qzInstance = null

    // Wait sebentar
    await new Promise(resolve => setTimeout(resolve, 1500))

    console.log('✅ QZ Tray force reset complete')
    return true
  } catch (error) {
    console.error('❌ Force reset error:', error)
    qzInstance = null
    return false
  }
}

export const printViaQZTray = async ({ printData, printerSetting }) => {
  try {
    // 🔹 Coba beberapa konfigurasi printer LX-310
    const { ip, hostName } = printerSetting
    const configs = [
      // Config 1: Shared Printer dengan nama "LX-310"
      {
        name: `${hostName}-Shared`,
        config: qz.configs.create(hostName)
      }
    ]

    console.log('🖨️ Mengirim data ke printer LX-310...')

    // 🔹 Coba konfigurasi satu per satu
    for (const configOption of configs) {
      try {
        console.log(`🔄 Mencoba ${configOption.name}`)

        // 🔹 Buat print data dengan formatting yang berbeda untuk setiap config
        let data = []

        if (configOption.name.includes('Shared')) {
          // Untuk shared printer, gunakan format standar dengan advance paper
          data = [
            {
              type: 'raw',
              format: 'plain',
              data: printData + '' // data + extra lines untuk advance paper
            }
          ]
        }

        await qz.print(configOption.config, data)
        console.log(`✅ Berhasil connect via ${configOption.name}!`)

        // Tunggu sebentar untuk memastikan data terkirim
        await new Promise(resolve => setTimeout(resolve, 1000))

        return // Keluar jika berhasil
      } catch (configError) {
        console.warn(`⚠️ ${configOption.name} gagal:`, configError.message)
        continue // Lanjut ke config berikutnya
      }
    }

    // Jika semua config gagal
    throw new Error('Semua konfigurasi printer gagal')
  } catch (error) {
    console.error('❌ Gagal mencetak via QZ Tray:', error)
    swalToastError({
      label: 'Print Error',
      error: `Gagal mencetak: ${error.message || error}`
    })
    throw error
  }
}

// 🔹 Global debug functions (untuk testing di browser console)
if (typeof window !== 'undefined') {
  window.QZDebug = {
    getStatus: getQZTrayStatus,
    forceReset: forceResetQZTray,
    disconnect: disconnectQZTray,
    connectDirect: connectToQZTrayDirect,
    testConnection: async () => {
      try {
        console.log('🧪 Starting QZ Tray test...')
        const status = getQZTrayStatus()
        console.log('Status before connect:', status)

        await connectToQZTrayDirect()
        console.log('✅ Test connection successful')

        const statusAfter = getQZTrayStatus()
        console.log('Status after connect:', statusAfter)

        return { success: true, status: statusAfter }
      } catch (error) {
        console.error('❌ Test failed:', error)
        return { success: false, error: error.message }
      }
    }
  }
  console.log('🔧 QZ Debug tools available: window.QZDebug')
}
