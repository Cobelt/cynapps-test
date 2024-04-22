import { Task, TaskList } from "../types/task"
import { useLocalStorage } from "./useLocalStorage"

const now = Date.now()

const KEY = "TASK_LIST"
const DEFAULT_TASKS = [
  {
    done: false,
    name: "Faire la vaisselle",
    createdAt: now,
    updatedAt: now,
  },
  {
    done: false,
    name: "Test technique",
    createdAt: now,
    updatedAt: now,
  },
  { done: true, name: "Manger !", createdAt: now, updatedAt: now },
]

const DEFAULT_TASK_LIST: TaskList = {
  name: "To do Today",
  tasks: DEFAULT_TASKS,
}

export const useTasks = (): [TaskList, (newTask: Task) => TaskList] => {
  const [tasklist, setValue] = useLocalStorage<TaskList>(KEY, DEFAULT_TASK_LIST)

  const addTask = (newTask: Task): TaskList => {
    const newTaskList = {
      ...tasklist,
      tasks: [...(tasklist?.tasks ?? []), newTask],
    }
    setValue(newTaskList)
    return newTaskList
  }

  return [tasklist, addTask]
}
