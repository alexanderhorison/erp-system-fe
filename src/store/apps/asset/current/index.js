import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalConfirmationAdd, swalConfirmationEdit, swalToastError } from 'src/helpers/swalFunction'

const label = 'Aset Lancar Bulanan'
// GET ALL CURRENT ASSET
export const fetchCurrentAsset = createAsyncThunk(
  'currentAsset/fetchCurrentAsset',
  async (params, { rejectWithValue }) => {
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
  }
)

// GET DETAIL CURRENT ASSET
export const fetchDetailCurrentAsset = createAsyncThunk(
  'currentAsset/fetchDetailCurrentAsset',
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

// CREATE CURRENT ASSET
export const createCurrentAsset = createAsyncThunk(
  'currentAsset/createCurrentAsset',
  async ({ data, router }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationAdd({
        label: 'Aset Lancar Bulanan',
        name: 'Aset Lancar Bulanan',
        title: 'Anda akan membuat lancar bulanan ?',
        axiosRequest: () => {
          return axios({
            method: 'POST',
            url: '/asset/current/',
            data
          })
        },
        dispatchRequest: () => {
          dispatch(fetchCurrentAsset())
        }
      })
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

// UPDATE CURRENT ASSET
export const updateCurrentAsset = createAsyncThunk(
  'currentAsset/updateCurrentAsset',
  async ({ id, data, router }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationEdit({
        label: 'Aset Lancar Bulanan',
        name: 'Aset Lancar Bulanan',
        title: 'Anda akan mengubah aset lancar bulanan?',
        axiosRequest: () => {
          return axios({
            method: 'PUT',
            url: '/asset/current/' + id,
            data
          })
        },
        dispatchRequest: () => {
          dispatch(fetchCurrentAsset())
        }
      })
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue({})
    }
  }
)

export const appCurrentAssetSlice = createSlice({
  name: 'currentAsset',
  initialState: {
    allData: [],
    loadingAllData: false,
    errorAllData: null,

    detailData: {},
    loadingDetailData: false,
    errorDetailData: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCurrentAsset.pending, (state, action) => {
        state.loadingAllData = true
      })
      .addCase(fetchCurrentAsset.fulfilled, (state, action) => {
        state.allData = action.payload.data
        state.loadingAllData = false
      })
      .addCase(fetchCurrentAsset.rejected, (state, action) => {
        state.allData = []
        state.loadingAllData = false
        state.errorAllData = action.error.message
      })

      .addCase(fetchDetailCurrentAsset.pending, (state, action) => {
        state.loadingDetailData = true
      })
      .addCase(fetchDetailCurrentAsset.fulfilled, (state, action) => {
        state.detailData = action.payload.data
        state.loadingDetailData = false
      })
      .addCase(fetchDetailCurrentAsset.rejected, (state, action) => {
        state.detailData = {}
        state.loadingDetailData = false
        state.errorDetailData = action.error.message
      })
  }
})

export default appCurrentAssetSlice.reducer
