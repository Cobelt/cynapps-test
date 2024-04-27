import { useEffect, useState } from "react"
import "./App.scss"
import TaskComponent from "./components/Task"
import { useTasks } from "./hooks/useTasks"
import { PlusIcon } from "@heroicons/react/24/solid"

function App() {
  const [taskList, taskFunctions, allTasks] = useTasks()
  const { createTask, updateTask } = taskFunctions
  const { name: listName, tasks } = taskList ?? {}
  const [name, setName] = useState<string>("")
  const [parenting, setParenting] = useState<string>()
  const [editing, setEditing] = useState<string>()

  function submit() {
    if (name) {
      const editingTask = allTasks?.[editing ?? ""]
      if (editing && editingTask) {
        updateTask(editing, {
          ...editingTask,
          name: name ?? editingTask?.name,
          parent: parenting,
        })
      } else {
        createTask(name, parenting)
      }
      setName("")
      setParenting(undefined)
      setEditing(undefined)
    }
  }

  useEffect(() => {
    if (editing) {
      const editingTask = allTasks?.[editing]
      if (editingTask) {
        setName(editingTask?.name)
        setParenting(editingTask?.parent)
      }
    }
  }, [editing])

  return (
    <div className="bg-light p-4 w-1/4 min-w-96 min-h-96 flex flex-col border-8 border-darkerpink rounded-xl relative">
      {listName && <h2 className="mb-6">{listName}</h2>}
      <div className="flex flex-col gap-4">
        {!!tasks?.length &&
          tasks?.map?.((uuid) => (
            <TaskComponent
              key={uuid}
              uuid={uuid}
              allTasks={allTasks}
              setParenting={setParenting}
              setEditing={setEditing}
              parenting={parenting}
              editing={editing}
              {...taskFunctions}
            />
          ))}
      </div>

      <div className="flex-1" />
      <div className="flex">
        <input
          type="text"
          name="name"
          id="name"
          className="flex-1 bg-light border-b-2 border-darkerpink"
          onChange={(e) => setName(e.target.value)}
          placeholder="Que dois-je faire ?"
          value={name}
        />

        <button
          className="ml-2 p-1 border-2 border-darkerpink rounded-xl"
          type="submit"
          onClick={submit}
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export default App
