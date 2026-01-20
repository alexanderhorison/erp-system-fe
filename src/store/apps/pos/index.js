import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalConfirmationAdd, swalNotifSuccess, swalToastError } from 'src/helpers/swalFunction'
import { fetchMasterDataCustomer } from '../master/customer'
import { swalConfirmationChargePos, swalConfirmationOnly } from 'src/helpers/swalFunctionPos'

const label = 'produk'
// GET ALL WAREHOUSE
export const fetchListProductPos = createAsyncThunk(
  'appProductPos/fetchListProductPos',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/point-of-sale/find-product-by-warehouseid',
        params: params
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

export const fetchDetailProductPos = createAsyncThunk(
  'appProductPos/fetchDetailProductPos',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/point-of-sale/get-all-product-by-productid',
        params: params
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// UPDATE PRODUCT TO FAV
export const updateFavoriteProductPos = createAsyncThunk(
  'appProductPos/updateFavoriteProductPos',
  async ({ data, setOpen, setFavorite, isFavorite }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationAdd({
        label: 'Favorite',
        name: 'Favorite',
        title: `${isFavorite ? 'Remove produk dari favorit?' : 'Jadikan produk favorit?'}`,
        axiosRequest: () => {
          if (isFavorite) {
            setFavorite(false)
          } else {
            setFavorite(true)
          }
          return axios({
            method: 'POST',
            url: '/point-of-sale/add-favorite',
            data
          })
        },
        dispatchRequest: () => {
          dispatch(fetchListProductPos({ id: data.warehouseId }))
        }
      })
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

// ADD CUSTOMER AT POS
export const addMasterDataCustomerPos = createAsyncThunk(
  'appProductPos/addMasterDataCustomerPos',
  async ({ data, setOpen, setSelectedCustomerPos }, { dispatch, rejectWithValue }) => {
    try {
      const response = await swalConfirmationAdd({
        label: 'Customer',
        name: 'Customer',
        title: 'Anda akan menambahkan customer?',
        axiosRequest: () => {
          return axios({
            method: 'POST',
            url: '/master/customer/create-pos',
            data
          })
        },
        dispatchRequest: () => {
          setOpen(false)
          dispatch(fetchMasterDataCustomer())
        }
      })
      const customer = response?.data?.data
      if (customer) {
        setSelectedCustomerPos({
          id: customer.id,
          name: customer.name,
          email: customer.email ?? ''
        })
        localStorage.setItem('selectedCustomerPos', JSON.stringify({ id: customer.id, name: customer.name }))
      }
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

// GET ALL CUSTOMER POS
export const fetchCustomerPos = createAsyncThunk(
  'appProductPos/fetchCustomerPos',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/master/customer/all-pos',
        params
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

export const fetchListPaymentTypePos = createAsyncThunk(
  'appProductPos/fetchListPaymentType',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/point-of-sale/payment-type'
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// CHARGE PAYMENT
export const chargePos = createAsyncThunk(
  'appProductPos/chargePos',
  async ({ data, selectedPayment, subTotalPrice, onComplete }, { rejectWithValue }) => {
    try {
      await swalConfirmationChargePos({
        title: `Pembayaran menggunakan ${selectedPayment?.label}?`,
        text: `Sebesar Rp. ${subTotalPrice || 0}`,
        width: 500,
        axiosRequest: () => {
          return axios({
            method: 'POST',
            url: '/point-of-sale/create-point-of-sale',
            data
          })
        },
        dispatchRequest: ({ data }) => {
          onComplete(data?.data)
        }
      })
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// GET ALL POINT OF SALE BY WAREHOUSEID
export const fetchAllPointOfSaleByWarehouseId = createAsyncThunk(
  'appProductPos/fetchAllPointOfSaleByWarehouseId',
  async (warehouseId, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/point-of-sale/get-all-point-of-sale/' + warehouseId
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// GET ALL POINT OF SALE BY CUSTOMERID
export const fetchAllPointOfSaleByCustomerId = createAsyncThunk(
  'appProductPos/fetchAllPointOfSaleByCustomerId',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/point-of-sale/get-all-point-of-sale-by-customer/' + id
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// GET DETAIL PURCHASE ORDER
export const fetchDetailPointOfSale = createAsyncThunk(
  'appProductPos/fetchDetailPointOfSale',
  async (code, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/point-of-sale/' + code
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// PRINT POS
export const printPos = createAsyncThunk('appProductPos/printPos', async (code, { rejectWithValue }) => {
  // Show confirmation first
  return new Promise((resolve, reject) => {
    swalConfirmationOnly({
      title: 'Print Point of Sale',
      text: 'Apakah anda yakin ingin mencetak Point of Sale ini?',
      autoSuccess: false,
      showCancelButton: true,
      confirmButtonText: 'Ya, Cetak',
      cancelButtonText: 'Tidak',
      onClickYes: async () => {
        try {
          // Validasi code
          const codeString = typeof code === 'object' ? code.code || code.id : code
          if (!codeString) {
            throw new Error('Code tidak valid untuk print')
          }

          // Get printer data from localStorage
          const printerPosData = localStorage.getItem('printerPos')
          const printerPos = printerPosData ? JSON.parse(printerPosData) : null

          // Prepare request body with printer info
          const requestBody = printerPos
            ? {
              ip: printerPos.ip,
              name: printerPos.name
            }
            : {}

          // Kirim request ke backend - BE yang handle semua printing logic
          const response = await axios({
            method: 'POST',
            url: `/point-of-sale/print-v3/${codeString}`,
            data: requestBody
          })

          swalNotifSuccess({ message: response?.data?.message || 'Struk berhasil dicetak!' })
          resolve(response.data)
        } catch (error) {
          console.error('❌ Print Error:', error)
          swalToastError({ label: 'Print', error })
          reject(error)
          return rejectWithValue([])
        }
      },
      onClickNo: () => {
        // User cancelled
        resolve({ cancelled: true })
      }
    }).catch(error => {
      // ensure outer promise rejects to avoid unhandled rejection
      reject(error)
      return rejectWithValue([])
    })
  })
})

// VOID POS
export const voidPointOfSale = createAsyncThunk(
  'appProductPos/voidPointOfSale',
  async ({ code, adminUserId, pin, warehouseId }, { dispatch, rejectWithValue }) => {
    // Show confirmation first (handled in action level)
    return new Promise((resolve, reject) => {
      swalConfirmationOnly({
        title: 'Konfirmasi VOID',
        text: `Apakah anda yakin ingin VOID transaksi ${code}?`,
        onClickYes: async () => {
          try {
            const response = await axios({
              method: 'POST',
              url: `/point-of-sale/void/${code}`,
              data: { adminUserId, pin }
            })

            // Refresh list and detail
            if (warehouseId) dispatch(fetchAllPointOfSaleByWarehouseId(warehouseId))
            dispatch(fetchDetailPointOfSale(code))

            // let confirmation helper display success animation
            resolve(response.data)
          } catch (error) {
            // Let the confirmation helper show the error modal so it stays visible
            throw error
          }
        },
        onClickNo: () => {
          resolve({ cancelled: true })
        },
        successMessage: 'Transaksi berhasil di-VOID'
      }).catch(error => {
        // ensure outer promise rejects to avoid unhandled rejection
        reject(error)
        return rejectWithValue([])
      })
    })
  }
)

export const sendEmailPos = createAsyncThunk('appProductPos/sendEmail', async (formData, { rejectWithValue }) => {
  try {
    // Prepare form data
    const response = await axios({
      method: 'POST',
      url: '/send-email-pos/',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data' // Set the correct header for file uploads
      }
    })
    swalNotifSuccess({ message: response?.data?.message })
  } catch (error) {
    swalToastError({ label, error })
    return rejectWithValue([])
  }
})

export const appPosSlice = createSlice({
  name: 'appProductPos',
  initialState: {
    listProductPos: [],
    loadingListProductPos: true,
    errorListProductPos: false,

    detailProductPos: [],
    loadingDetailProductPos: true,
    errorDetailProductPos: false,

    listPaymentType: [],
    loadingListPaymentType: true,
    errorListPaymentType: false,

    listCustomerPos: [],
    loadingListCustomerPos: true,
    errorListCustomerPos: false,

    dataPointOfSale: [],
    loadingDataPointOfSale: true,
    errorDataPointOfSale: false,

    detailPointOfSale: {},
    loadingDetailPointOfSale: true,
    errorDetailPointOfSale: false,

    dataPointOfSaleCustomer: [],
    loadingDataPointOfSaleCustomer: true,
    errorDataPointOfSaleCustomer: false,

    loadingChargePos: false,
    errorChargePos: false
    ,
    loadingVoidPos: false,
    errorVoidPos: false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchListProductPos.pending, (state, action) => {
        state.loadingListProductPos = true
      })
      .addCase(fetchListProductPos.fulfilled, (state, action) => {
        state.listProductPos = action.payload.data
        state.loadingListProductPos = false
      })
      .addCase(fetchListProductPos.rejected, (state, action) => {
        state.loadingListProductPos = false
        state.errorListProductPos = action.error.message
        state.listProductPos = []
      })
      // DETAIL
      .addCase(fetchDetailProductPos.pending, (state, action) => {
        state.loadingDetailProductPos = true
      })
      .addCase(fetchDetailProductPos.fulfilled, (state, action) => {
        state.detailProductPos = action.payload.data
        state.loadingDetailProductPos = false
      })
      .addCase(fetchDetailProductPos.rejected, (state, action) => {
        state.loadingDetailProductPos = false
        state.errorDetailProductPos = action.error.message
        state.detailProductPos = []
      })
      // PAYMENT TYPE
      .addCase(fetchListPaymentTypePos.pending, (state, action) => {
        state.loadingListPaymentType = true
      })
      .addCase(fetchListPaymentTypePos.fulfilled, (state, action) => {
        state.listPaymentType = action.payload.data
        state.loadingListPaymentType = false
      })
      .addCase(fetchListPaymentTypePos.rejected, (state, action) => {
        state.loadingListPaymentType = false
        state.errorListPaymentType = action.error.message
        state.listPaymentType = []
      })

      // CUSTOMER
      .addCase(fetchCustomerPos.pending, (state, action) => {
        state.loadingListCustomerPos = true
      })
      .addCase(fetchCustomerPos.fulfilled, (state, action) => {
        state.listCustomerPos = action.payload.data
        state.loadingListCustomerPos = false
      })
      .addCase(fetchCustomerPos.rejected, (state, action) => {
        state.loadingListCustomerPos = false
        state.errorListCustomerPos = action.error.message
        state.listCustomerPos = []
      })

      // List Point Of Sale
      .addCase(fetchAllPointOfSaleByWarehouseId.pending, (state, action) => {
        state.loadingDataPointOfSale = true
      })
      .addCase(fetchAllPointOfSaleByWarehouseId.fulfilled, (state, action) => {
        state.dataPointOfSale = action.payload.data
        state.loadingDataPointOfSale = false
      })
      .addCase(fetchAllPointOfSaleByWarehouseId.rejected, (state, action) => {
        state.dataPointOfSale = []
        state.loadingDataPointOfSale = false
        state.errorDataPointOfSale = action.error.message
      })

      // fetch detail point of sale
      .addCase(fetchDetailPointOfSale.pending, (state, action) => {
        state.loadingDetailPointOfSale = true
      })
      .addCase(fetchDetailPointOfSale.fulfilled, (state, action) => {
        state.detailPointOfSale = action.payload.data
        state.loadingDetailPointOfSale = false
      })
      .addCase(fetchDetailPointOfSale.rejected, (state, action) => {
        state.detailPointOfSale = {}
        state.loadingDetailPointOfSale = false
        state.errorDetailPointOfSale = action.error.message
      })

      // List Point Of Sale By Customer
      .addCase(fetchAllPointOfSaleByCustomerId.pending, (state, action) => {
        state.loadingDataPointOfSaleCustomer = true
      })
      .addCase(fetchAllPointOfSaleByCustomerId.fulfilled, (state, action) => {
        state.dataPointOfSaleCustomer = action.payload.data
        state.loadingDataPointOfSaleCustomer = false
      })
      .addCase(fetchAllPointOfSaleByCustomerId.rejected, (state, action) => {
        state.dataPointOfSaleCustomer = []
        state.loadingDataPointOfSaleCustomer = false
        state.errorDataPointOfSaleCustomer = action.error.message
      })

      // Charge POS
      .addCase(chargePos.pending, (state, action) => {
        state.loadingChargePos = true
      })
      .addCase(chargePos.fulfilled, (state, action) => {
        state.loadingChargePos = false
      })
      .addCase(chargePos.rejected, (state, action) => {
        state.loadingChargePos = false
        state.errorChargePos = action.error.message
      })
      // VOID POS
      .addCase(voidPointOfSale.pending, (state, action) => {
        state.loadingVoidPos = true
      })
      .addCase(voidPointOfSale.fulfilled, (state, action) => {
        state.loadingVoidPos = false
      })
      .addCase(voidPointOfSale.rejected, (state, action) => {
        state.loadingVoidPos = false
        state.errorVoidPos = action.error.message
      })
  }
})

export default appPosSlice.reducer
