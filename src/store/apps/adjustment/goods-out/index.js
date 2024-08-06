import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalConfirmationAdd, swalToastError } from 'src/helpers/swalFunction'

const label = 'Barang Keluar'
// GET ALL WAREHOUSE
// export const fetchInvoiceListProductByWarehouseId = createAsyncThunk(
//   'deliveryOrder/fetchInvoiceListProductByWarehouseId',
//   async (warehouseId, { rejectWithValue }) => {
//     try {
//       const response = await axios({
//         method: 'POST',
//         url: '/delivery-order/list-product',
//         data: {
//           warehouseId: warehouseId
//         }
//       })
//       return response.data
//     } catch (error) {
//       swalToastError({ label, error })
//       return rejectWithValue([])
//     }
//   }
// )

// GET ALL ADJUSTMENT GOODS OUT
export const fetchAllAdjustmentGoodsOut = createAsyncThunk(
  'adjustmentGoodsOut/fetchAllAdjustmentGoodsOut',
  async (warehouseId, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/adjustment-goods/out/'
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// CREATE DELIVERY ORDER
export const createAdjustmentGoodsOut = createAsyncThunk(
  'adjustmentGoodsOut/createAdjustmentGoodsOut',
  async ({ data, router }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationAdd({
        label: label,
        name: 'Surat',
        title: 'Anda akan membuat surat barang keluar?',
        axiosRequest: () => {
          return axios({
            method: 'POST',
            url: '/adjustment-goods/out/',
            data
          })
        },
        dispatchRequest: () => {
          router.push(`/adjustment/goods-out`)
        }
      })
    } catch (error) {
      return rejectWithValue({})
    }
  }
)

// GET DETAIL ADJUSTMENT GOODS OUT
export const fetchDetailAdjustmentGoodsOut = createAsyncThunk(
  'adjustmentGoodsOut/fetchDetailAdjustmentGoodsOut',
  async (deliveryOrderId, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/adjustment-goods/out/' + deliveryOrderId
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

export const appMasterProductSlice = createSlice({
  name: 'adjustmentGoodsOut',
  initialState: {
    // dataListProductWarehouse: [],
    // loadingDataListProductWarehouse: true,
    // errorDataListProductWarehouse: false,

    dataAdjustmentGoodsOut: [
      {
        id: 1,
        code: 'TBA-12345678',
        createdAt: 'Senin, 5 Agustus 2024',
        receivedAt: 'Senin, 5 Agustus 2024',
        createdBy: {
          name: 'Superadmin',
          roleName: 'Admin'
        },
        warehouseOrigin: 'GUDANG LANTAI 1 KANTOR',
        status: 'APPROVED',
        dateCreated: '2024-08-05T01:01:58.182Z',
        dateReceived: '2024-08-05T01:02:05.767Z'
      },
      {
        id: 2,
        code: 'TBA-94381729',
        createdAt: 'Senin, 5 Agustus 2024',
        receivedAt: 'Senin, 5 Agustus 2024',
        createdBy: {
          name: 'Superadmin',
          roleName: 'Admin'
        },
        warehouseOrigin: 'GUDANG LANTAI 1 KANTOR',
        status: 'APPROVED',
        dateCreated: '2024-08-05T01:01:58.182Z',
        dateReceived: '2024-08-05T01:02:05.767Z'
      },
      {
        id: 3,
        code: 'TBA-87654321',
        createdAt: 'Senin, 5 Agustus 2024',
        receivedAt: 'Senin, 5 Agustus 2024',
        createdBy: {
          name: 'Superadmin',
          roleName: 'Admin'
        },
        warehouseOrigin: 'GUDANG LANTAI 2 KANTOR',
        status: 'PENDING',
        dateCreated: '2024-08-05T02:01:58.182Z',
        dateReceived: '2024-08-05T02:02:05.767Z'
      },
      {
        id: 4,
        code: 'TBA-11223344',
        createdAt: 'Senin, 5 Agustus 2024',
        receivedAt: 'Senin, 5 Agustus 2024',
        createdBy: {
          name: 'Superadmin',
          roleName: 'Admin'
        },
        warehouseOrigin: 'GUDANG LANTAI 3 KANTOR',
        status: 'REJECTED',
        dateCreated: '2024-08-05T03:01:58.182Z',
        dateReceived: '2024-08-05T03:02:05.767Z'
      },
      {
        id: 5,
        code: 'TBA-55667788',
        createdAt: 'Senin, 5 Agustus 2024',
        receivedAt: 'Senin, 5 Agustus 2024',
        createdBy: {
          name: 'Superadmin',
          roleName: 'Admin'
        },
        warehouseOrigin: 'GUDANG LANTAI 4 KANTOR',
        status: 'APPROVED',
        dateCreated: '2024-08-05T04:01:58.182Z',
        dateReceived: '2024-08-05T04:02:05.767Z'
      }
    ],
    loadingDataAdjustmentGoodsOut: true,
    errorDataAdjustmentGoodsOut: false,

    detailAdjustmentGoodsOut: {},
    loadingDetailAdjustmentGoodsOut: true,
    errorDetailAdjustmentGoodsOut: false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      //   .addCase(fetchInvoiceListProductByWarehouseId.pending, (state, action) => {
      //     state.loadingDataListProductWarehouse = true
      //   })
      //   .addCase(fetchInvoiceListProductByWarehouseId.fulfilled, (state, action) => {
      //     state.dataListProductWarehouse = action.payload.data
      //     state.loadingDataListProductWarehouse = false
      //   })
      //   .addCase(fetchInvoiceListProductByWarehouseId.rejected, (state, action) => {
      //     state.dataListProductWarehouse = []
      //     state.loadingDataListProductWarehouse = false
      //     state.errorDataListProductWarehouse = action.error.message
      //   })

      .addCase(fetchAllAdjustmentGoodsOut.pending, (state, action) => {
        state.loadingDataAdjustmentGoodsOut = true
      })
      .addCase(fetchAllAdjustmentGoodsOut.fulfilled, (state, action) => {
        state.dataAdjustmentGoodsOut = action.payload.data
        state.loadingDataAdjustmentGoodsOut = false
      })
      .addCase(fetchAllAdjustmentGoodsOut.rejected, (state, action) => {
        state.dataAdjustmentGoodsOut = []
        state.loadingDataAdjustmentGoodsOut = false
        state.errorDataAdjustmentGoodsOut = action.error.message
      })

      .addCase(fetchDetailAdjustmentGoodsOut.pending, (state, action) => {
        state.loadingDetailAdjustmentGoodsOut = true
      })
      .addCase(fetchDetailAdjustmentGoodsOut.fulfilled, (state, action) => {
        state.detailAdjustmentGoodsOut = action.payload.data
        state.loadingDetailAdjustmentGoodsOut = false
      })
      .addCase(fetchDetailAdjustmentGoodsOut.rejected, (state, action) => {
        state.detailAdjustmentGoodsOut = {}
        state.loadingDetailAdjustmentGoodsOut = false
        state.errorDetailAdjustmentGoodsOut = action.error.message
      })
  }
})

export default appMasterProductSlice.reducer
