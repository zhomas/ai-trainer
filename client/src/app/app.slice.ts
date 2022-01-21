import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from './store'

const IMAGES_COUNT = 16

type Result = { id: number; reasonIDs: number[] }

type Reason = { id: number; label: string }

interface TrainerState {
  imageID: number
  screen: 'pick' | 'modal' | 'report'
  results: Result[]
  reasons: Reason[]
}

const initialState: TrainerState = {
  imageID: 0,
  screen: 'pick',
  results: [],
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

/**
 * Loads the next photo in the series.
 * @param state
 */
const showNext = (state: TrainerState) => {
  state.imageID = (state.imageID + 1) % IMAGES_COUNT
}

/**
 * Gets a unique ID.
 * @param reasons
 * @returns number
 */
const nextReasonID = (reasons: Reason[]) => {
  const maxId = reasons.reduce((maxId, reason) => Math.max(reason.id, maxId), -1)
  return maxId + 1
}

/**
 * Adds a result to the collection.
 * @param state
 * @param action
 */
const submitPhotoResponse = (
  state: TrainerState,
  action: PayloadAction<SubmitPhotoPayload>
) => {
  const { reasonIDs, otherReason } = action.payload
  const { imageID } = state
  const marked: Result = { id: imageID, reasonIDs }

  if (otherReason) {
    const id = nextReasonID(state.reasons)
    state.reasons.push({ id, label: otherReason })
    marked.reasonIDs.push(id)
  }

  state.screen = 'pick'
  state.results.push(marked)
  showNext(state)
}

const appSlice = createSlice({
  name: 'trainer',
  initialState,
  reducers: {
    showReport: state => {
      state.screen = 'report'
    },
    showModal: state => {
      state.screen = 'modal'
    },
    showPicker: state => {
      state.screen = 'pick'
    },
    removeResult: (state, action: PayloadAction<{ id: number }>) => {
      state.results = state.results.filter(result => result.id !== action.payload.id)
    },
    loadNextPhoto: showNext,
    submitResult: submitPhotoResponse,
  },
})

export type SubmitPhotoPayload = {
  reasonIDs: number[]
  otherReason?: string
}

export const {
  submitResult, //
  loadNextPhoto,
  removeResult,
  showReport,
  showModal,
  showPicker,
} = appSlice.actions

export default appSlice.reducer
