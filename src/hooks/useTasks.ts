import { Task, TaskArray, TaskList } from "../types/task"
import { useState } from "react"
import { v4 as uuidv4 } from "uuid"

const UUID_1 = uuidv4()
const UUID_2 = uuidv4()
const UUID_3 = uuidv4()
const UUID_4 = uuidv4()
const NOW = Date.now()

const DEFAULT_TASKS = {
  [UUID_1]: {
    uuid: UUID_1,
    createdAt: NOW,
    done: false,
    name: "Faire la vaisselle",
  },
  [UUID_2]: {
    uuid: UUID_2,
    createdAt: NOW,
    done: false,
    name: "Test technique",
  },
  [UUID_3]: {
    uuid: UUID_3,
    createdAt: NOW,
    done: false,
    name: "Manger !",
  },
  [UUID_4]: {
    uuid: UUID_4,
    createdAt: NOW,
    done: false,
    name: "Quatro !",
  },
}
export const DEFAULT_TASK_LIST: TaskList = {
  name: "To do Today",
  tasks: Object.keys(DEFAULT_TASKS),
}

export interface TaskActions {
  createTask(name: string, parent?: string): void
  completeTask(uuid: string, done?: boolean): void
  removeTask(uuid: string): void
  reorderTask(uuid: string, indexChange: number): void
  updateTask(uuid: string, newValue: Task): void
}

export const useTasks = (): [TaskList, TaskActions, TaskArray] => {
  const [taskList, setTaskList] = useState<TaskList>(DEFAULT_TASK_LIST)
  const [allTasks, setAllTasks] = useState<TaskArray>(DEFAULT_TASKS)

  function createTask(name: string, parent?: string): void {
    const newTask: Task = {
      uuid: uuidv4(),
      createdAt: Date.now(),
      done: false,
      name,
      parent,
    }

    setAllTasks((tasks) => {
      return { ...(tasks ?? []), [newTask?.uuid]: newTask }
    })

    if (parent) {
      const parentTask = allTasks[parent]

      if (parentTask) {
        updateTask(parent, {
          ...parentTask,
          subTasks: [...(parentTask?.subTasks ?? []), newTask.uuid],
        })
      }
    } else {
      setTaskList((taskList) => {
        return { ...taskList, tasks: [...taskList.tasks, newTask?.uuid] }
      })
    }
  }

  function updateTask(toUpdate: string, newValue: Task) {
    if (toUpdate) {
      const toUpdateTask = allTasks[toUpdate]
      if (toUpdateTask) {
        setAllTasks((tasks) => ({ ...tasks, [toUpdate]: newValue }))

        if (toUpdateTask?.parent !== newValue?.parent) {
          if (toUpdateTask?.parent) {
            removeTaskInParent(toUpdate, toUpdateTask?.parent)
          } else {
            setTaskList((list) => ({
              ...list,
              tasks: list.tasks.filter((taskUuid) => taskUuid !== toUpdate),
            }))
          }

          if (newValue?.parent) {
            const parent = allTasks[newValue?.parent]
            if (parent) {
              const newSubTasks = addAtIndex(
                parent?.subTasks ?? [],
                toUpdate,
                parent?.subTasks?.length ?? 0
              )
              updateTask(newValue?.parent, {
                ...parent,
                subTasks: newSubTasks,
              })
            }
          }
        }
      }
    }
  }

  function completeTask(uuid: string, done?: boolean): void {
    const task = allTasks[uuid]
    if (task) {
      const isCompleted = done ?? true
      updateTask(uuid, {
        ...task,
        done: isCompleted,
        completedAt: isCompleted ? Date.now() : task.completedAt,
      })
    }
  }

  function removeTaskInParent(uuid: string, parentUuid: string): void {
    const parent = allTasks[parentUuid]

    updateTask(parentUuid, {
      ...parent,
      subTasks:
        parent?.subTasks?.filter?.((taskUuid) => taskUuid !== uuid) ?? [],
    })
  }

  function removeTask(uuid: string): void {
    const toRemove = allTasks[uuid]

    if (toRemove?.parent) {
      removeTaskInParent(uuid, toRemove.parent)
    } else {
      setTaskList((list) => ({
        ...list,
        tasks: list.tasks.filter((taskUuid) => taskUuid !== uuid),
      }))
    }

    setAllTasks((tasks) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [uuid]: _, ...rest } = tasks
      return rest
    })
  }

  function addAtIndex(tasks: string[], uuid: string, index: number): string[] {
    const subTasksPart1 = tasks.slice(0, index)
    const subTasksPart2 = tasks.slice(index)

    return [subTasksPart1, uuid, subTasksPart2].flat()
  }

  function reorderTask(uuid: string, indexChange: number): void {
    const toReorder = allTasks[uuid]
    if (toReorder?.parent) {
      const parent = allTasks[toReorder.parent]
      if (parent) {
        const currentIndex =
          parent?.subTasks?.findIndex((taskUuid) => taskUuid === uuid) ?? 0
        const newIndex = currentIndex + indexChange

        if (parent?.subTasks?.length) {
          const newSubTasks = addAtIndex(
            parent?.subTasks?.filter?.((taskUuid) => taskUuid !== uuid),
            uuid,
            newIndex
          )

          updateTask(toReorder.parent, {
            ...parent,
            subTasks: newSubTasks,
          })
        } else {
          // could be refactored ?
          updateTask(toReorder.parent, {
            ...parent,
            subTasks: [uuid],
          })
        }
      }
    } else {
      const currentIndex =
        taskList?.tasks?.findIndex((taskUuid) => taskUuid === uuid) ?? 0
      const newIndex = currentIndex + indexChange

      const newTasks = addAtIndex(
        taskList?.tasks?.filter?.((taskUuid) => taskUuid !== uuid),
        uuid,
        newIndex
      )

      setTaskList((list) => ({
        ...list,
        tasks: newTasks,
      }))
    }
  }

  return [
    taskList,
    {
      createTask,
      completeTask,
      removeTask,
      reorderTask,
      updateTask,
    },
    allTasks,
  ]
}
