import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import toast from 'react-hot-toast'

export const fetchMasterDataProduct = createAsyncThunk(
  'appMasterProduct/fetchData',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/master/product/all'
      })
      return response.data
    } catch (error) {
      toast.error(error.response.data.message)
      return rejectWithValue([])
    }
  }
)

export const fetchMasterDataProductDetail = createAsyncThunk(
  'appMasterProduct/fetchDataDetal',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/master/product/' + id
      })
      return response.data
    } catch (error) {
      toast.error(error.response.data.message)
      return rejectWithValue({})
    }
  }
)

// ADD PRODUCT
export const addMasterDataPorduct = createAsyncThunk(
  'appMasterProduct/addProduct',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'post',
        url: process.env.NEXT_PUBLIC_BASE_URL + '/master/product/create',
        headers: {},
        data
      })
      dispatch(fetchMasterDataProduct())
      toast.success(response.data.message)
    } catch (error) {
      toast.error(error.response.data.message)
      return rejectWithValue({})
    }
  }
)

export const editMasterDataPorduct = createAsyncThunk(
  'appMasterProduct/editProduct',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'PUT',
        url: '/master/product/' + id,
        data: data
      })
      dispatch(fetchMasterDataProduct())
      toast.success(response.data.message)
    } catch (error) {
      toast.error(error.response.data.message)
      return rejectWithValue({})
    }
  }
)

// DELETE PRODUCT
export const deleteMasterDataProduct = createAsyncThunk(
  'appProduct/deleteProduct',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'DELETE',
        url: '/master/product/' + id
      })
      dispatch(fetchMasterDataProduct())
      toast.success(response.data.message)
      return response.data
    } catch (error) {
      toast.error(error.response.data.message)
      return rejectWithValue({})
    }
  }
)

export const appMasterProductSlice = createSlice({
  name: 'appMasterProduct',
  initialState: {
    data: [],
    loading: false,
    error: false,
    defaultValue: {
      name: '',
      CategoryId: '',
      TypeId: '',
      description: ''
    },
    detail: {
      name: '',
      CategoryId: '',
      TypeId: '',
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
      .addCase(fetchMasterDataProduct.pending, (state, action) => {
        state.loading = true
      })
      .addCase(fetchMasterDataProduct.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.params = action.payload.params
        state.allData = action.payload.allData
        state.total = action.payload.total
      })
      .addCase(fetchMasterDataProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchMasterDataProductDetail.pending, (state, action) => {
        state.loadingDetail = true
      })
      .addCase(fetchMasterDataProductDetail.fulfilled, (state, action) => {
        state.detail = action.payload.data
        state.loadingDetail = false
      })
      .addCase(fetchMasterDataProductDetail.rejected, (state, action) => {
        state.loadingDetail = false
        state.error = action.error.message
        state.defaultValue = {
          name: '',
          CategoryId: '',
          TypeId: '',
          description: ''
        }
      })
  }
})

export default appMasterProductSlice.reducer
