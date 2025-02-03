import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import {
  swalConfirmationAdd,
  swalConfirmationDelete,
  swalError,
  swalSuccess,
  swalToastError
} from 'src/helpers/swalFunction'
import { fetchListProductByWarehouse } from '../product-warehouse'

const label = 'stock opname'

// GET ALL LIST STOCK OPNAME
export const fetchListStockOpname = createAsyncThunk(
  'appListStockOpname/fetchData',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/stock-opname',
        params
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// GET DETAIL STOCK OPNAME
export const fetchDetailStockOpname = createAsyncThunk(
  'appDetailStockOpname/fetchData',
  async (stockOpnameId, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/stock-opname/detail/' + stockOpnameId
      })
      return response.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue({})
    }
  }
)

// CREATE STOCK OPNAME
export const createStockOpname = createAsyncThunk(
  'appStockOpname/createStockOpname',
  async ({ sendData, router }, { dispatch, rejectWithValue }) => {
    try {
      const response = await swalConfirmationAdd({
        label,
        name: 'Stock Opname',
        title: 'Anda akan membuat Stock Opname?',
        axiosRequest: () => {
          return axios({
            method: 'POST',
            url: '/stock-opname/create',
            data: sendData
          })
        },
        dispatchRequest: () => {
          router.push('/stock-opname')
          dispatch(fetchListStockOpname())
        }
      })
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

// UPDATE STOCK OPNAME
export const updateStockOpname = createAsyncThunk(
  'appStockOpname/updateStockOpname',
  async ({ id, sendData, router }, { dispatch, rejectWithValue }) => {
    try {
      const response = await swalConfirmationAdd({
        label,
        name: 'Stock Opname',
        title: 'Anda akan merubah Stock Opname?',
        axiosRequest: () => {
          return axios({
            method: 'PUT',
            url: '/stock-opname/' + id,
            data: sendData
          })
        },
        dispatchRequest: () => {
          router.push('/stock-opname')
        }
      })
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

// DELETE STOCK OPNAME
export const deleteStockOpname = createAsyncThunk(
  'appStockOpname/deleteStockOpname',
  async ({ id, name }, { dispatch, rejectWithValue }) => {
    try {
      await swalConfirmationDelete({
        label,
        name,
        axiosRequest: () => {
          return axios({
            method: 'DELETE',
            url: '/stock-opname/' + id
          })
        },
        dispatchRequest: () => {
          return dispatch(fetchListStockOpname())
        }
      })
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

// UPDATE STATUS STOCK OPNAME
export const updateStatusStockOpname = createAsyncThunk(
  'appStockOpname/updateStatusStockOpname',
  async ({ stockOpnameId, status, router }, { dispatch, rejectWithValue }) => {
    try {
      const response = await swalConfirmationAdd({
        label,
        name: 'Stock Opname',
        title: `Anda akan ${status} Stock Opname?`,
        axiosRequest: () => {
          return axios({
            method: 'PUT',
            url: `/stock-opname/${status}/` + stockOpnameId,
          })
        },
        dispatchRequest: () => {
          router.push('/stock-opname')
          dispatch(fetchListStockOpname())
        }
      })
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

export const confirmStockOpname = createAsyncThunk(
  'appStockOpname/confirmStockOpname',
  async ({ stockOpnameId, listProduct, router }, { dispatch, rejectWithValue }) => {
    try {
      const response = await swalConfirmationAdd({
        label,
        name: 'Konfirmasi Stock Opname',
        title: `Apakah anda yakin ingin menyelesaikan / adjust stock untuk produk yang sudah dipilih?`,
        axiosRequest: () => {
          return axios({
            method: 'POST',
            url: `/stock-opname/confirm/` + stockOpnameId,
            data: listProduct
          })
        },
        dispatchRequest: () => {
          router.push('/stock-opname')
          dispatch(fetchListStockOpname())
        }
      })
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

export const checkStockOpnameWarehouse = createAsyncThunk(
  'appStockOpname/checkStockOpnameWarehouse',
  async ({ warehouseId }, { dispatch, rejectWithValue }) => {
    try {
      if (warehouseId === 0)
        return {
          isHaveStockOpname: false,
          message: ''
        }
      const response = await axios({
        method: 'GET',
        url: `/stock-opname/check-warehouse/${warehouseId}`
      })
      if (response.data.data.isHaveStockOpname) {
        return response.data.data
      } else {
        dispatch(fetchListProductByWarehouse({ warehouseId }))
      }
      return response.data.data
    } catch (error) {
      swalError({ error, label })
      return rejectWithValue({})
    }
  }
)

export const exportStockOpname = createAsyncThunk(
  'appStockOpname/exportStockOpname',
  async ({ code }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/export/stock-opname/${code}`, {
        responseType: 'arraybuffer', // Ensures binary data is received correctly
      });

      const type = response.headers['content-type'];
      const contentDisposition = response.headers['content-disposition'];

      // Extract filename from Content-Disposition header
      let filename = 'Stock Opname.xlsx';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename\*?=["']?([^"';\n]+)["']?/);
        if (filenameMatch) {
          filename = decodeURIComponent(filenameMatch[1]); // Decode in case of special characters
        }
      }

      // Create Blob from response
      const blob = new Blob([response.data], { type });

      // Trigger file download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup Blob URL
      window.URL.revokeObjectURL(blobUrl);
      return { success: true };
    } catch (error) {
      console.error('Error exporting:', error);
      return rejectWithValue('Failed to export. Please try again.');
    }
  }
);

// REDUCER STOCK OPNAME
export const appStockOpnameSlice = createSlice({
  name: 'appStockOpname',
  initialState: {
    listData: [],
    detailStockOpname: {
      listProduct: []
    },
    loadingCheckStockOpname: false,
    checkStockOpname: {
      message: '',
      isHaveStockOpname: false
    },
    loading: false,
    error: false,
    total: 1,
    params: {},
    allData: [],

    loadingExport: false,
    errorExport: false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchListStockOpname.pending, (state, action) => {
        state.loading = true
      })
      .addCase(fetchListStockOpname.fulfilled, (state, action) => {
        state.listData = action.payload.data
        state.loading = false
      })
      .addCase(fetchListStockOpname.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchDetailStockOpname.pending, (state, action) => {
        state.loading = true
      })
      .addCase(fetchDetailStockOpname.fulfilled, (state, action) => {
        state.detailStockOpname = action.payload.data
        state.loading = false
      })
      .addCase(fetchDetailStockOpname.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(checkStockOpnameWarehouse.pending, (state, action) => {
        state.loadingCheckStockOpname = true
      })
      .addCase(checkStockOpnameWarehouse.fulfilled, (state, action) => {
        state.checkStockOpname = action.payload
        state.loadingCheckStockOpname = false
      })
      .addCase(checkStockOpnameWarehouse.rejected, (state, action) => {
        state.loadingCheckStockOpname = false
        state.error = action.error.message
      })

      // EXPORT
      .addCase(exportStockOpname.pending, (state) => {
        state.loadingExport = true;
        state.errorExport = null;
      })
      .addCase(exportStockOpname.fulfilled, (state) => {
        state.loadingExport = false;
      })
      .addCase(exportStockOpname.rejected, (state, action) => {
        state.loadingExport = false;
        state.errorExport = action.payload;
      });
  }
})

export default appStockOpnameSlice.reducer
