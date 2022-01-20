import { createSlice, Dictionary, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { nanoid } from "nanoid";
import { AppState, createAppThunk } from "../store";

interface ModalState {
  otherReasonLabel: string;
  selected: Dictionary<boolean>;
}

const initialState: ModalState = {
  otherReasonLabel: "",
  selected: {},
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    toggleReason: (state, action: PayloadAction<{ id: string }>) => {
      state.selected[action.payload.id] = !state.selected[action.payload.id];
    },
    cancel: (state) => {},
  },
  extraReducers: (builder) => {},
});

export const { cancel, toggleReason } = modalSlice.actions;

export default modalSlice.reducer;
