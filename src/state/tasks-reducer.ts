import {TasksStateType} from '../App';
import {v1} from 'uuid';
import {AddTodolistActionType, RemoveTodolistActionType, setTodosActionType} from './todolists-reducer';
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from '../api/todolists-api'
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";

export type RemoveTaskActionType = {
    type: 'REMOVE-TASK',
    todolistId: string
    taskId: string
}

export type AddTaskActionType = {
    type: 'ADD-TASK',
    task:TaskType,
    todolistId: string

}

export type ChangeTaskStatusActionType = {
    type: 'CHANGE-TASK-STATUS',
    todolistId: string
    taskId: string
    status: TaskStatuses
}

export type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE',
    todolistId: string
    taskId: string
    title: string
}

type ActionsType = RemoveTaskActionType | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType | setTodosActionType | getTaskActionType

const initialState: TasksStateType = {
    /*"todolistId1": [
        { id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ],
    "todolistId2": [
        { id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ]*/

}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case "SET-TODOS": {
            const stateCopy = {...state}
            action.todos.forEach(el => {
                stateCopy[el.id] = []
            })
            return stateCopy
        }
        case "GET-TASK": {
            return {
                ...state, [action.todolistId]: action.tasks
            }
        }
        case 'REMOVE-TASK': {
            const stateCopy = {...state}
            const tasks = stateCopy[action.todolistId];
            const newTasks = tasks.filter(t => t.id !== action.taskId);
            stateCopy[action.todolistId] = newTasks;
            return stateCopy;
        }
        case 'ADD-TASK': {
            // const stateCopy = {...state}
            // const newTask: TaskType = {
            //     id: v1(),
            //     title: action.title,
            //     status: TaskStatuses.New,
            //     todoListId: action.todolistId, description: '',
            //     startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
            // }
            // const tasks = stateCopy[action.todolistId];
            // const newTasks = [newTask, ...tasks];
            // stateCopy[action.todolistId] = newTasks;
            // return stateCopy;
            return {
                ...state, [action.todolistId]:[...state[action.todolistId],action.task]
            }
        }
        case 'CHANGE-TASK-STATUS': {
            let todolistTasks = state[action.todolistId];
            let newTasksArray = todolistTasks
                .map(t => t.id === action.taskId ? {...t, status: action.status} : t);

            state[action.todolistId] = newTasksArray;
            return ({...state});
        }
        case 'CHANGE-TASK-TITLE': {
            // let todolistTasks = state[action.todolistId];
            // // найдём нужную таску:
            // let newTasksArray = todolistTasks
            //     .map(t => t.id === action.taskId ? {...t, title: action.title} : t);
            //
            // state[action.todolistId] = newTasksArray;
            // return ({...state});
            return {...state,[action.todolistId]:state[action.todolistId].map(el=>el.id===action.taskId?{...el,title:action.title}:el)}
        }
        case 'ADD-TODOLIST': {
            return {
                ...state,
                [action.todolist.id]: []
            }
        }
        case 'REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        }
        default:
            return state;
    }
}

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
    return {type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId}
}
export const addTaskAC = (task: TaskType, todolistId: string): AddTaskActionType => {
    return {type: 'ADD-TASK', task, todolistId}
}
export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string): ChangeTaskStatusActionType => {
    return {type: 'CHANGE-TASK-STATUS', status, todolistId, taskId}
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string): ChangeTaskTitleActionType => {
    return {type: 'CHANGE-TASK-TITLE', title, todolistId, taskId}
}

type getTaskActionType = ReturnType<typeof getTaskAC>
export const getTaskAC = (todolistId: string, tasks: TaskType[]) => {
    return {
        type: "GET-TASK", todolistId, tasks
    } as const
}

export const getTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    todolistsAPI.getTasks(todolistId)
        .then((res) => {
            dispatch(getTaskAC(todolistId, res.data.items))
        })
}

export const removeTaskTC=(todolistId:string,taskId:string)=>(dispatch:Dispatch)=>{
    todolistsAPI.deleteTask(todolistId,taskId)
        .then((res)=>{
            dispatch(removeTaskAC(taskId,todolistId))
        })
}
export const addTaskTC=(todolistId:string,title:string)=>(dispatch:Dispatch)=>{
    todolistsAPI.createTask(todolistId,title)
        .then((res)=>{
            dispatch(addTaskAC(res.data.data.item,todolistId))
        })
}

export const updateTaskStatusTC=(todolistId:string,taskId:string,status:TaskStatuses)=>(dispatch:Dispatch,getState:()=>AppRootStateType)=>{
    const currentTask=getState().tasks[todolistId].find(el=>el.id===taskId)
    const state=getState()
    const allTasks=state.tasks
    const tasksForTodo=allTasks[todolistId]
    const _currentTask=tasksForTodo.find(el=>el.id===taskId)

    if (currentTask){
        const model:UpdateTaskModelType={
            title: currentTask.title,
            deadline: currentTask.deadline,
            description: currentTask.description,
            status: status,
            priority: currentTask.priority,
            startDate: currentTask.startDate,
        }
        todolistsAPI.updateTask(todolistId,taskId,model)
            .then((res)=>{
                dispatch(changeTaskStatusAC(taskId,status,todolistId))
            })
    }

}

export const changeTaskTitleTC=(todolistId:string,taskId:string,title:string)=>(dispatch:Dispatch,getState:()=>AppRootStateType)=>{
    const changedTask=getState().tasks[todolistId].find(el=>el.id===taskId)

    if(changedTask){
        const model:UpdateTaskModelType={
            title:title,
            status:changedTask.status,
            priority:changedTask.priority,
            startDate:changedTask.startDate,
            deadline:changedTask.deadline,
            description:changedTask.description
        }
        todolistsAPI.updateTask(todolistId,taskId,model)
            .then((res)=>{
                dispatch(changeTaskTitleAC(taskId,res.data.data.item.title,todolistId))
            })
    }


}
