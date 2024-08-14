import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalConfirmationDelete, swalError, swalSuccess, swalToastError } from 'src/helpers/swalFunction'

const label = 'gudang'

// GET ALL WAREHOUSE
export const fetchMasterDataWarehouse = createAsyncThunk(
  'appMasterWarehouse/fetchData',
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/master/warehouse/all',
        params: query ? query : {}
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// GET DETAIL WAREHOUSE
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
      swalToastError({ label, error })
      return rejectWithValue({})
    }
  }
)

// ADD WAREHOUSE
export const addMasterDataWarehouse = createAsyncThunk(
  'appMasterWarehouse/addWarehouse',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'post',
        url: '/master/warehouse/create',
        data
      })
      swalSuccess({ label, name: 'Gudang', response })
      dispatch(fetchMasterDataWarehouse())
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

// EDIT WAREHOUSE
export const editMasterDataWarehouse = createAsyncThunk(
  'appMasterWarehouse/editWarehouse',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'PUT',
        url: '/master/warehouse/' + id,
        data: data
      })
      swalSuccess({ label, name: 'Gudang', response })
      dispatch(fetchMasterDataWarehouse())
    } catch (error) {
      swalError({ label, error })
      return rejectWithValue({})
    }
  }
)

// DELETE WAREHOUSE
export const deleteMasterDataWarehouse = createAsyncThunk(
  'appWarehouse/deleteWarehouse',
  async ({ id, name }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationDelete({
        label,
        name,
        axiosRequest: () => {
          return axios({
            method: 'DELETE',
            url: '/master/warehouse/' + id
          })
        },
        dispatchRequest: () => {
          return dispatch(fetchMasterDataWarehouse())
        }
      })
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

// REDUCER WAREHOUSE
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
