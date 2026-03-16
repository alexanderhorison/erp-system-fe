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
        url: '/master/product/all',
        params
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
      categoryId: '',
      typeId: '',
      description: ''
    },
    detail: {
      name: '',
      categoryId: '',
      typeId: '',
      description: ''
    },
    loadingDetail: false,
    total: 1,
    params: {},
    allData: [],

    loadingAdd: false,
    errorAdd: false,

    loadingEdit: false,
    errorEdit: false,

    loadingDelete: false,
    errorDelete: false
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
          categoryId: '',
          typeId: '',
          description: ''
        }
      })

      .addCase(addMasterDataPorduct.pending, (state, action) => {
        state.loadingAdd = true
      })
      .addCase(addMasterDataPorduct.fulfilled, (state, action) => {
        state.loadingAdd = false
      })
      .addCase(addMasterDataPorduct.rejected, (state, action) => {
        state.loadingAdd = false
        state.errorAdd = action.error.message
      })

      .addCase(editMasterDataPorduct.pending, (state, action) => {
        state.loadingEdit = true
      })
      .addCase(editMasterDataPorduct.fulfilled, (state, action) => {
        state.loadingEdit = false
      })
      .addCase(editMasterDataPorduct.rejected, (state, action) => {
        state.loadingEdit = false
        state.errorEdit = action.error.message
      })

      .addCase(deleteMasterDataProduct.pending, (state, action) => {
        state.loadingDelete = true
      })
      .addCase(deleteMasterDataProduct.fulfilled, (state, action) => {
        state.loadingDelete = false
      })
      .addCase(deleteMasterDataProduct.rejected, (state, action) => {
        state.loadingDelete = false
        state.errorDelete = action.error.message
      })
  }
})

export default appMasterProductSlice.reducer
