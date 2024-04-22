export interface Task {
  name: string
  done: boolean
  createdAt: number
  updatedAt: number
  completedAt?: number
  subTasks?: Task[]
  parent?: Task
}

export interface TaskList {
  name: string
  tasks: Task[]
}
