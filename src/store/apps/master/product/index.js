import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalConfirmationDelete, swalError, swalSuccess, swalToastError } from 'src/helpers/swalFunction'
const label = 'product'

// GET ALL MASTER PRODUCT
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
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// GET DETAIL MASTER PDODUCT
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
      swalToastError({ label, error })
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
        url: '/master/product/create',
        data
      })
      swalSuccess({ label, name: 'Produk', response })
      dispatch(fetchMasterDataProduct())
    } catch (error) {
      swalError({ error, label })
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
      swalSuccess({ label, name: 'Produk', response })
      dispatch(fetchMasterDataProduct())
    } catch (error) {
      swalError({ label, error })
      return rejectWithValue({})
    }
  }
)

// DELETE PRODUCT
export const deleteMasterDataProduct = createAsyncThunk(
  'appProduct/deleteProduct',
  async ({ id, name }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationDelete({
        label,
        name,
        axiosRequest: () => {
          return axios({
            method: 'DELETE',
            url: '/master/product/' + id
          })
        },
        dispatchRequest: () => {
          return dispatch(fetchMasterDataProduct())
        }
      })
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

// REDUCER MASTER PRODUCT
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
