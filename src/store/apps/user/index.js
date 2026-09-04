import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'src/configs/axios'
import { swalDeleteConfirmed, swalError, swalSuccess } from 'src/helpers/swalFunction'

const label = 'pengguna'

// ** Fetch Users
export const fetchDataUsers = createAsyncThunk('appUsers/fetchDataUsers', async (filter, { rejectWithValue }) => {
  try {
    const response = await axios({
      method: 'GET',
      url: '/user/all',
      params: filter
    })
    return response.data
  } catch (error) {
    swalError({ label, error })
    return rejectWithValue([])
  }
})

// ** Add User
export const addUser = createAsyncThunk(
  'appUsers/addUser',
  async ({ data, setOpen }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'POST',
        url: '/user/create',
        data
      })
      swalSuccess({ label, name: 'Pengguna', response })
      setOpen(false)
      dispatch(fetchDataUsers())
      return
    } catch (error) {
      swalError({ label, error })
      return rejectWithValue({})
    }
  }
)

// ** Edit User
export const editUser = createAsyncThunk(
  'appUsers/editUser',
  async ({ id, data, setOpen }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'PUT',
        url: `/user/${id}`,
        data
      })
      swalSuccess({ label, name: 'Pengguna', response })
      setOpen(false)
      dispatch(fetchDataUsers())
      return
    } catch (error) {
      swalError({ label, error })
      return rejectWithValue({})
    }
  }
)

// ** Delete User
export const deleteUser = createAsyncThunk(
  'appUsers/deleteUser',
  async ({ id, name }, { dispatch, rejectWithValue }) => {
    try {
      await swalDeleteConfirmed({
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
      return rejectWithValue({})
    }
  }
)

export const appUsersSlice = createSlice({
  name: 'appUsers',
  initialState: {
    dataUsers: [],
    loading: false,
    error: false,

    loadingAdd: false,
    errorAdd: false,

    loadingEdit: false,
    errorEdit: false,

    loadingDelete: false,
    errorDelete: false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchDataUsers.pending, state => {
        state.loading = true
      })
      .addCase(fetchDataUsers.fulfilled, (state, action) => {
        state.dataUsers = action.payload.data
        state.loading = false
        state.error = false
      })
      .addCase(fetchDataUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      .addCase(addUser.pending, state => {
        state.loadingAdd = true
      })
      .addCase(addUser.fulfilled, state => {
        state.loadingAdd = false
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loadingAdd = false
        state.errorAdd = action.error.message
      })

      .addCase(editUser.pending, state => {
        state.loadingEdit = true
      })
      .addCase(editUser.fulfilled, state => {
        state.loadingEdit = false
      })
      .addCase(editUser.rejected, (state, action) => {
        state.loadingEdit = false
        state.errorEdit = action.error.message
      })

      .addCase(deleteUser.pending, state => {
        state.loadingDelete = true
      })
      .addCase(deleteUser.fulfilled, state => {
        state.loadingDelete = false
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loadingDelete = false
        state.errorDelete = action.error.message
      })
  }
})

export default appUsersSlice.reducer
