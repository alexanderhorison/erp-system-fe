import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import axios from 'src/configs/axios'

export const fetchMasterDataWarehouse = createAsyncThunk(
  'appMasterWarehouse/fetchData',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/master/warehouse/all'
      })
      return response.data
    } catch (error) {
      toast.error(error.response.data.message)
      return rejectWithValue([])
    }
  }
)

export const fetchMasterDataWarehouseDetail = createAsyncThunk(
  'appMasterWarehouse/fetchDataDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/master/warehouse/' + id
      })
      return response.data
    } catch (error) {
      toast.error(error.response.data.message)
      return rejectWithValue({})
    }
  }
)

// ADD UNIT
export const addMasterDataWarehouse = createAsyncThunk(
  'appMasterWarehouse/addWarehouse',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'post',
        url: '/master/warehouse/create',
        headers: {},
        data
      })
      dispatch(fetchMasterDataWarehouse())
      toast.success(response.data.message)
    } catch (error) {
      toast.error(error.response.data.message)
      return rejectWithValue({})
    }
  }
)

// EDIT UNIT
export const editMasterDataWarehouse = createAsyncThunk(
  'appMasterWarehouse/editWarehouse',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'PUT',
        url: '/master/warehouse/' + id,
        data: data
      })
      dispatch(fetchMasterDataWarehouse())
      toast.success(response.data.message)
    } catch (error) {
      toast.error(error.response.data.message)
      return rejectWithValue({})
    }
  }
)

// DELETE UNIT
export const deleteMasterDataWarehouse = createAsyncThunk(
  'appWarehouse/deleteWarehouse',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'DELETE',
        url: '/master/warehouse/' + id
      })
      dispatch(fetchMasterDataWarehouse())
      toast.success(response.data.message)
    } catch (error) {
      toast.error(error.response.data.message)
      return rejectWithValue({})
    }
  }
)

export const appMasterWarehouseSlice = createSlice({
  name: 'appMasterWarehouse',
  initialState: {
    data: [],
    loading: false,
    error: false,
    detail: {
      id: '',
      name: '',
      location: ''
    },
    defaultValue: {
      id: '',
      name: '',
      location: ''
    },
    loadingDetail: false,
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMasterDataWarehouse.pending, (state, action) => {
        state.loading = true
      })
      .addCase(fetchMasterDataWarehouse.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.loading = false
        state.error = false
      })
      .addCase(fetchMasterDataWarehouse.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchMasterDataWarehouseDetail.pending, (state, action) => {
        state.loadingDetail = true
      })
      .addCase(fetchMasterDataWarehouseDetail.fulfilled, (state, action) => {
        state.detail = action.payload.data
        state.loadingDetail = false
        state.error = false
      })
      .addCase(fetchMasterDataWarehouseDetail.rejected, (state, action) => {
        state.loadingDetail = false
        state.error = action.error.message
      })
  }
})

export default appMasterWarehouseSlice.reducer
