import Checkbox from '@mui/material/Checkbox'
import React, {ChangeEvent, useEffect, useState} from 'react'
import {AddItemForm} from '../common/components/AddItemForm/AddItemForm'
import {EditableSpan} from '../common/components/EditableSpan/EditableSpan'
import axios from "axios";

export type Todolist = {
    id: string
    title: string
    addedDate: string
    order: number
}

export type Task = {
    description: string
    title: string
    status: number
    priority: number
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}

export type GetTasksResponse = {
    items: Task[]
    totalCount: number
    error: string | null
}

export type Response<T = {}> = {
    resultCode: number
    messages: string[]
    fieldsErrors: string[]
    data: T
}


export type UpdateTaskModel = {
    description: string
    title: string
    status: number
    priority: number
    startDate: string
    deadline: string
}

type Props = {}

export const AppHttpRequests = () => {
    const [todolists, setTodolists] = useState<Todolist[]>([])
    const [tasks, setTasks] = useState<{ [key: string]: Task[] }>({})

    useEffect(() => {
        axios.get<Todolist[]>('https://social-network.samuraijs.com/api/1.1/todo-lists', {
            headers: {
                Authorization: 'Bearer 50835b70-ebe5-4394-bb1a-2d5bf497237c'
            }
        }).then(res => {
            const todolists = res.data
            setTodolists([...todolists])
            todolists.forEach(tl => {
                axios.get<GetTasksResponse>(`https://social-network.samuraijs.com/api/1.1/todo-lists/${tl.id}/tasks`, {
                    headers: {
                        Authorization: 'Bearer 50835b70-ebe5-4394-bb1a-2d5bf497237c'
                    }
                }).then(res => {
                    console.log(res.data.items)
                    setTasks(tasks => ({...tasks, [tl.id]: res.data.items}))
                })
            })
        })
    }, [])

    const createTodolistHandler = (title: string) => {
        axios.post<Response<{ item: Todolist }>>('https://social-network.samuraijs.com/api/1.1/todo-lists',
            {title}, {
                headers: {
                    Authorization: 'Bearer 50835b70-ebe5-4394-bb1a-2d5bf497237c',
                    'API-KEY': 'b14f62b7-15b3-44b7-b136-d51136b643a4'
                }
            }).then(res => {
            const newTodolist = res.data.data.item
            setTodolists([newTodolist, ...todolists])
        })
    }

    const removeTodolistHandler = (id: string) => {
        axios.delete<Response>(`https://social-network.samuraijs.com/api/1.1/todo-lists/${id}`,
            {
                headers: {
                    Authorization: 'Bearer 50835b70-ebe5-4394-bb1a-2d5bf497237c',
                    'API-KEY': 'b14f62b7-15b3-44b7-b136-d51136b643a4'
                }
            }).then(res => {
            setTodolists(todolists.filter(tl => tl.id !== id))
        })
    }

    const updateTodolistHandler = (id: string, title: string) => {
        axios.put<Response>(`https://social-network.samuraijs.com/api/1.1/todo-lists/${id}`,
            {title}, {
                headers: {
                    Authorization: 'Bearer 50835b70-ebe5-4394-bb1a-2d5bf497237c',
                    'API-KEY': 'b14f62b7-15b3-44b7-b136-d51136b643a4'
                }
            }).then(res => {
            setTodolists(todolists.map(tl => tl.id === id ? {...tl, title} : tl))
        })
    }

    const createTaskHandler = (title: string, todolistId: string) => {
        axios.post<Response<{
            item: Task
        }>>(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistId}/tasks`,
            {title}, {
                headers: {
                    Authorization: 'Bearer 50835b70-ebe5-4394-bb1a-2d5bf497237c',
                    'API-KEY': 'b14f62b7-15b3-44b7-b136-d51136b643a4'
                }
            }).then(res => {
            const newTask = res.data.data.item
            setTasks({...tasks, [todolistId]: [newTask, ...tasks[todolistId] || []]})
        })
    }

    const removeTaskHandler = (taskId: string, todolistId: string) => {
        axios.delete<Response>(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistId}/tasks/${taskId}`, {
            headers: {
                Authorization: 'Bearer 50835b70-ebe5-4394-bb1a-2d5bf497237c',
                'API-KEY': 'b14f62b7-15b3-44b7-b136-d51136b643a4'
            }
        }).then(res => {
            console.log(res.data)
            setTasks({...tasks, [todolistId]: tasks[todolistId].filter(el => el.id !== taskId)})
        })
    }

    const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>, task: Task, todolistId: string) => {
        const model: UpdateTaskModel = {
            description: task.description,
            title: task.title,
            status: e.currentTarget.checked ? 2 : 0,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline
        }

        axios.put<Response<{
            item: Task
        }>>(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistId}/tasks/${task.id}`,
            model, {
                headers: {
                    Authorization: 'Bearer 50835b70-ebe5-4394-bb1a-2d5bf497237c',
                    'API-KEY': 'b14f62b7-15b3-44b7-b136-d51136b643a4'
                }
            }).then(res => {
            setTasks({
                ...tasks,
                [todolistId]: tasks[todolistId].map(t => t.id == task.id ? {...t, status: model.status} : t)
            })
        })
    }

    const changeTaskTitleHandler = (title: string, task: Task, todolistId: string) => {

        axios.put<Response>(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistId}/tasks/${task.id}/reorder`,
            {...task, title}, {
                headers: {
                    Authorization: 'Bearer 50835b70-ebe5-4394-bb1a-2d5bf497237c',
                    'API-KEY': 'b14f62b7-15b3-44b7-b136-d51136b643a4'
                }
            }
        ).then(res => {
            setTasks({...tasks, [todolistId] : tasks[todolistId].map(el => el.id === task.id ? {...el, title} : el)})
        })
    }

    return (
        <div style={{margin: '20px'}}>
            <AddItemForm addItem={createTodolistHandler}/>

            {/* Todolists */}
            {todolists.map(tl => {
                return (
                    <div key={tl.id} style={todolist}>
                        <div>
                            <EditableSpan
                                value={tl.title}
                                onChange={(title: string) => updateTodolistHandler(tl.id, title)}
                            />
                            <button onClick={() => removeTodolistHandler(tl.id)}>x</button>
                        </div>
                        <AddItemForm addItem={title => createTaskHandler(title, tl.id)}/>

                        {/* Tasks */}
                        {!!tasks[tl.id] &&
                            tasks[tl.id].map((task: Task) => {
                                return (
                                    <div key={task.id}>
                                        <Checkbox
                                            checked={task.status === 2}
                                            onChange={e => changeTaskStatusHandler(e, task, tl.id)}
                                        />
                                        <EditableSpan
                                            value={task.title}
                                            onChange={title => changeTaskTitleHandler(title, task, tl.id)}
                                        />
                                        <button onClick={() => removeTaskHandler(task.id, tl.id)}>x</button>
                                    </div>
                                )
                            })}
                    </div>
                )
            })}
        </div>
    )
}

// Styles
const todolist: React.CSSProperties = {
    border: '1px solid black',
    margin: '20px 0',
    padding: '10px',
    width: '300px',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
}