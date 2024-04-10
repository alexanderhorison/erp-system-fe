import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalConfirmationDelete, swalError, swalSuccess, swalToastError } from 'src/helpers/swalFunction'
const label = 'satuan'

// GET ALL UNIT
export const fetchMasterDataUnit = createAsyncThunk('appMasterUnit/fetchData', async (params, { rejectWithValue }) => {
  try {
    const response = await axios({
      method: 'GET',
      url: '/master/unit/all'
    })
    return response.data
  } catch (error) {
    swalToastError({ label, error })
    return rejectWithValue([])
  }
})

// GET DETAIL UNIT
export const fetchMasterDataUnitDetail = createAsyncThunk(
  'appMasterUnit/fetchDataDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/master/unit/' + id
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue({})
    }
  }
)

// ADD UNIT
export const addMasterDataUnit = createAsyncThunk(
  'appMasterUnit/addUnit',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'post',
        url: '/master/unit/create',
        headers: {},
        data
      })
      swalSuccess({ label, name: 'Satuan', response })
      dispatch(fetchMasterDataUnit())
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

// EDIT UNIT
export const editMasterDataUnit = createAsyncThunk(
  'appMasterUnit/editUnit',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'PUT',
        url: '/master/unit/' + id,
        data: data
      })
      swalSuccess({ label, name: 'Satuan', response })
      dispatch(fetchMasterDataUnit())
    } catch (error) {
      swalError({ label, error })
      return rejectWithValue({})
    }
  }
)

// DELETE UNIT
export const deleteMasterDataUnit = createAsyncThunk(
  'appUnit/deleteUnit',
  async ({ id, name }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationDelete({
        label,
        name,
        axiosRequest: () => {
          return axios({
            method: 'DELETE',
            url: '/master/unit/' + id
          })
        },
        dispatchRequest: () => {
          return dispatch(fetchMasterDataUnit())
        }
      })
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

export const appMasterUnitSlice = createSlice({
  name: 'appMasterUnit',
  initialState: {
    data: [],
    loading: false,
    error: false,
    detail: {
      id: '',
      name: '',
      description: ''
    },
    defaultValue: {
      id: '',
      name: '',
      description: ''
    },
    loadingDetail: false,
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMasterDataUnit.pending, (state, action) => {
        state.loading = true
      })
      .addCase(fetchMasterDataUnit.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.loading = false
        state.error = false
      })
      .addCase(fetchMasterDataUnit.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchMasterDataUnitDetail.pending, (state, action) => {
        state.loadingDetail = true
      })
      .addCase(fetchMasterDataUnitDetail.fulfilled, (state, action) => {
        state.detail = action.payload.data
        state.loadingDetail = false
        state.error = false
      })
      .addCase(fetchMasterDataUnitDetail.rejected, (state, action) => {
        state.loadingDetail = false
        state.error = action.error.message
      })
  }
})

export default appMasterUnitSlice.reducer
