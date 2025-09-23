import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalConfirmationDelete, swalError, swalSuccess, swalToastError } from 'src/helpers/swalFunction'

const label = 'rank'

// GET ALL RANK
export const fetchMasterDataRank = createAsyncThunk('appMasterRank/fetchData', async (params, { rejectWithValue }) => {
  try {
    const response = await axios({
      method: 'GET',
      url: '/master/rank/all'
    })
    return response.data
  } catch (error) {
    swalToastError({ label, error })
    return rejectWithValue([])
  }
})

// GET DETAIL RANK
export const fetchMasterDataRankDetail = createAsyncThunk(
  'appMasterRank/fetchDataDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/master/rank/' + id
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue({})
    }
  }
)

// ADD RANK
export const addMasterDataRank = createAsyncThunk(
  'appMasterRank/addRank',
  async ({ data, setOpen }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'POST',
        url: '/master/rank/create',
        data
      })
      swalSuccess({ label, name: 'Rank', response })
      setOpen(false)
      dispatch(fetchMasterDataRank())
      return
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

// EDIT RANK
export const editMasterDataRank = createAsyncThunk(
  'appMasterRank/editRank',
  async ({ id, data, setOpen }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'PUT',
        url: '/master/rank/' + id,
        data
      })
      swalSuccess({ label, name: 'Rank', response })
      setOpen(false)
      dispatch(fetchMasterDataRank())
      return
    } catch (error) {
      swalError({ label, error })
      return rejectWithValue({})
    }
  }
)

// DELETE RANK
export const deleteMasterDataRank = createAsyncThunk(
  'appRank/deleteRank',
  async ({ id, name }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationDelete({
        label,
        name,
        axiosRequest: () => {
          return axios({
            method: 'DELETE',
            url: '/master/rank/' + id
          })
        },
        dispatchRequest: () => {
          return dispatch(fetchMasterDataRank())
        }
      })
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

// REDUCER MASTER RANK
export const appMasterRankSlice = createSlice({
  name: 'appMasterRank',
  initialState: {
    data: [],
    loading: false,
    error: false,
    detail: {
      id: '',
      name: '',
      description: '',
      level: ''
    },
    defaultValue: {
      id: '',
      name: '',
      description: '',
      level: ''
    },
    loadingDetail: false,
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMasterDataRank.pending, (state, action) => {
        state.loading = true
      })
      .addCase(fetchMasterDataRank.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.loading = false
        state.error = false
      })
      .addCase(fetchMasterDataRank.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchMasterDataRankDetail.pending, (state, action) => {
        state.loadingDetail = true
      })
      .addCase(fetchMasterDataRankDetail.fulfilled, (state, action) => {
        state.detail = action.payload.data
        state.loadingDetail = false
        state.error = false
      })
      .addCase(fetchMasterDataRankDetail.rejected, (state, action) => {
        state.loadingDetail = false
        state.error = action.error.message
      })
  }
})

export default appMasterRankSlice.reducer
