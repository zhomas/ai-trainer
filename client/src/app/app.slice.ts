import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from './store'

function nextReasonID(reasons: Reason[]) {
  const maxId = reasons.reduce((maxId, reason) => Math.max(reason.id, maxId), -1)
  return maxId + 1
}

type Marked = { imageID: number; reasonIDs: number[] }

export type Reason = { id: number; label: string }

interface TrainerState {
  imageID: number
  screen: 'pick' | 'modal' | 'report'
  marked: Marked[]
  reasons: Reason[]
}

const initialState: TrainerState = {
  imageID: 4,
  screen: 'pick',
  marked: [
    {
      imageID: 4,
      reasonIDs: [0, 3],
    },
    {
      imageID: 5,
      reasonIDs: [2, 3],
    },
    {
      imageID: 6,
      reasonIDs: [0],
    },
    {
      imageID: 7,
      reasonIDs: [0, 1, 3],
    },
  ],
  reasons: [
    {
      id: 0,
      label: 'Background',
    },
    {
      id: 1,
      label: 'Eyes',
    },
    {
      id: 2,
      label: 'Nose',
    },
    {
      id: 3,
      label: 'Hair',
    },
    {
      id: 4,
      label: 'Mouth',
    },
    {
      id: 5,
      label: 'Ears',
    },
    {
      id: 6,
      label: 'Jewellery',
    },
  ],
}

const appSlice = createSlice({
  name: 'trainer',
  initialState,
  reducers: {
    real: state => {
      state.imageID = (state.imageID + 1) % 16
    },
    showReport: state => {
      state.screen = 'report'
    },
    showModal: state => {
      state.screen = 'modal'
    },
    showPicker: state => {
      state.screen = 'pick'
    },
    confirm: (state, action: PayloadAction<SubmitPhotoPayload>) => {
      const { reasonIDs, otherReason } = action.payload
      const { imageID } = state
      const marked: Marked = { imageID, reasonIDs }

      if (otherReason) {
        const id = nextReasonID(state.reasons)
        state.reasons.push({ id, label: otherReason })
        marked.reasonIDs.push(id)
      }

      state.screen = 'pick'
      state.imageID = (state.imageID + 1) % 16
      state.marked.push(marked)
    },
    remove: (state, action: PayloadAction<{ id: number }>) => {
      state.marked = state.marked.filter(result => result.imageID !== action.payload.id)
    },
  },
})

export type SubmitPhotoPayload = {
  reasonIDs: number[]
  otherReason?: string
}

export const { confirm, real, remove, showReport, showModal, showPicker } = appSlice.actions

export default appSlice.reducer
