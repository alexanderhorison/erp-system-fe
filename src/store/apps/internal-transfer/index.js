import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalConfirmationAdd, swalToastError } from 'src/helpers/swalFunction'

const label = 'Internal Transfer'

// GET ALL INTERNAL TRANSFER
export const fetchAllInternalTransfer = createAsyncThunk(
  'internalTransfer/fetchAllInternalTransfer',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/internal-transfer/'
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// CREATE INTERNAL TRANSFER
export const createInternalTransfer = createAsyncThunk(
  'internalTransfer/createInternalTransfer',
  async ({ data, router }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationAdd({
        label: label,
        name: 'Surat',
        title: 'Anda akan membuat surat internal transfer?',
        axiosRequest: () => {
          return axios({
            method: 'POST',
            url: '/internal-transfer/create',
            data
          })
        },
        dispatchRequest: () => {
          router.push(`/internal-transfer`)
        }
      })
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

// GET DETAIL INTERNAL TRANSFER
export const fetchDetailInternalTransfer = createAsyncThunk(
  'internalTransfer/fetchDetailInternalTransfer',
  async (code, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/internal-transfer/' + code
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// TERIMA / TOLAK BARANG MASUK
export const updateInternalTransfer = createAsyncThunk(
  'internalTransfer/updateInternalTransfer',
  async ({ code, type, router }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationAdd({
        label,
        name: 'Surat',
        title:
          type == 'approve'
            ? 'Anda akan menerima surat internal transfer?'
            : 'Anda akan tolak surat internal transfer?',
        axiosRequest: () => {
          return axios({
            method: 'POST',
            // TYPE (approve/reject)
            // CODE (internal transfer code)
            url: `/internal-transfer/${type}/${code}`
          })
        },
        dispatchRequest: () => {
          router.push('/internal-transfer')
        }
      })
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue({})
    }
  }
)

// GET LIST MASTER PRODUCT INTERNAL TRANSFER
export const fetchListProductInternalTransfer = createAsyncThunk(
  'appProductWarehouse/fetchListProductInternalTransfer',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/product-warehouse/warehouse/' + id + '/list-product-internal-transfer'
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return error
    }
  }
)

export const appMasterProductSlice = createSlice({
  name: 'internalTransfer',
  initialState: {
    dataInternalTransfer: [],
    loadingDataInternalTransfer: true,
    errorDataInternalTransfer: false,

    detailInternalTransfer: {},
    loadingDetailInternalTransfer: false,
    errorDetailInternalTransfer: false,

    loadingUpdateInternalTransfer: false,
    errorUpdateInternalTransfer: false,

    listProductInternalTransfer: [],
    loadingListProductInternalTransfer: false,
    errorListProductInternalTransfer: false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAllInternalTransfer.pending, (state, action) => {
        state.loadingDataInternalTransfer = true
      })
      .addCase(fetchAllInternalTransfer.fulfilled, (state, action) => {
        state.dataInternalTransfer = action.payload.data
        state.loadingDataInternalTransfer = false
      })
      .addCase(fetchAllInternalTransfer.rejected, (state, action) => {
        state.dataInternalTransfer = []
        state.loadingDataInternalTransfer = false
        state.errorDataInternalTransfer = action.error.message
      })

      .addCase(fetchDetailInternalTransfer.pending, (state, action) => {
        state.loadingDetailInternalTransfer = true
      })
      .addCase(fetchDetailInternalTransfer.fulfilled, (state, action) => {
        state.detailInternalTransfer = action.payload.data
        state.loadingDetailInternalTransfer = false
      })
      .addCase(fetchDetailInternalTransfer.rejected, (state, action) => {
        state.detailInternalTransfer = {}
        state.loadingDetailInternalTransfer = false
        state.errorDetailInternalTransfer = action.error.message
      })

      .addCase(updateInternalTransfer.pending, (state, action) => {
        state.loadingUpdateInternalTransfer = true
      })
      .addCase(updateInternalTransfer.fulfilled, (state, action) => {
        state.loadingUpdateInternalTransfer = false
      })
      .addCase(updateInternalTransfer.rejected, (state, action) => {
        state.loadingUpdateInternalTransfer = false
        state.errorUpdateInternalTransfer = action.error.message
      })

      .addCase(fetchListProductInternalTransfer.pending, (state, action) => {
        state.loadingListProductInternalTransfer = true
      })
      .addCase(fetchListProductInternalTransfer.fulfilled, (state, action) => {
        state.listProductInternalTransfer = action.payload.data
        state.loadingListProductInternalTransfer = false
      })
      .addCase(fetchListProductInternalTransfer.rejected, (state, action) => {
        state.listProductInternalTransfer = []
        state.loadingListProductInternalTransfer = false
        state.errorListProductInternalTransfer = action.error.message
      })
  }
})

export default appMasterProductSlice.reducer
