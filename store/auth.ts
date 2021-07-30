import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  constructSuccessPayload,
  constructErrorPayload,
  constructExtraReducer,
} from '~/store/helper'
import { login as loginCall, logout as logoutCall } from '~/api/auth'

interface IState {
  authenticated: boolean
  loading: object
  responses: object
}
const initialState = {
  authenticated: false,
  loading: {},
  responses: {},
} as IState

export const login = createAsyncThunk(
  'auth/login',
  async (payload: object, { rejectWithValue }) => {
    const [res, resErr] = await loginCall(payload)
    if (resErr) {
      return rejectWithValue(constructErrorPayload(resErr))
    }
    return constructSuccessPayload(res)
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    const [res, resErr] = await logoutCall()
    if (resErr) {
      return rejectWithValue(constructErrorPayload(resErr))
    }
    return constructSuccessPayload(res)
  }
)

export const reducerSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticate(state) {
      state.authenticated = true
    },
  },
  extraReducers: (builder) => {
    constructExtraReducer(builder, login, () => {
      return {
        authenticated: true,
      }
    })
    constructExtraReducer(builder, logout, () => {
      return {
        authenticated: false,
      }
    })
  },
})

export const { authenticate } = reducerSlice.actions
export default reducerSlice.reducer