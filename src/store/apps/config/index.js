import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalToastError } from 'src/helpers/swalFunction'

const label = 'config'
export const fetchConfigPrinter = createAsyncThunk('appDashboard/fetchConfigPrinter', async ({ query }, { rejectWithValue }) => {
  try {
    const response = await axios({
      method: 'POST',
      url: '/config/detail',
      data: {
        key: "PRINTER_SETTING"
      }
    })
    return response.data.data.value_json
  } catch (error) {
    swalToastError({ label, error })
    return rejectWithValue([])
  }
})

// REDUCER CONFIG
export const appPrinterSlice = createSlice({
  name: 'appPrinter',
  initialState: {
    printerStatus: {
      connected: false,
      printing: false,
      error: false,
      loading: false,
    },
    printerConfig: null,
    loadingPrinterConfig: false,
    errorPrinterConfig: false,
  },
  reducers: {
    setPrinterStatus: (state, action) => {
      state.printerStatus = { ...state.printerStatus, ...action.payload };
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchConfigPrinter.pending, (state, action) => {
        state.loadingPrinterConfig = true
      })
      .addCase(fetchConfigPrinter.fulfilled, (state, action) => {
        state.loadingPrinterConfig = false
        state.printerConfig = action.payload
      })
      .addCase(fetchConfigPrinter.rejected, (state, action) => {
        state.loadingPrinterConfig = false
        state.errorPrinterConfig = true
      })
  }
})
export const { setPrinterStatus } = appPrinterSlice.actions;
export default appPrinterSlice.reducer