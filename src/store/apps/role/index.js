import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'src/configs/axios'
import { swalConfirmationDelete, swalError, swalSuccess } from 'src/helpers/swalFunction'

const label = 'otoritas'

// Fetch Roles
export const fetchRoles = createAsyncThunk('appRoles/fetchRoles', async params => {
  try {
    const response = await axios({
      method: 'GET',
      url: '/role/all'
    })
    return response.data
  } catch (error) {
    swalError({ label, error })
  }
})

// ** Add Role
export const addRole = createAsyncThunk('appUsers/addRole', async (data, { getState, dispatch }) => {
  try {
    const response = await axios({
      method: 'POST',
      url: '/role/create',
      data: data
    })
    swalSuccess({ label, name: 'Otoritas', response })
    dispatch(fetchRoles())
    return
  } catch (error) {
    swalError({ label, error })
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
    swalSuccess({ label, name: 'Otoritas', response })
    dispatch(fetchRoles())
    return
  } catch (error) {
    swalError({ label, error })
  }
})

// ** Delete Role
export const deleteRole = createAsyncThunk('appUsers/deleteRole', async ({ id, name }, { getState, dispatch }) => {
  try {
    await swalConfirmationDelete({
      label,
      name,
      axiosRequest: () => {
        return axios({
          method: 'DELETE',
          url: `/role/${id}`
        })
      },
      dispatchRequest: () => {
        return dispatch(fetchRoles())
      }
    })
  } catch (error) {
    swalError({ label, error })
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
