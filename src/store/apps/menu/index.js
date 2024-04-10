import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'

// Fetch Menus
export const fetchMenus = createAsyncThunk('appMenus/fetchMenus', async params => {
  const response = await axios({
    method: 'GET',
    url: '/menu/all'
  })
  return response.data
})

export const appMenusSlice = createSlice({
  name: 'appMenus',
  initialState: {
    dataMenus: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchMenus.fulfilled, (state, action) => {
      state.dataMenus = action.payload.data
    })
  }
})

export default appMenusSlice.reducer
