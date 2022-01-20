import {
  configureStore,
  AsyncThunkPayloadCreator,
  createAsyncThunk,
  combineReducers,
} from "@reduxjs/toolkit";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import appReducer from "./app.slice";
import modalReducer from "./modal/modal.slice";

const reducer = combineReducers({
  app: appReducer,
  modal: modalReducer,
});

export const store = configureStore({
  reducer,
});

export type AppState = ReturnType<typeof reducer>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

type ThunkApiConfig = {
  dispatch: AppDispatch;
  state: AppState;
};

export function createAppThunk<Returned = void, ThunkArg = void>(
  typePrefix: string,
  payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, ThunkApiConfig>
) {
  return createAsyncThunk<Returned, ThunkArg, ThunkApiConfig>(
    typePrefix,
    payloadCreator
  );
}
