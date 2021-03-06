import { Store, createStore, DB } from 'jiber-core'
import { ServerSettingsInput } from './interfaces/server-settings-input'
import { ServerSettings } from './interfaces/server-settings'
import { ServerState } from './interfaces/server-state'
import { createSocketServer, SocketServer } from './socket-server/index'
import { createServerReducer } from './reducers/server-reducer'
import { defaultServerSettings } from './default-server-settings'
import { onAction } from './on-action'

export interface ServerStore extends Store {
  getState: () => ServerState,
  socketServer: SocketServer,
  db: DB,
  settings: ServerSettings,
  start: () => void,
  stop: () => void
}

export const createServerStore = (
  inputSettings: ServerSettingsInput = {}
): ServerStore => {
  const initialState = inputSettings.initialState
  const settings = { ...defaultServerSettings, ...inputSettings }
  const serverReducer = createServerReducer(settings.reducer)
  const store = createStore(serverReducer, initialState)
  const serverStore = { ...store, db: settings.db, settings } as ServerStore

  const socketServer = createSocketServer(serverStore)
  serverStore.socketServer = socketServer
  serverStore.start = socketServer.start
  serverStore.stop = socketServer.stop

  settings.db.onaction = (action) => onAction(serverStore, action)

  return serverStore
}
