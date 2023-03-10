import {v1} from 'uuid';
import {todolistsAPI, TodolistType} from '../api/todolists-api'
import {AnyAction, Dispatch} from "redux";

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST',
    id: string
}
export type AddTodolistActionType = {
    type: 'ADD-TODOLIST',
    todolist: TodolistType
}
export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE',
    id: string
    title: string
}
export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER',
    id: string
    filter: FilterValuesType
}

type ActionsType = RemoveTodolistActionType | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType | setTodosActionType

const initialState: Array<TodolistDomainType> = [
    // {id: "todolistId1", title: 'What to learn', filter: 'all', addedDate: '', order: 0},
    // {id: "todolistId2", title: 'What to buy', filter: 'all', addedDate: '', order: 0}
]

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case "SET-TODOS": {
            // const newStateFromData=action.todos.map(el => ({
            //     ...el, filter: 'all' as FilterValuesType
            // }))
            // return [...state, ...newStateFromData]
            return action.todos.map(el => ({...el, filter: 'all'}))
        }
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            // return [action.todolist, ...state]
            const copyState = [...state]
            const newTodolistFromData = action.todolist
            const newTodolist: TodolistDomainType = {...newTodolistFromData, filter: 'all'}
            return [newTodolist, ...copyState]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            // const todolist = state.find(tl => tl.id === action.id);
            // if (todolist) {
            //     // ???????? ?????????????? - ?????????????? ?????? ??????????????????
            //     todolist.title = action.title;
            // }
            // return [...state]
            return state.map(el => el.id === action.id ? {...el, title: action.title} : el)
        }
        case 'CHANGE-TODOLIST-FILTER': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                // ???????? ?????????????? - ?????????????? ?????? ??????????????????
                todolist.filter = action.filter;
            }
            return [...state]
        }
        default:
            return state;
    }
}

export const removeTodolistAC = (todolistId: string): RemoveTodolistActionType => {
    return {type: 'REMOVE-TODOLIST', id: todolistId}
}
export const addTodolistAC = (todolist: TodolistType): AddTodolistActionType => {
    return {type: 'ADD-TODOLIST', todolist}
}
export const changeTodolistTitleAC = (id: string, title: string): ChangeTodolistTitleActionType => {
    return {type: 'CHANGE-TODOLIST-TITLE', id: id, title: title}
}
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType): ChangeTodolistFilterActionType => {
    return {type: 'CHANGE-TODOLIST-FILTER', id: id, filter: filter}
}

export const setTodosAC = (todos: TodolistType[]) => {
    return {
        type: 'SET-TODOS', todos
    } as const
}

export type setTodosActionType = ReturnType<typeof setTodosAC>

// export const getTodoThunk=(dispatch:Dispatch)=>{
//     todolistsAPI.getTodolists()
//         .then((res)=>{
//             dispatch(setTodosAC(res.data))
//         })
// }
export const getTodoTC = () => (dispatch: Dispatch) => {
    todolistsAPI.getTodolists()
        .then((res) => {
            dispatch(setTodosAC(res.data))
        })
}
export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
    todolistsAPI.deleteTodolist(todolistId)
        .then((res) => {
            dispatch(removeTodolistAC(todolistId))
        })
}
export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
    todolistsAPI.createTodolist(title)
        .then((res) => {
            dispatch(addTodolistAC(res.data.data.item))
        })
}
export const changeTodolistTitleTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    todolistsAPI.updateTodolist(todolistId, title)
        .then((res) => {
            dispatch(changeTodolistTitleAC(todolistId, title))
        })
}

