import { Action, Store } from '../core/index'
import { createSendToServer } from './middleware/send-to-server'
import { injectMetadata } from './middleware/inject-metadata'
import { createStore } from '../core/index'
import { ClientSettingsInput } from './interfaces/client-settings-input'
import { ClientState } from './interfaces/client-state'
import { createSocket } from './socket/index'
import { createCreateRoom } from './create-room'
import { defaultOptions } from './default-options'
import { createClientReducer } from './client-reducer'

export interface ClientStore extends Store {
  getState: () => ClientState,
  createRoom: (roomId: string) => any
}

/**
 * When creating a client store, add middleware to send actions to the server
 * and peers
 */
export const createClientStore = (optionInput: ClientSettingsInput = {}) => {
  const options = {...defaultOptions, ...optionInput}
  const clientReducer = createClientReducer(options.reducer)
  const send = (action: Action) => hopeSocket.send(action)                      // tslint:disable-line
  const sendToServer = createSendToServer(send)
  const middleware = [...options.middleware, sendToServer, injectMetadata]
  const store = createStore(clientReducer, options.initialState, middleware)
  const createRoom = createCreateRoom(store)
  const clientStore: ClientStore = {...store, createRoom}
  const serverOptions = {...options, store: clientStore}
  const hopeSocket = createSocket(clientStore, serverOptions)

  return clientStore
}
