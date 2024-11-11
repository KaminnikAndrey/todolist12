import {combineReducers, legacy_createStore} from 'redux'
import {tasksReducer} from "../features/todolists/model/tasks-reducer";
import {todolistsReducer} from "../features/todolists/model/todolists-reducer";
import {appReducer} from "./app-reducer";

const rootReducer = combineReducers({
	tasks: tasksReducer,
	todolists: todolistsReducer,
	app: appReducer,
})

export const store = legacy_createStore(rootReducer)

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

// @ts-ignore
window.store = store

