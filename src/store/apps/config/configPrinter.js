import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalConfirmationDelete, swalSuccess, swalToastError } from 'src/helpers/swalFunction'

const label = 'Printer'
// GET DETAIL PRINTER
export const fetchDetailPrinter = createAsyncThunk(
  'appDashboard/fetchDetailPrinter',
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'POST',
        url: '/config/detail',
        data: query
      })
      return response.data.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)
// GET ALL PRINTER
export const fetchAllPrinter = createAsyncThunk(
  'appDashboard/fetchAllPrinter',
  async ({ query }, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'POST',
        url: '/config/all',
        data: {
          category: 'PRINTER'
        }
      })
      return response.data.data
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)
// ADD PRINTER
export const fetchAddPrinter = createAsyncThunk(
  'appDashboard/fetchAddPrinter',
  async ({ payload, setOpen }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios({
        method: 'POST',
        url: '/config/create',
        data: payload
      })
      swalSuccess({ label, name: 'Printer', response })
      dispatch(fetchAllPrinter({}))
      setOpen(false)
      return
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)
// DELETE PRINTER
export const fetchDeletePrinter = createAsyncThunk(
  'appDashboard/fetchDeletePrinter',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await swalConfirmationDelete({
        label: 'Printer',
        name: payload.name,
        axiosRequest: () => {
          return axios({
            method: 'DELETE',
            url: '/config/delete',
            data: {
              id: payload.id
            }
          })
        },
        dispatchRequest: () => {
          dispatch(fetchAllPrinter({}))
        }
      })
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)
// UPDATE PRINTER
export const fetchEditPrinter = createAsyncThunk(
  'appDashboard/fetchEditPrinter',
  async ({ id, payload, setOpen }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios({
        method: 'POST',
        url: '/config/update/' + id,
        data: payload
      })
      swalSuccess({ label, name: 'Printer', response })
      dispatch(fetchAllPrinter({}))
      setOpen(false)
      return
    } catch (error) {
      swalToastError({ label, error })
      return rejectWithValue([])
    }
  }
)

// FETCH PRINTER HEALTH STATUS
export const fetchPrinterHealthCheck = createAsyncThunk(
  'appDashboard/fetchPrinterHealthCheck',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'GET',
        url: '/health-check/printer/'
      })
      return response.data.data
    } catch (error) {
      console.error('Error fetching printer health check:', error)
      return rejectWithValue([])
    }
  }
)

// PRINTER CONFIG
export const appPrinterSlice = createSlice({
  name: 'appPrinter',
  initialState: {
    // FOR POS
    printerStatus: {
      connected: false,
      printing: false,
      error: false,
      loading: false
    },

    printerConfig: null,
    loadingPrinterConfig: false,
    errorPrinterConfig: false,

    // FOR DETAIL PRINTER
    printerDetail: null,
    loadingPrinterDetail: false,
    errorPrinterDetail: false,

    // FOR CRUD
    listPrinter: [],
    loadingListPrinter: false,
    errorListPrinter: false,

    // PRINTER HEALTH CHECK
    printerHealthStatus: [],
    loadingPrinterHealth: false,
    errorPrinterHealth: false,

    // ADD
    loadingAddPrinter: false,
    errorAddPrinter: false,

    // DELETE
    loadingDeletePrinter: false,
    errorDeletePrinter: false,

    // EDIT
    loadingEditPrinter: false,
    errorEditPrinter: false
  },
  reducers: {
    setPrinterStatus: (state, action) => {
      state.printerStatus = { ...state.printerStatus, ...action.payload }
    }
  },
  extraReducers: builder => {
    builder
      // GET DETAIL PRINTER
      .addCase(fetchDetailPrinter.pending, (state, action) => {
        state.loadingPrinterDetail = true
      })
      .addCase(fetchDetailPrinter.fulfilled, (state, action) => {
        state.loadingPrinterDetail = false
        state.printerDetail = action.payload
      })
      .addCase(fetchDetailPrinter.rejected, (state, action) => {
        state.loadingPrinterDetail = false
        state.errorPrinterDetail = true
      })
      // GET ALL PRINTER
      .addCase(fetchAllPrinter.pending, (state, action) => {
        state.loadingListPrinter = true
      })
      .addCase(fetchAllPrinter.fulfilled, (state, action) => {
        state.loadingListPrinter = false
        state.listPrinter = action.payload
      })
      .addCase(fetchAllPrinter.rejected, (state, action) => {
        state.loadingListPrinter = false
        state.errorListPrinter = true
      })
      // ADD PRINTER
      .addCase(fetchAddPrinter.pending, (state, action) => {
        state.loadingAddPrinter = true
      })
      .addCase(fetchAddPrinter.fulfilled, (state, action) => {
        state.loadingAddPrinter = false
      })
      .addCase(fetchAddPrinter.rejected, (state, action) => {
        state.loadingAddPrinter = false
        state.errorAddPrinter = true
      })
      // DELETE PRINTER
      .addCase(fetchDeletePrinter.pending, (state, action) => {
        state.loadingDeletePrinter = true
      })
      .addCase(fetchDeletePrinter.fulfilled, (state, action) => {
        state.loadingDeletePrinter = false
      })
      .addCase(fetchDeletePrinter.rejected, (state, action) => {
        state.loadingDeletePrinter = false
        state.errorDeletePrinter = true
      })
      // EDIT PRINTER
      .addCase(fetchEditPrinter.pending, (state, action) => {
        state.loadingEditPrinter = true
      })
      .addCase(fetchEditPrinter.fulfilled, (state, action) => {
        state.loadingEditPrinter = false
      })
      .addCase(fetchEditPrinter.rejected, (state, action) => {
        state.loadingEditPrinter = false
        state.errorEditPrinter = true
      })
      // FETCH PRINTER HEALTH CHECK
      .addCase(fetchPrinterHealthCheck.pending, (state, action) => {
        state.loadingPrinterHealth = true
      })
      .addCase(fetchPrinterHealthCheck.fulfilled, (state, action) => {
        state.loadingPrinterHealth = false
        state.printerHealthStatus = action.payload
      })
      .addCase(fetchPrinterHealthCheck.rejected, (state, action) => {
        state.loadingPrinterHealth = false
        state.errorPrinterHealth = true
      })
  }
})
export const { setPrinterStatus } = appPrinterSlice.actions
export default appPrinterSlice.reducer
