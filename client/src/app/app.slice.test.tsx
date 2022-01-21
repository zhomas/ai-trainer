import React from 'react'
import { render, screen } from '@testing-library/react'
import App from '.'
import reducer, { confirm, remove } from './app.slice'

it('adds a result to the state', () => {
  const action = confirm({ reasonIDs: [0] })

  const state = reducer(
    {
      imageID: 0,
      marked: [],
      reasons: [],
      screen: 'pick',
    },
    action
  )

  expect(state.marked).toEqual([{ imageID: 0, reasonIDs: [0] }])
})

it('adds a result with multiple reasons to the state', () => {
  const action = confirm({ reasonIDs: [0, 1, 2] })

  const state = reducer(
    {
      imageID: 0,
      marked: [],
      reasons: [],
      screen: 'pick',
    },
    action
  )

  expect(state.marked).toEqual([{ imageID: 0, reasonIDs: [0, 1, 2] }])
})

it('removes a result from the state', () => {
  const action = remove({ id: 0 })

  const state = reducer(
    {
      imageID: 0,
      marked: [{ imageID: 0, reasonIDs: [0] }],
      reasons: [],
      screen: 'pick',
    },
    action
  )

  expect(state.marked).toEqual([])
})

it('stores the reason when submitting a photo result', () => {
  const action = confirm({ reasonIDs: [0], otherReason: 'Custom' })

  const state = reducer(
    {
      imageID: 0,
      marked: [],
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
