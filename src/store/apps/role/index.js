import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

import axios from 'src/configs/axios'

// Fetch Roles
export const fetchRoles = createAsyncThunk('appRoles/fetchRoles', async params => {
  const response = await axios({
    method: 'GET',
    url: '/role/all'
  })
  return response.data
})

// ** Add Role
export const addRole = createAsyncThunk('appUsers/addRole', async (data, { getState, dispatch }) => {
  try {
    const response = await axios({
      method: 'POST',
      url: '/role/create',
      data: data
    })
    toast.success(response.data.message)
    dispatch(fetchRoles())
    return
  } catch (error) {
    toast.error(error.response.data.message || error)
  }
})

// Edit Role
export const editRole = createAsyncThunk('appUsers/editRole', async (data, { getState, dispatch }) => {
  try {
    const response = await axios({
      method: 'PUT',
      url: `/role/${data.id}`,
      data: data
    })
    toast.success(response.data.message)
    dispatch(fetchRoles())
    return
  } catch (error) {
    return toast.error(error.response.data.message || error)
  }
})

// ** Delete Role
export const deleteRole = createAsyncThunk('appUsers/deleteRole', async (id, { getState, dispatch }) => {
  try {
    const response = await axios({
      method: 'DELETE',
      url: `/role/${id}`
    })
    toast.success(response.data.message)
    dispatch(fetchRoles())
    return
  } catch (error) {
    toast.error(error.response.data.message || error)
  }
})

export const appRolesSlice = createSlice({
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

export default appRolesSlice.reducer
