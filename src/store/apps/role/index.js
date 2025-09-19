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

// Fetch Roles
export const fetchOneRole = createAsyncThunk('appRoles/fetchOneRole', async params => {
  try {
    const response = await axios({
      method: 'GET',
      url: '/role/' + params
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
export const editRole = createAsyncThunk('appUsers/editRole', async ({ id, data, router }, { getState, dispatch }) => {
  try {
    const response = await axios({
      method: 'PUT',
      url: '/role/' + id,
      data: data
    })
    swalSuccess({ label, name: 'Otoritas', response })
    dispatch(fetchRoles())
    router.push('/settings/roles')
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
    dataRoles: [],

    detailRole: {},
    loadingDetail: false,
    errorDetail: false
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchRoles.fulfilled, (state, action) => {
      state.dataRoles = action.payload.data
    })
    builder.addCase(fetchOneRole.pending, (state, action) => {
      state.loadingDetail = true
    })
    builder.addCase(fetchOneRole.fulfilled, (state, action) => {
      state.loadingDetail = false
      state.detailRole = action.payload.data
    })
    builder.addCase(fetchOneRole.rejected, (state, action) => {
      state.loadingDetail = false
      state.errorDetail = action.error.message
    })
  }
})

export default appRolesSlice.reducer
