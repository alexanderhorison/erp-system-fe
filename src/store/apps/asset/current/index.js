import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalConfirmationDelete, swalError, swalSuccess, swalToastError } from 'src/helpers/swalFunction'


const label = "Aset Lancar";

// GET ALL Asset
export const fetchAsset = createAsyncThunk('assetCurrent/fetchData', async (params, { rejectWithValue }) => {
  try {
    const response = await axios({
      method: 'GET',
      url: '/asset/current/all',
      params,
    })
    return response.data
  } catch (error) {
    swalToastError({ label, error })
    return rejectWithValue([])
  }
})

export const getPiutangUsaha = createAsyncThunk('assetCurrent/getPiutangUsaha', async (period, { rejectWithValue }) => {
  try {
    const response = await axios({
      method: 'GET',
      url: '/asset/current/piutang-so',
      params: {
        period // period=2025-06
      }
    })
    return response.data
  } catch (error) {
    swalToastError({ label, error })
    return rejectWithValue([])
  }
})

// GET DETAIL ASSET
export const fetchAssetDetail = createAsyncThunk(
  'assetCurrent/fetchAssetDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/asset/current/' + id
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue({})
    }
  }
)

// ADD ASSET
export const addAsset = createAsyncThunk(
  'assetCurrent/addAsset',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'post',
        url: '/asset/current',
        data
      })
      swalSuccess({ label, name: 'Asset', response })
      dispatch(fetchAsset())
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

export const editAsset = createAsyncThunk(
  'assetCurrent/editAsset',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'PUT',
        url: '/asset/current/' + id,
        data: data
      })
      swalSuccess({ label, name: 'Asset', response })
      dispatch(fetchAsset())
    } catch (error) {
      swalError({ label, error })
      return rejectWithValue({})
    }
  }
)

export const appMasterAssetCurrent = createSlice({
  name: 'assetCurrent',
  initialState: {
    allAssetCurrent: [],
    loadingAllAssetCurrent: false,
    errorAllAssetCurrent: null,

    detailAssetCurrent: {},
    loadingDetailAssetCurrent: false,
    errorDetailAssetCurrent: null,

    piutangUsaha: 0,
    loadingPiutangUsaha: false,
    errorPiutangUsaha: null,
  },
  reducers: {
    resetAssetCurrentState: (state) => {
      state.piutangUsaha = 0
      state.detailAssetCurrent = {}
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAsset.pending, (state, action) => {
        state.loadingAllAssetCurrent = true
      })
      .addCase(fetchAsset.fulfilled, (state, action) => {
        state.allAssetCurrent = action.payload.data
        state.loadingAllAssetCurrent = false
      })
      .addCase(fetchAsset.rejected, (state, action) => {
        state.allAssetCurrent = []
        state.loadingAllAssetCurrent = false
        state.errorAllAssetCurrent = action.error.message
      })

      .addCase(getPiutangUsaha.pending, (state, action) => {
        state.loadingPiutangUsaha = true
      })
      .addCase(getPiutangUsaha.fulfilled, (state, action) => {
        state.piutangUsaha = action.payload.data
        state.loadingPiutangUsaha = false
      })
      .addCase(getPiutangUsaha.rejected, (state, action) => {
        state.piutangUsaha = {}
        state.loadingPiutangUsaha = false
        state.errorPiutangUsaha = action.error.message
      })

      .addCase(fetchAssetDetail.pending, (state, action) => {
        state.loadingDetailAssetCurrent = true
      })
      .addCase(fetchAssetDetail.fulfilled, (state, action) => {
        state.detailAssetCurrent = action.payload.data
        state.loadingDetailAssetCurrent = false
      })
      .addCase(fetchAssetDetail.rejected, (state, action) => {
        state.loadingDetailAssetCurrent = false
        state.detailAssetCurrent = null
        state.errorDetailAssetCurrent = action.error.message
      })

  }
})

export const { resetAssetCurrentState } = appMasterAssetCurrent.actions;
export default appMasterAssetCurrent.reducer