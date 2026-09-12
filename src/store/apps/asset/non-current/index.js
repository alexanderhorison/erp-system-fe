import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalDeleteConfirmed, swalToastError, swalSuccess } from 'src/helpers/swalFunction'

const label = 'Aset Tidak Lancar'
// GET ALL ASET TIDAL LANCAR BULANAN
export const fetchMonthlyNonCurrentAsset = createAsyncThunk(
  'monthlyNonCurrentAsset/fetchMonthlyNonCurrentAsset',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/asset/non-current/all'
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// GET DETAIL ASET TIDAL LANCAR BULANAN
export const fetchDetailMonthlyNonCurrentAsset = createAsyncThunk(
  'monthlyNonCurrentAsset/fetchDetailMonthlyNonCurrentAsset',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/asset/non-current/' + id
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue({})
    }
  }
)

// CREATE ASET TIDAL LANCAR BULANAN
export const createMonthlyNonCurrentAsset = createAsyncThunk(
  'monthlyNonCurrentAsset/createMonthlyNonCurrentAsset',
  async ({ data, setOpen }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'POST',
        url: '/asset/non-current/',
        data
      })
      swalSuccess({ label, name: 'Aset Tidak Lancar', response })
      dispatch(fetchMonthlyNonCurrentAsset())
      setOpen(false)
      return
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

// DELETE ASET TIDAL LANCAR BULANAN
export const fetchDeleteMonthlyNonCurrentAsset = createAsyncThunk(
  'monthlyNonCurrentAsset/fetchDeleteMonthlyNonCurrentAsset',
  async ({ id, date }, { rejectWithValue, dispatch }) => {
    try {
      await swalDeleteConfirmed({
        label,
        name: date,
        axiosRequest: () => {
          return axios({
            method: 'DELETE',
            url: '/asset/non-current/' + id
          })
        },
        dispatchRequest: () => {
          return dispatch(fetchMonthlyNonCurrentAsset())
        }
      })
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

export const appMonthlyNonCurrentAssetSlice = createSlice({
  name: 'monthlyNonCurrentAsset',
  initialState: {
    allData: [],
    loadingAllData: false,
    errorAllData: null,

    detailData: {},
    loadingDetailData: false,
    errorDetailData: null,

    loadingAction: false,
    errorAction: null,

    loadingDelete: false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMonthlyNonCurrentAsset.pending, (state, action) => {
        state.loadingAllData = true
      })
      .addCase(fetchMonthlyNonCurrentAsset.fulfilled, (state, action) => {
        state.allData = action.payload.data
        state.loadingAllData = false
      })
      .addCase(fetchMonthlyNonCurrentAsset.rejected, (state, action) => {
        state.allData = []
        state.loadingAllData = false
        state.errorAllData = action.error.message
      })

      .addCase(fetchDetailMonthlyNonCurrentAsset.pending, (state, action) => {
        state.loadingDetailData = true
      })
      .addCase(fetchDetailMonthlyNonCurrentAsset.fulfilled, (state, action) => {
        state.detailData = action.payload.data
        state.loadingDetailData = false
      })
      .addCase(fetchDetailMonthlyNonCurrentAsset.rejected, (state, action) => {
        state.detailData = {}
        state.loadingDetailData = false
        state.errorDetailData = action.error.message
      })

      .addCase(createMonthlyNonCurrentAsset.pending, state => {
        state.loadingAction = true
      })
      .addCase(createMonthlyNonCurrentAsset.fulfilled, state => {
        state.loadingAction = false
      })
      .addCase(createMonthlyNonCurrentAsset.rejected, (state, action) => {
        state.loadingAction = false
        state.errorAction = action.error.message
      })

      .addCase(fetchDeleteMonthlyNonCurrentAsset.pending, state => {
        state.loadingDelete = true
      })
      .addCase(fetchDeleteMonthlyNonCurrentAsset.fulfilled, state => {
        state.loadingDelete = false
      })
      .addCase(fetchDeleteMonthlyNonCurrentAsset.rejected, state => {
        state.loadingDelete = false
      })
  }
})

export default appMonthlyNonCurrentAssetSlice.reducer
