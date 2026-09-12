import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalSuccess, swalToastError } from 'src/helpers/swalFunction'

const label = 'Master Data Aset Tidak Lancar'
// GET ALL MASTER NON-CURRENT ASSET
export const fetchMasterNonCurrentAsset = createAsyncThunk(
  'masterNonCurrentAsset/fetchMasterNonCurrentAsset',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/asset/master-non-current/all'
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// GET DETAIL MASTER NON-CURRENT ASSET
export const fetchDetailMasterNonCurrentAsset = createAsyncThunk(
  'masterNonCurrentAsset/fetchDetailMasterNonCurrentAsset',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/asset/master-non-current/' + id
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue({})
    }
  }
)

// CREATE MASTER NON-CURRENT ASSET
export const createMasterNonCurrentAsset = createAsyncThunk(
  'masterNonCurrentAsset/createMasterNonCurrentAsset',
  async ({ data, router, setOpen }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'POST',
        url: '/asset/master-non-current/',
        data
      })
      swalSuccess({ label, name: 'Master Data Aset Tidak Lancar', response })
      dispatch(fetchMasterNonCurrentAsset())
      setOpen(false)
      return
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

// UPDATE MASTER NON-CURRENT ASSET
export const updateMasterNonCurrentAsset = createAsyncThunk(
  'masterNonCurrentAsset/updateMasterNonCurrentAsset',
  async ({ id, data, setOpen }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'PUT',
        url: '/asset/master-non-current/' + id,
        data
      })
      swalSuccess({ label, name: 'Master Data Aset Tidak Lancar', response })
      setOpen(false)
      dispatch(fetchMasterNonCurrentAsset())
      return
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue({})
    }
  }
)

export const appMasterProductSlice = createSlice({
  name: 'masterNonCurrentAsset',
  initialState: {
    allData: [],
    loadingAllData: false,
    errorAllData: null,

    detailData: {},
    loadingDetailData: false,
    errorDetailData: null,

    defaultValue: {
      name: '',
      assetType: '',
      assetValue: '',
      depreciationMonths: '',
      acquisitionDate: '',
      notes: ''
    },

    loadingAction: false,
    errorAction: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMasterNonCurrentAsset.pending, (state, action) => {
        state.loadingAllData = true
      })
      .addCase(fetchMasterNonCurrentAsset.fulfilled, (state, action) => {
        state.allData = action.payload.data
        state.loadingAllData = false
      })
      .addCase(fetchMasterNonCurrentAsset.rejected, (state, action) => {
        state.allData = []
        state.loadingAllData = false
        state.errorAllData = action.error.message
      })

      .addCase(fetchDetailMasterNonCurrentAsset.pending, (state, action) => {
        state.loadingDetailData = true
      })
      .addCase(fetchDetailMasterNonCurrentAsset.fulfilled, (state, action) => {
        state.detailData = action.payload.data
        state.loadingDetailData = false
      })
      .addCase(fetchDetailMasterNonCurrentAsset.rejected, (state, action) => {
        state.detailData = {}
        state.loadingDetailData = false
        state.errorDetailData = action.error.message
      })

      .addCase(createMasterNonCurrentAsset.pending, state => {
        state.loadingAction = true
      })
      .addCase(createMasterNonCurrentAsset.fulfilled, state => {
        state.loadingAction = false
      })
      .addCase(createMasterNonCurrentAsset.rejected, (state, action) => {
        state.loadingAction = false
        state.errorAction = action.error.message
      })

      .addCase(updateMasterNonCurrentAsset.pending, state => {
        state.loadingAction = true
      })
      .addCase(updateMasterNonCurrentAsset.fulfilled, state => {
        state.loadingAction = false
      })
      .addCase(updateMasterNonCurrentAsset.rejected, (state, action) => {
        state.loadingAction = false
        state.errorAction = action.error.message
      })
  }
})

export default appMasterProductSlice.reducer
