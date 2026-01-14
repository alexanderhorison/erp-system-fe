import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalError, swalSuccess, swalToastError, swalNotifSuccess } from 'src/helpers/swalFunction'

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

// DOWNLOAD PRODUCT PRICE TEMPLATE
export const downloadProductPriceTemplate = createAsyncThunk(
  'appMasterProductPrice/downloadTemplate',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/master/product-price/download-template',
        responseType: 'arraybuffer'
      })

      const type = response.headers['content-type']
      const filename = 'Template_Product_Price.xlsx'

      // Create Blob from response
      const blob = new Blob([response.data], { type })

      // Trigger file download
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Cleanup Blob URL
      window.URL.revokeObjectURL(blobUrl)

      swalNotifSuccess({ message: 'Template Downloaded Successfully' })
      return { success: true }
    } catch (error) {
      console.error('Error downloading template:', error)
      swalToastError({ label: 'Download Template Failed' })
      return rejectWithValue({ success: false })
    }
  }
)

// IMPORT PRODUCT PRICE TEMPLATE
export const importProductPriceTemplate = createAsyncThunk(
  'appMasterProductPrice/importTemplate',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      // Fire and forget - don't wait for response
      axios({
        method: 'POST',
        url: '/master/product-price/import-template',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).catch(error => {
        console.error('Background import error:', error)
      })

      // Show success message immediately
      swalNotifSuccess({ message: 'Import Base Price Successfully Started' })
      return { success: true }
    } catch (error) {
      console.error('Error starting import:', error)
      swalError({ error, label: 'Import Template' })
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
    },
    loadingDownload: false,
    loadingImport: false,
    importTimestamp: null
  },
  reducers: {
    clearImportLoading: (state) => {
      state.loadingImport = false
      state.importTimestamp = null
    }
  },
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

      .addCase(downloadProductPriceTemplate.pending, (state, action) => {
        state.loadingDownload = true
      })
      .addCase(downloadProductPriceTemplate.fulfilled, (state, action) => {
        state.loadingDownload = false
        state.error = false
      })
      .addCase(downloadProductPriceTemplate.rejected, (state, action) => {
        state.loadingDownload = false
        state.error = action.error.message
      })

      .addCase(importProductPriceTemplate.pending, (state, action) => {
        state.loadingImport = true
        state.importTimestamp = Date.now()
      })
      .addCase(importProductPriceTemplate.fulfilled, (state, action) => {
        // Keep loading state - will be cleared by timeout in component
        state.error = false
      })
      .addCase(importProductPriceTemplate.rejected, (state, action) => {
        state.loadingImport = false
        state.importTimestamp = null
        state.error = action.error.message
      })
  }
})

export default appMasterProductPriceSlice.reducer

export const { clearImportLoading } = appMasterProductPriceSlice.actions
