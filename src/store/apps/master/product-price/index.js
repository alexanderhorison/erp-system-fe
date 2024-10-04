import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalError, swalSuccess, swalToastError } from 'src/helpers/swalFunction'

const label = 'product price'

// GET ALL PRODUCT PRICE
export const fetchMasterDataProductPrice = createAsyncThunk(
  'appMasterProductPrice/fetchData',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/master/product-price/all/' + productId
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// ADD PRODUCT PRICE
export const addMasterDataProductPrice = createAsyncThunk(
  'appMasterProductPrice/addProductPrice',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'POST',
        url: '/master/product-price/create',
        data
      })
      swalSuccess({ label, name: 'Product Price', response })
      dispatch(fetchMasterDataProductPrice(data.productId))
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

// FIND ONE PRODUCT PRICE
export const fetchOneMasterDataProductPrice = createAsyncThunk(
  'appMasterProductPrice/fetchOneProductPrice',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: `/master/product-price/${data.productId}/${data.unitId}`,
        data
      })
      return response.data
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

// REDUCER MASTER PRODUCT PRICE
export const appMasterProductPriceSlice = createSlice({
  name: 'appMasterProductPrice',
  initialState: {
    data: [],
    loading: false,
    error: false,
    total: 1,
    params: {},
    loadingDetail: false,
    detail: {
      basePrice: 0
    }
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMasterDataProductPrice.pending, (state, action) => {
        state.loading = true
      })
      .addCase(fetchMasterDataProductPrice.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.loading = false
        state.error = false
      })
      .addCase(fetchMasterDataProductPrice.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      .addCase(fetchOneMasterDataProductPrice.pending, (state, action) => {
        state.loadingDetail = true
      })
      .addCase(fetchOneMasterDataProductPrice.fulfilled, (state, action) => {
        let newValue = {
          basePrice: action.payload.data ? action.payload.data.basePrice : 0
        }
        state.detail = newValue
        state.loadingDetail = false
        state.error = false
      })
      .addCase(fetchOneMasterDataProductPrice.rejected, (state, action) => {
        state.loadingDetail = false
        state.error = action.error.message
      })
  }
})

export default appMasterProductPriceSlice.reducer
