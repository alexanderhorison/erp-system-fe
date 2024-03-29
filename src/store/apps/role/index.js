import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axios from 'src/configs/axios'

// Fetch Roles
export const fetchRoles = createAsyncThunk('appRoles/fetchRoles', async params => {
  const response = await axios({
    method: 'GET',
    url: '/role/all'
  })
  return response.data
})

export const appRoleSlice = createSlice({
  name: 'appRoles',
  initialState: {
    dataRoles: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchRoles.fulfilled, (state, action) => {
      state.dataRoles = action.payload.data
    })
  }
})

export default appRoleSlice.reducer
