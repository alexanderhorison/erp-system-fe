import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'

export const fetchDataMasterCategory = createAsyncThunk('appMasterCategory/fetchData', async params => {
  const response = await axios({
    method: 'GET',
    url: process.env.NEXT_PUBLIC_BASE_URL + '/master/category/all'
  })
  console.log(response.data)
  return response.data
})

export const appMasterCategorySlice = createSlice({
  name: 'masterCategory',
  initialState: {
    data: [],
    loading: false,
    error: false,
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchDataMasterCategory.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.params = action.payload.params
        state.allData = action.payload.allData
        state.total = action.payload.total
      })
      .addCase(fetchDataMasterCategory.pending, (state, action) => {
        state.loading = true
      })
      .addCase(fetchDataMasterCategory.rejected, (state, action) => {
        state.error = true
      })
  }
})

export default appMasterCategorySlice.reducer
