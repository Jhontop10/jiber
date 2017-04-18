interface IState {
  [key: string]: any
}

/**
 * Factory to create a dict reducer that stores sub-states by key,
 * and updates those sub-states using the provided reducer
 * @param  {Function}       reducer       Child reducer
 * @param  {Array<string>}  passActions   Action types to pass to the reducer
 * @param  {string}         removeAction  Action type to remove a key
 * @return {Function}                     Dictionary reducer
 */
export default function dictReducer (
  reducer: Function,
  passActions: Array<string>,
  removeAction: string
): Function {
  return (state: IState, action: any = {}): IState => {
    switch (action.type) {
      case undefined:
        return {}

      case removeAction:
        const key = action.key
        return {...state, [key]: null}

      default:
        if (passActions.indexOf(action.type) >= 0) {
          const key = action.key
          const value = state[key]
          return {
            ...state,
            [key]: reducer(value, action)
          }
        }
        return state
    }
  }
}
