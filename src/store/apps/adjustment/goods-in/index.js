import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalConfirmationAdd, swalToastError } from 'src/helpers/swalFunction'

const label = 'Barang Masuk'

// GET ALL ADJUSTMENT GOODS IN
export const fetchAllAdjustmentGoodsIn = createAsyncThunk(
  'adjustmentGoodsIn/fetchAllAdjustmentGoodsIn',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/adjustment-goods/in/'
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// CREATE ADJUSTMENT GOODS IN
export const createAdjustmentGoodsIn = createAsyncThunk(
  'adjustmentGoodsIn/createAdjustmentGoodsIn',
  async ({ data, router }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationAdd({
        label: label,
        name: 'Surat',
        title: 'Anda akan membuat surat barang masuk?',
        axiosRequest: () => {
          return axios({
            method: 'POST',
            url: '/adjustment-goods/in/create',
            data
          })
        },
        dispatchRequest: () => {
          router.push(`/adjustment/goods-in`)
        }
      })
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

// GET DETAIL ADJUSTMENT GOODS IN
export const fetchDetailAdjustmentGoodsIn = createAsyncThunk(
  'adjustmentGoodsIn/fetchDetailAdjustmentGoodsIn',
  async (code, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/adjustment-goods/in/' + code
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// TERIMA / TOLAK BARANG MASUK
export const updateAdjustmentGoodsIn = createAsyncThunk(
  'adjustmentGoodsIn/updateAdjustmentGoodsIn',
  async ({ code, type, router }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationAdd({
        label,
        name: 'Surat',
        title: type == 'approve' ? 'Anda akan menerima surat barang masuk?' : 'Anda akan tolak surat barang masuk?',
        axiosRequest: () => {
          return axios({
            method: 'POST',
            // TYPE (approve/reject)
            // CODE (adjustment code)
            url: `/adjustment-goods/in/${type}/${code}`
          })
        },
        dispatchRequest: () => {
          router.push('/adjustment/goods-in')
        }
      })
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue({})
    }
  }
)

export const appMasterProductSlice = createSlice({
  name: 'adjustmentGoodsIn',
  initialState: {
    dataAdjustmentGoodsIn: [],
    loadingDataAdjustmentGoodsIn: true,
    errorDataAdjustmentGoodsIn: false,

    detailAdjustmentGoodsIn: {},
    loadingDetailAdjustmentGoodsIn: false,
    errorDetailAdjustmentGoodsIn: false,

    loadingUpdateAdjustmentGoodsIn: false,
    errorUpdateAdjustmentGoodsIn: false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAllAdjustmentGoodsIn.pending, (state, action) => {
        state.loadingDataAdjustmentGoodsIn = true
      })
      .addCase(fetchAllAdjustmentGoodsIn.fulfilled, (state, action) => {
        state.dataAdjustmentGoodsIn = action.payload.data
        state.loadingDataAdjustmentGoodsIn = false
      })
      .addCase(fetchAllAdjustmentGoodsIn.rejected, (state, action) => {
        state.dataAdjustmentGoodsIn = []
        state.loadingDataAdjustmentGoodsIn = false
        state.errorDataAdjustmentGoodsIn = action.error.message
      })

      .addCase(fetchDetailAdjustmentGoodsIn.pending, (state, action) => {
        state.loadingDetailAdjustmentGoodsIn = true
      })
      .addCase(fetchDetailAdjustmentGoodsIn.fulfilled, (state, action) => {
        state.detailAdjustmentGoodsIn = action.payload.data
        state.loadingDetailAdjustmentGoodsIn = false
      })
      .addCase(fetchDetailAdjustmentGoodsIn.rejected, (state, action) => {
        state.detailAdjustmentGoodsIn = {}
        state.loadingDetailAdjustmentGoodsIn = false
        state.errorDetailAdjustmentGoodsIn = action.error.message
      })

      .addCase(updateAdjustmentGoodsIn.pending, (state, action) => {
        state.loadingUpdateAdjustmentGoodsIn = true
      })
      .addCase(updateAdjustmentGoodsIn.fulfilled, (state, action) => {
        state.loadingUpdateAdjustmentGoodsIn = false
      })
      .addCase(updateAdjustmentGoodsIn.rejected, (state, action) => {
        state.loadingUpdateAdjustmentGoodsIn = false
        state.errorUpdateAdjustmentGoodsIn = action.error.message
      })
  }
})

export default appMasterProductSlice.reducer
