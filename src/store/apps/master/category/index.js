import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchDataMasterCategory = createAsyncThunk('appMasterCategory/fetchData', async params => {
  const response = await axios.get('http://localhost:5000/master/category/all', {
    params
  })

  return response.data
})

export const appMasterCategorySlice = createSlice({
  name: 'masterCategory',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchDataMasterCategory.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.params = action.payload.params
      state.allData = action.payload.allData
      state.total = action.payload.total
    })
  }
})

export default appMasterCategorySlice.reducer
