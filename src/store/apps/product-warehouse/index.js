import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import toast from 'react-hot-toast'
import { swalConfirmationAdd, swalConfirmationDelete, swalConfirmationEdit, swalSuccess, swalToastError } from 'src/helpers/swalFunction'
import { fetchInvoiceListProductByWarehouseId } from '../delivery-order'

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
    { id, data, warehouseId, setOpen, setValue, getValues, indexForm, update, handleTransformProductUpdate },
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
  async ({ id, name, warehouseId }, { dispatch, rejectWithValue }) => {
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
          dispatch(fetchListProductByWarehouse({ warehouseId }))
        }
      })
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

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
    errorListHistory: false
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
  }
})

export default appMasterProductSlice.reducer
