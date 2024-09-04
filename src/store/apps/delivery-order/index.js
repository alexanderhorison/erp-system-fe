import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalConfirmationAdd, swalConfirmationEdit, swalSuccess, swalToastError } from 'src/helpers/swalFunction'

const label = 'Surat Jalan'
// GET ALL WAREHOUSE
export const fetchInvoiceListProductByWarehouseId = createAsyncThunk(
  'deliveryOrder/fetchInvoiceListProductByWarehouseId',
  async (warehouseId, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'POST',
        url: '/delivery-order/list-product',
        data: {
          warehouseId: warehouseId
        }
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// GET ALL DELIVERY ORDER
export const fetchAllDeliveryOrder = createAsyncThunk(
  'deliveryOrder/fetchAllDeliveryOrder',
  async (filter, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/delivery-order/all',
        params: filter
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// CREATE DELIVERY ORDER
export const createDeliveryOrder = createAsyncThunk(
  'deliveryOrder/createDeliveryOrder',
  async ({ data, router }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationAdd({
        label: 'Surat Jalan',
        name: 'Surat',
        title: "Anda akan membuat surat jalan produk?",
        axiosRequest: () => {
          return axios({
            method: 'POST',
            url: '/delivery-order/create',
            data
          })
        },
        dispatchRequest: () => {
          router.push(`/delivery-order/`)
        }
      })
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

// GET DETAIL DELIVERY ORDER
export const fetchDetailDeliveryOrder = createAsyncThunk(
  'deliveryOrder/fetchDetailDeliveryOrder',
  async (deliveryOrderId, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/delivery-order/' + deliveryOrderId,
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

export const appMasterProductSlice = createSlice({
  name: 'deliveryOrder',
  initialState: {
    dataListProductWarehouse: [],
    loadingDataListProductWarehouse: true,
    errorDataListProductWarehouse: false,

    dataListDeliveryOrder: [],
    loadingDataListDeliveryOrder: true,
    errorDataListDeliveryOrder: false,

    detailDeliveryOrder: {},
    loadingDetailDeliveryOrder: true,
    errorDetailDeliveryOrder: false,

  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchInvoiceListProductByWarehouseId.pending, (state, action) => {
        state.loadingDataListProductWarehouse = true
      })
      .addCase(fetchInvoiceListProductByWarehouseId.fulfilled, (state, action) => {
        state.dataListProductWarehouse = action.payload.data
        state.loadingDataListProductWarehouse = false
      })
      .addCase(fetchInvoiceListProductByWarehouseId.rejected, (state, action) => {
        state.dataListProductWarehouse = []
        state.loadingDataListProductWarehouse = false
        state.errorDataListProductWarehouse = action.error.message
      })

      .addCase(fetchAllDeliveryOrder.pending, (state, action) => {
        state.loadingDataListDeliveryOrder = true
      })
      .addCase(fetchAllDeliveryOrder.fulfilled, (state, action) => {
        state.dataListDeliveryOrder = action.payload.data
        state.loadingDataListDeliveryOrder = false
      })
      .addCase(fetchAllDeliveryOrder.rejected, (state, action) => {
        state.dataListDeliveryOrder = []
        state.loadingDataListDeliveryOrder = false
        state.errorDataListDeliveryOrder = action.error.message
      })

      .addCase(fetchDetailDeliveryOrder.pending, (state, action) => {
        state.loadingDetailDeliveryOrder = true
      })
      .addCase(fetchDetailDeliveryOrder.fulfilled, (state, action) => {
        state.detailDeliveryOrder = action.payload.data
        state.loadingDetailDeliveryOrder = false
      })
      .addCase(fetchDetailDeliveryOrder.rejected, (state, action) => {
        state.detailDeliveryOrder = {}
        state.loadingDetailDeliveryOrder = false
        state.errorDetailDeliveryOrder = action.error.message
      })
  }
})

export default appMasterProductSlice.reducer
