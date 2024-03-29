import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

// ** Axios Imports
import axios from 'src/configs/axios'

// ** Fetch Users
export const fetchDataUsers = createAsyncThunk('appUsers/fetchDataUsers', async () => {
  try {
    const response = await axios({
      method: 'GET',
      url: '/user/all'
    })
    return response.data
  } catch (error) {
    toast.error(error.response.data.message || error)
  }
})

// ** Add User
export const addUser = createAsyncThunk('appUsers/addUser', async (data, { getState, dispatch }) => {
  try {
    const response = await axios({
      method: 'POST',
      url: '/user/create',
      data: data
    })
    toast.success(response.data.message)
    dispatch(fetchDataUsers())
    return
  } catch (error) {
    toast.error(error.response.data.message || error)
  }
})

// ** Edit User
export const editUser = createAsyncThunk('appUsers/editUser', async (data, { getState, dispatch }) => {
  try {
    const response = await axios({
      method: 'PUT',
      url: `/user/${data.id}`,
      data: data
    })
    toast.success(response.data.message)
    dispatch(fetchDataUsers())
    return
  } catch (error) {
    return toast.error(error.response.data.message || error)
  }
})

// ** Delete User
export const deleteUser = createAsyncThunk('appUsers/deleteUser', async (id, { getState, dispatch }) => {
  try {
    const response = await axios({
      method: 'DELETE',
      url: `/user/${id}`
    })
    toast.success(response.data.message)
    dispatch(fetchDataUsers())
    return
  } catch (error) {
    toast.error(error.response.data.message || error)
  }
})

export const appUsersSlice = createSlice({
  name: 'appUsers',
  initialState: {
    dataUsers: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchDataUsers.fulfilled, (state, action) => {
      state.dataUsers = action.payload.data
    })
  }
})

export default appUsersSlice.reducer
