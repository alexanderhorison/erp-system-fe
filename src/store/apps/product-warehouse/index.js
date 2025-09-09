import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import {
  swalConfirmationAdd,
  swalConfirmationDelete,
  swalConfirmationEdit,
  swalToastError
} from 'src/helpers/swalFunction'
import { fetchInvoiceListProductByWarehouseId } from '../delivery-order'
import { fetchDetailProductPos } from '../pos'

const label = 'produk'
// GET ALL WAREHOUSE
export const fetchListWarehouse = createAsyncThunk(
  'appProductWarehouse/fetchListWarehouse',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/product-warehouse/warehouse'
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

export const fetchProductWarehouseDetail = createAsyncThunk(
  'appProductWarehouse/fetchProductWarehouseDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/product-warehouse/' + id
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// GET ALL LIST PRODUCT AT 1 WAREHOUSE
export const fetchListProductByWarehouse = createAsyncThunk(
  'appProductWarehouse/fetchListProductByWarehouse',
  async ({ warehouseId, query }, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/product-warehouse/warehouse/' + warehouseId,
        params: query
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return error
    }
  }
)

// INITIATE PRODUCT
export const initiateProductWarehouse = createAsyncThunk(
  'appProductWarehouse/initiateProductWarehouse',
  async ({ data, warehouse, router }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationAdd({
        label: 'Produk',
        name: 'Produk',
        axiosRequest: () => {
          return axios({
            method: 'POST',
            url: '/product-warehouse/create/' + warehouse.id,
            data
          })
        },
        dispatchRequest: () => {
          router.push(`/product-warehouse/warehouse/${warehouse.id}`)
        }
      })
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

// ADJUST PRODUCT
export const editProductWarehouse = createAsyncThunk(
  'appMasterProduct/editProduct',
  async ({ id, data, warehouseId }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationEdit({
        label: 'Produk',
        name: 'Produk',
        axiosRequest: () => {
          return axios({
            method: 'PUT',
            url: '/product-warehouse/' + id,
            data
          })
        },
        dispatchRequest: () => {
          dispatch(fetchListProductByWarehouse({ warehouseId }))
        }
      })
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

// GET PRODUCT LIST BY USER WAREHOUSE
export const fetchProduct = createAsyncThunk('appProductWarehouse/fetchProduct', async (id, { rejectWithValue }) => {
  try {
    const response = await axios({
      method: 'GET',
      url: '/product-warehouse/list'
    })
    return response.data
  } catch (error) {
    swalToastError({ label, error })
    return rejectWithValue([])
  }
})

// ========== TRANSFORMATION ================
// GET LIST MASTER TRANSFORMATION
export const fetchListProductTransformation = createAsyncThunk(
  'appProductWarehouse/fetchListProductTransformation',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/product-warehouse/transformation/' + id
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return error
    }
  }
)

// TRANSFORMATION PRODUCT
export const transformProduct = createAsyncThunk(
  'appMasterProduct/transformProduct',
  async ({ id, data, warehouseId, setOpen }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationEdit({
        label: 'Produk',
        name: 'Produk',
        title: 'Anda akan melakukan transformasi produk',
        axiosRequest: () => {
          return axios({
            method: 'POST',
            url: '/product-warehouse/transformation/' + id,
            data: data
          })
        },
        dispatchRequest: () => {
          dispatch(fetchListProductByWarehouse({ warehouseId }))
          setOpen(false)
        }
      })
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

export const fetchHistoryProduct = createAsyncThunk(
  'appMasterProduct/historyProduct',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/product-warehouse/history/' + id
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// TRANSFORMATION PRODUCT FROM SALES ORDER
export const transformProductFromSalesOrder = createAsyncThunk(
  'appMasterProduct/transformProductFromSalesOrder',
  async (
    {
      id,
      data,
      warehouseId,
      setOpen,
      setValue,
      getValues,
      indexForm,
      update,
      handleTransformProductUpdate,
      setDataWarehouseIds
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await swalConfirmationEdit({
        label: 'Produk',
        name: 'Produk',
        title: 'Anda akan melakukan transformasi produk',
        axiosRequest: () => {
          return axios({
            method: 'POST',
            url: '/product-warehouse/transformation/' + id,
            data: data
          })
        },
        dispatchRequest: () => {
          dispatch(fetchInvoiceListProductByWarehouseId(warehouseId))
            .then(response => {
              setDataWarehouseIds(prevState => ({
                ...prevState,
                [warehouseId]: response.payload.data // Store the fetched data by warehouseId
              }))
            })
            .catch(error => console.error('Failed to fetch data:', error))
          setOpen(false)
        }
      })

      const {
        warehouseProductId,
        quantity,
        qty,
        masterProductId,
        rackName,
        unitName,
        productWarehouseId,
        masterUnitId,
        productName,
        categoryName
      } = response?.data?.data

      handleTransformProductUpdate(warehouseId, indexForm, {
        productWarehouseId: productWarehouseId,
        productName: productName,
        categoryName: categoryName,
        masterUnitId: masterUnitId,
        quantity: quantity,
        masterProductId: masterProductId,
        rackName: rackName,
        unitName: unitName
      })
      update(indexForm, {
        warehouseId: +warehouseId,
        warehouseProductId: warehouseProductId,
        quantity: quantity,
        qty: qty,
        masterProductId: masterProductId,
        rackName: rackName,
        unitName: unitName
      })

      return response
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

// DELETE
export const fetchDeleteProductWarehouse = createAsyncThunk(
  'appMasterProduct/deleteWarehouseProduct',
  async ({ id, name, warehouseId, query }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationDelete({
        label,
        name,
        axiosRequest: () => {
          return axios({
            method: 'DELETE',
            url: '/product-warehouse/' + id
          })
        },
        dispatchRequest: () => {
          // return dispatch(fetchListStockOpname())
          dispatch(fetchListProductByWarehouse({ warehouseId, query }))
        }
      })
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

export const transformProductFromPointOfSale = createAsyncThunk(
  'appMasterProduct/transformProductFromPointOfSale',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationEdit({
        label: 'Produk',
        name: 'Produk',
        title: 'Anda akan melakukan transformasi produk',
        axiosRequest: () => {
          return axios({
            method: 'POST',
            url: '/product-warehouse/transformation/' + data?.productWarehouseId,
            data: data
          })
        },
        dispatchRequest: () => {
          dispatch(fetchDetailProductPos({ warehouseId: data?.warehouseId, productId: data?.productId }))
        }
      })
      return
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

export const exportAllStock = createAsyncThunk(
  'appProductWarehouse/exportAllStock',
  async ({ warehouseId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/export/all-stock/${warehouseId}`, {
        responseType: 'arraybuffer' // Ensures binary data is received correctly
      })

      const type = response.headers['content-type']
      const contentDisposition = response.headers['content-disposition']

      // Extract filename from Content-Disposition header
      const currentDate = new Date()
      const formattedDate = currentDate.toISOString().split('T')[0].replace(/-/g, '') // YYYYMMDD format
      let filename = `Current Stock - ${formattedDate}.xlsx`
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename\*?=["']?([^"';\n]+)["']?/)
        if (filenameMatch) {
          filename = decodeURIComponent(filenameMatch[1]) // Decode in case of special characters
        }
      }

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
      return { success: true }
    } catch (error) {
      console.error('Error exporting:', error)
      return rejectWithValue('Failed to export. Please try again.')
    }
  }
)

// GET PRODUCT WAREHOUSE BY PRODUCT ID, UNIT ID, AND WAREHOUSE ID
export const findProductWarehouse = createAsyncThunk('appProductWarehouse/find', async (query, { rejectWithValue }) => {
  try {
    const response = await axios({
      method: 'GET',
      url: '/product-warehouse/find',
      params: query
    })
    return response.data
  } catch (error) {
    swalToastError({ label, error })
    return rejectWithValue([])
  }
})

export const appMasterProductSlice = createSlice({
  name: 'appProductWarehouse',
  initialState: {
    dataListWarehouse: [],
    loadingListWarehouse: true,
    errorListWarehouse: false,

    dataListProductWarehouse: {
      data: []
    },
    loadingListProductWarehouse: false,
    errorListProductWarehouse: false,

    detailProductWarehouse: {},
    loadingDetailProductWarehouse: true,
    errorDetailProductWarehouse: false,

    // TRANSFORMATION
    listTransformation: [],
    loadingListTransformation: true,
    errorListTransformation: false,

    // HISTORY
    listHistory: {
      history: [],
      product: {}
    },
    loadingListHistory: true,
    errorListHistory: false,

    // Export
    isExporting: false,
    exportError: null,

    singleProductWarehouse: {},
    loadingSingleProductWarehouse: false,
    errorSingleProductWarehouse: false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchListWarehouse.pending, (state, action) => {
        state.loadingListWarehouse = true
      })
      .addCase(fetchListWarehouse.fulfilled, (state, action) => {
        state.dataListWarehouse = action.payload.data
        state.loadingListWarehouse = false
      })
      .addCase(fetchListWarehouse.rejected, (state, action) => {
        state.loadingListWarehouse = false
        state.errorListWarehouse = action.error.message
        state.dataListWarehouse = []
      })

      .addCase(fetchListProductByWarehouse.pending, (state, action) => {
        state.loadingListProductWarehouse = true
      })
      .addCase(fetchListProductByWarehouse.fulfilled, (state, action) => {
        state.dataListProductWarehouse = action.payload.data
        state.loadingListProductWarehouse = false
      })
      .addCase(fetchListProductByWarehouse.rejected, (state, action) => {
        state.loadingListProductWarehouse = false
        state.errorListProductWarehouse = action.error.message
        state.dataListProductWarehouse = { data: [] }
      })

      .addCase(fetchProductWarehouseDetail.pending, (state, action) => {
        state.loadingDetailProductWarehouse = true
      })
      .addCase(fetchProductWarehouseDetail.fulfilled, (state, action) => {
        state.detailProductWarehouse = action.payload.data
        state.loadingDetailProductWarehouse = false
      })
      .addCase(fetchProductWarehouseDetail.rejected, (state, action) => {
        state.loadingDetailProductWarehouse = false
        state.errorDetailProductWarehouse = action.error.message
        state.detailProductWarehouse = {}
      })

      .addCase(fetchProduct.pending, (state, action) => {
        state.loadingListProductWarehouse = true
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.dataListProductWarehouse = action.payload.data
        state.loadingListProductWarehouse = false
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loadingListProductWarehouse = false
        state.errorListProductWarehouse = action.error.message
        state.dataListProductWarehouse = { data: [] }
      })

      // TRANSFORMATION
      .addCase(fetchListProductTransformation.pending, (state, action) => {
        state.loadingListTransformation = true
      })
      .addCase(fetchListProductTransformation.fulfilled, (state, action) => {
        state.listTransformation = action.payload.data
        state.loadingListTransformation = false
      })
      .addCase(fetchListProductTransformation.rejected, (state, action) => {
        state.loadingListTransformation = false
        state.errorListTransformation = action.error.message
        state.listTransformation = []
      })

      // HISTORY
      .addCase(fetchHistoryProduct.pending, (state, action) => {
        state.loadingListHistory = true
      })
      .addCase(fetchHistoryProduct.fulfilled, (state, action) => {
        state.listHistory = action.payload.data
        state.loadingListHistory = false
      })
      .addCase(fetchHistoryProduct.rejected, (state, action) => {
        state.loadingListHistory = false
        state.errorListHistory = action.error.message
        state.listHistory = {
          history: [],
          product: {}
        }
      })

      //Export
      .addCase(exportAllStock.pending, state => {
        state.isExporting = true
        state.exportError = null
      })
      .addCase(exportAllStock.fulfilled, state => {
        state.isExporting = false
      })
      .addCase(exportAllStock.rejected, (state, action) => {
        state.isExporting = false
        state.exportError = action.payload
      })

      .addCase(findProductWarehouse.pending, (state, action) => {
        state.loadingSingleProductWarehouse = true
      })
      .addCase(findProductWarehouse.fulfilled, (state, action) => {
        state.singleProductWarehouse = action.payload.data
        state.loadingSingleProductWarehouse = false
      })
      .addCase(findProductWarehouse.rejected, (state, action) => {
        state.loadingSingleProductWarehouse = false
        state.errorSingleProductWarehouse = action.error.message
        state.singleProductWarehouse = {}
      })
  }
})

export default appMasterProductSlice.reducer
