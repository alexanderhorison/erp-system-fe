import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import axios from 'src/configs/axios'

export const fetchMasterDataType = createAsyncThunk('appMasterType/fetchData', async (params, { rejectWithValue }) => {
  try {
    const response = await axios({
      method: 'GET',
      url: process.env.NEXT_PUBLIC_BASE_URL + '/master/type/all'
    })
    return response.data
  } catch (error) {
    toast.error(error.response.data.message)
    return rejectWithValue([])
  }
})

export const fetchMasterDataTypeDetail = createAsyncThunk(
  'appMasterType/fetchDataDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: process.env.NEXT_PUBLIC_BASE_URL + '/master/type/' + id
      })
      return response.data
    } catch (error) {
      toast.error(error.response.data.message)
      return rejectWithValue({})
    }
  }
)

// ADD TYPE
export const addMasterDataType = createAsyncThunk(
  'appMasterType/addType',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'post',
        url: process.env.NEXT_PUBLIC_BASE_URL + '/master/type/create',
        headers: {},
        data
      })
      dispatch(fetchMasterDataType())
      toast.success(response.data.message)
    } catch (error) {
      toast.error(error.response.data.message)
      return rejectWithValue({})
    }
  }
)

// EDIT TYPE
export const editMasterDataType = createAsyncThunk(
  'appMasterType/editType',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'PUT',
        url: '/master/type/' + id,
        data: data
      })
      dispatch(fetchMasterDataType())
      toast.success(response.data.message)
    } catch (error) {
      toast.error(error.response.data.message)
      return rejectWithValue({})
    }
  }
)

// DELETE TYPE
export const deleteMasterDataType = createAsyncThunk(
  'appType/deleteType',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'DELETE',
        url: '/master/type/' + id
      })
      dispatch(fetchMasterDataType())
      toast.success(response.data.message)
    } catch (error) {
      toast.error(error.response.data.message)
      return rejectWithValue({})
    }
  }
)

export const appMasterTypeSlice = createSlice({
  name: 'appMasterType',
  initialState: {
    data: [],
    loading: false,
    error: false,
    detail: {
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
      .addCase(fetchMasterDataType.pending, (state, action) => {
        state.loading = true
      })
      .addCase(fetchMasterDataType.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.loading = false
        state.error = false
      })
      .addCase(fetchMasterDataType.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchMasterDataTypeDetail.pending, (state, action) => {
        state.loadingDetail = true
      })
      .addCase(fetchMasterDataTypeDetail.fulfilled, (state, action) => {
        state.detail = action.payload.data
        state.loadingDetail = false
        state.error = false
      })
      .addCase(fetchMasterDataTypeDetail.rejected, (state, action) => {
        state.loadingDetail = false
        state.error = action.error.message
      })
  }
})

export default appMasterTypeSlice.reducer
