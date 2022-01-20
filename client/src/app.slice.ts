import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppState } from "./store";

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
    showReport: (state) => {
      state.screen = "report";
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
});

export type SubmitPhotoPayload = {
  reasonIDs: number[];
  otherReason: string;
};

const reasonLabelSelector = (state: AppState) => (rID: number) => {
  const match = state.app.reasons.find((r) => r.id === rID);

  if (match) return match.label;

  throw new Error("Not found");
};

export const reportSelector = (state: AppState) => {
  const ids = state.app.reasons.map((r) => r.id);
  const getLabel = reasonLabelSelector(state);
  return ids
    .map((rID) => {
      return {
        label: getLabel(rID),
        photos: state.app.marked
          .filter((ph) => ph.reasonIDs.includes(rID))
          .map((r) => `http://localhost:3000/api/v1/image?id=${r.imageID}`),
      };
    })
    .filter((group) => group.photos.length > 0);
};

export const { confirm, real, unreal, showReport } = appSlice.actions;

export default appSlice.reducer;
