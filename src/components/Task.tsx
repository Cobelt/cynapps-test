import { useState } from "react"
import {
  ChevronRightIcon,
  CheckIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
  ArrowUturnUpIcon,
} from "@heroicons/react/24/solid"
import type { TaskActions } from "../hooks/useTasks"
import type { TaskArray } from "../types/task"

interface TaskProps extends TaskActions {
  uuid: string
  allTasks: TaskArray // for refresh when updates
  setParenting(parent?: string): void
  setEditing(uuid?: string): void
  editing?: string
  parenting?: string
}

function TaskComponent({
  uuid,
  allTasks,
  setParenting,
  setEditing,
  editing,
  parenting,
  ...tasksFunctions
}: TaskProps) {
  const { completeTask, removeTask, reorderTask } = tasksFunctions
  const [expand, setExpand] = useState(false)
  const { subTasks = [], done = false, name = "" } = allTasks?.[uuid] ?? {}

  const isEditing = editing === uuid
  const isParent = parenting === uuid

  return (
    <div className="flex-1">
      <div className="flex gap-2 items-center">
        <div className="flex flex-col">
          <button
            className="p-0"
            type="button"
            onClick={() => reorderTask(uuid, -1)}
          >
            <ChevronUpIcon className="h-4 w-4 transition-transform" />
          </button>
          <button
            className="p-0"
            type="button"
            onClick={() => reorderTask(uuid, 1)}
          >
            <ChevronDownIcon className="h-4 w-4 transition-transform" />
          </button>
        </div>

        <div>
          <button
            className="w-3 h-3 border border-hotpink rounded-full p-0"
            onClick={() => completeTask(uuid, !done)}
          >
            {done && <CheckIcon className="w-3 h-3" />}
          </button>
        </div>

        <div className="flex-1 flex gap-2 items-center font-normal">
          <div
            className="flex-1 text-left cursor-pointer"
            onClick={() => setExpand(!expand)}
          >
            {name}
          </div>

          <button
            className="p-0"
            disabled={isEditing}
            onClick={() => setParenting(isParent ? undefined : uuid)}
          >
            <ArrowUturnUpIcon
              className={[
                "h-4 w-4 rotate-90",
                isParent && !isEditing && "text-hotpink",
                isEditing && "text-tiffanyblue",
              ]
                .filter(Boolean)
                .join(" ")}
            />
          </button>
          <button
            className="p-0"
            onClick={() => setEditing(isEditing ? undefined : uuid)}
          >
            <PencilIcon
              className={["h-4 w-4", isEditing && "text-hotpink"]
                .filter(Boolean)
                .join(" ")}
            />
          </button>
          <button
            className="p-0"
            onClick={() =>
              confirm("Supprimer cette tâche ?") && removeTask(uuid)
            }
          >
            <TrashIcon className="h-4 w-4 transition-transform" />
          </button>

          {!!subTasks?.length && (
            <div className="cursor-pointer" onClick={() => setExpand(!expand)}>
              <ChevronRightIcon
                className={[
                  "h-4 w-4 transition-transform",
                  expand && "rotate-90",
                ]
                  .filter(Boolean)
                  .join(" ")}
              />
            </div>
          )}
        </div>
      </div>
      {expand && !!subTasks?.length && (
        <div className="flex flex-col gap-2 pl-5 pt-2">
          {subTasks?.map?.((uuid) => (
            <TaskComponent
              key={uuid}
              uuid={uuid}
              allTasks={allTasks}
              setParenting={setParenting}
              setEditing={setEditing}
              parenting={parenting}
              editing={editing}
              {...tasksFunctions}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default TaskComponent
