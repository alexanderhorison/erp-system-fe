import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalToastError } from 'src/helpers/swalFunction'

const label = 'config'

// REDUCER CONFIG
export const appPrinterSlice = createSlice({
  name: 'appPrinter',
  initialState: {

  },
  reducers: {},
  extraReducers: builder => {

  }
})

export default appPrinterSlice.reducer