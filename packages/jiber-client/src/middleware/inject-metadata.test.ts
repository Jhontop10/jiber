import { injectMetadata } from './inject-metadata'
import { Action } from 'jiber-core'

let lastAction: Action
const state = {
  me: { userId: 'bob' },
  rooms: {
    testRoom: {
      members: { bob: { actionId: 0, fun: true } }
    }
  }
}
const store = {
  dispatch: () => 'do nothing',
  getState: () => state,
  subscribe: () => () => 'do nothing'
}
const final = (action: Action) => lastAction = action
const inner = injectMetadata(store)(final)

test('$user is added to the metadata', () => {
  const action: Action = { type: 'test', $roomId: 'testRoom', $userId: 'bob' }
  inner(action)
  expect(lastAction.$user).toEqual({ actionId: 0, fun: true })
})

test('timeMs is added to the metadata', () => {
  const action: Action = { type: 'test', $roomId: 'testRoom' }
  inner(action)
  expect(lastAction.$timeMs).toBeTruthy()
})

test('actions with existing metadata are not altered', () => {
  const action = { type: 'test', $roomId: 'testRoom', $actionId: 5 }
  inner(action)
  expect(lastAction).toEqual(action)
})
