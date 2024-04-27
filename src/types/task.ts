export interface Task {
  uuid: string
  name: string
  done: boolean
  createdAt: number
  completedAt?: number
  subTasks?: string[]
  parent?: string
}

export interface TaskList {
  name: string
  tasks: string[]
}

export interface TaskArray {
  [uuid: string]: Task
}
