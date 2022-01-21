import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux'
import appReducer from './app.slice'

const reducer = combineReducers({
  app: appReducer,
})

export const store = configureStore({
  reducer,
})

export type AppState = ReturnType<typeof reducer>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector
