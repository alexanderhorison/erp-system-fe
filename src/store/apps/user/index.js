import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'src/configs/axios'
import { swalConfirmationDelete, swalError, swalSuccess } from 'src/helpers/swalFunction'

const label = 'pengguna'

// ** Fetch Users
export const fetchDataUsers = createAsyncThunk('appUsers/fetchDataUsers', async filter => {
  try {
    const response = await axios({
      method: 'GET',
      url: '/user/all',
      params: filter
    })
    return response.data
  } catch (error) {
    swalError({ label, error })
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
    swalSuccess({ label, name: 'Pengguna', response })
    dispatch(fetchDataUsers())
    return
  } catch (error) {
    swalError({ label, error })
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
    swalSuccess({ label, name: 'Pengguna', response })
    dispatch(fetchDataUsers())
    return
  } catch (error) {
    swalError({ label, error })
  }
})

// ** Delete User
export const deleteUser = createAsyncThunk('appUsers/deleteUser', async ({ id, name }, { getState, dispatch }) => {
  try {
    await swalConfirmationDelete({
      label,
      name,
      axiosRequest: () => {
        return axios({
          method: 'DELETE',
          url: `/user/${id}`
        })
      },
      dispatchRequest: () => {
        return dispatch(fetchDataUsers())
      }
    })
  } catch (error) {
    swalError({ label, error })
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
