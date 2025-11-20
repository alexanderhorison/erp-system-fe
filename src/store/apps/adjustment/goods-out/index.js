import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalConfirmationAdd, swalSuccess, swalToastError } from 'src/helpers/swalFunction'

const label = 'Barang Keluar'

// GET ALL ADJUSTMENT GOODS OUT
export const fetchAllAdjustmentGoodsOut = createAsyncThunk(
  'adjustmentGoodsOut/fetchAllAdjustmentGoodsOut',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/adjustment-goods/out/'
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// CREATE ADJUSTMENT GOODS OUT
export const createAdjustmentGoodsOut = createAsyncThunk(
  'adjustmentGoodsOut/createAdjustmentGoodsOut',
  async ({ data, router }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'POST',
        url: '/adjustment-goods/out/create',
        data
      })
      swalSuccess({ label, name: 'Barang Keluar', response })
      router.push(`/adjustment/goods-out`)
      return
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

// GET DETAIL ADJUSTMENT GOODS OUT
export const fetchDetailAdjustmentGoodsOut = createAsyncThunk(
  'adjustmentGoodsOut/fetchDetailAdjustmentGoodsOut',
  async (code, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/adjustment-goods/out/' + code
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// TERIMA / TOLAK BARANG KELUAR
export const updateAdjustmentGoodsOut = createAsyncThunk(
  'adjustmentGoodsOut/updateAdjustmentGoodsOut',
  async ({ code, type, router }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationAdd({
        label,
        name: 'Surat',
        title: type == 'approve' ? 'Anda akan menerima surat barang keluar?' : 'Anda akan tolak surat barang keluar?',
        axiosRequest: () => {
          return axios({
            method: 'POST',
            // TYPE (approve/reject)
            // CODE (adjustment code)
            url: `/adjustment-goods/out/${type}/${code}`
          })
        },
        dispatchRequest: () => {
          router.push('/adjustment/goods-out')
        }
      })
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue({})
    }
  }
)

export const appMasterProductSlice = createSlice({
  name: 'adjustmentGoodsOut',
  initialState: {
    dataAdjustmentGoodsOut: [],
    loadingDataAdjustmentGoodsOut: true,
    errorDataAdjustmentGoodsOut: false,

    detailAdjustmentGoodsOut: {},
    loadingDetailAdjustmentGoodsOut: false,
    errorDetailAdjustmentGoodsOut: false,

    loadingCreateAdjustmentGoodsOut: false,
    errorCreateAdjustmentGoodsOut: false,

    loadingUpdateAdjustmentGoodsOut: false,
    errorUpdateAdjustmentGoodsOut: false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAllAdjustmentGoodsOut.pending, (state, action) => {
        state.loadingDataAdjustmentGoodsOut = true
      })
      .addCase(fetchAllAdjustmentGoodsOut.fulfilled, (state, action) => {
        state.dataAdjustmentGoodsOut = action.payload.data
        state.loadingDataAdjustmentGoodsOut = false
      })
      .addCase(fetchAllAdjustmentGoodsOut.rejected, (state, action) => {
        state.dataAdjustmentGoodsOut = []
        state.loadingDataAdjustmentGoodsOut = false
        state.errorDataAdjustmentGoodsOut = action.error.message
      })

      .addCase(fetchDetailAdjustmentGoodsOut.pending, (state, action) => {
        state.loadingDetailAdjustmentGoodsOut = true
      })
      .addCase(fetchDetailAdjustmentGoodsOut.fulfilled, (state, action) => {
        state.detailAdjustmentGoodsOut = action.payload.data
        state.loadingDetailAdjustmentGoodsOut = false
      })
      .addCase(fetchDetailAdjustmentGoodsOut.rejected, (state, action) => {
        state.detailAdjustmentGoodsOut = {}
        state.loadingDetailAdjustmentGoodsOut = false
        state.errorDetailAdjustmentGoodsOut = action.error.message
      })

      .addCase(createAdjustmentGoodsOut.pending, (state, action) => {
        state.loadingCreateAdjustmentGoodsOut = true
      })
      .addCase(createAdjustmentGoodsOut.fulfilled, (state, action) => {
        state.loadingCreateAdjustmentGoodsOut = false
      })
      .addCase(createAdjustmentGoodsOut.rejected, (state, action) => {
        state.loadingCreateAdjustmentGoodsOut = false
        state.errorCreateAdjustmentGoodsOut = action.error.message
      })

      .addCase(updateAdjustmentGoodsOut.pending, (state, action) => {
        state.loadingUpdateAdjustmentGoodsOut = true
      })
      .addCase(updateAdjustmentGoodsOut.fulfilled, (state, action) => {
        state.loadingUpdateAdjustmentGoodsOut = false
      })
      .addCase(updateAdjustmentGoodsOut.rejected, (state, action) => {
        state.loadingUpdateAdjustmentGoodsOut = false
        state.errorUpdateAdjustmentGoodsOut = action.error.message
      })
  }
})

export default appMasterProductSlice.reducer
