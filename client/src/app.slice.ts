import {
  createSlice,
  Dictionary,
  nanoid,
  PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import { AppState, createAppThunk } from "./store";
import * as modal from "./modal/modal.slice";

function nextReasonID(reasons: Reason[]) {
  const maxId = reasons.reduce(
    (maxId, reason) => Math.max(reason.id, maxId),
    -1
  );
  return maxId + 1;
}

type Marked = { imageID: number; reasonIDs: number[] };

export type Reason = { id: number; label: string };

interface TrainerState {
  imageID: number;
  screen: "pick" | "modal" | "report";
  marked: Marked[];
  reasons: Reason[];
}

const initialState: TrainerState = {
  imageID: 0,
  screen: "pick",
  marked: [],
  reasons: [
    { id: 10, label: "Background" },
    { id: 12, label: "Eyes" },
  ],
};

const appSlice = createSlice({
  name: "trainer",
  initialState,
  reducers: {
    real: (state) => {
      state.imageID = (state.imageID + 1) % 16;
    },
    unreal: (state) => {
      state.screen = "modal";
    },
    confirm: (state, action: PayloadAction<SubmitPhotoPayload>) => {
      const { reasonIDs, otherReason } = action.payload;
      const { imageID } = state;

      const marked: Marked = {
        imageID,
        reasonIDs,
      };

      if (otherReason) {
        const id = nextReasonID(state.reasons);
        state.reasons.push({ id, label: otherReason });
        marked.reasonIDs.push(id);
      }

      state.screen = "pick";
      state.imageID = (state.imageID + 1) % 16;
      state.marked.push(marked);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(modal.cancel, (state) => {
      state.screen = "pick";
    });
  },
});

export type SubmitPhotoPayload = {
  reasonIDs: number[];
  otherReason: string;
};

export const initialise = createAppThunk("trainer/init", async () => {
  const response = await axios.get("http://localhost:3000/api/v1/image?id=1", {
    responseType: "stream",
  });
  console.log(response);
});

export const { confirm, real, unreal } = appSlice.actions;

export default appSlice.reducer;
