import React from 'react'
import { render, screen } from '@testing-library/react'
import App from '.'
import reducer, { submitResult, removeResult } from './app.slice'

it('adds a result to the state', () => {
  const action = submitResult({ reasonIDs: [0] })

  const state = reducer(
    {
      imageID: 0,
      results: [],
      reasons: [],
      screen: 'pick',
    },
    action
  )

  expect(state.results).toEqual([{ imageID: 0, reasonIDs: [0] }])
})

it('adds a result with multiple reasons to the state', () => {
  const action = submitResult({ reasonIDs: [0, 1, 2] })

  const state = reducer(
    {
      imageID: 0,
      results: [],
      reasons: [],
      screen: 'pick',
    },
    action
  )

  expect(state.results).toEqual([{ imageID: 0, reasonIDs: [0, 1, 2] }])
})

it('removes a result from the state', () => {
  const action = removeResult({ id: 0 })

  const state = reducer(
    {
      imageID: 0,
      results: [{ id: 0, reasonIDs: [0] }],
      reasons: [],
      screen: 'pick',
    },
    action
  )

  expect(state.results).toEqual([])
})

it('stores the reason when submitting a photo result', () => {
  const action = submitResult({ reasonIDs: [0], otherReason: 'Custom' })

  const state = reducer(
    {
      imageID: 0,
      results: [],
      reasons: [{ id: 0, label: 'Eyes' }],
      screen: 'pick',
    },
    action
  )

  expect(state.reasons).toEqual([
    { id: 0, label: 'Eyes' },
    { id: 1, label: 'Custom' },
  ])
})
