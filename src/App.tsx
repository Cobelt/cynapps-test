import { useEffect, useRef, useState } from "react"
import "./App.scss"
import TaskComponent from "./components/Task"
import { useTasks } from "./hooks/useTasks"
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  EyeIcon,
  EyeSlashIcon,
  PlusIcon,
} from "@heroicons/react/24/solid"

function App() {
  const [taskList, taskFunctions, allTasks] = useTasks()
  const { createTask, updateTask, uploadJSON, downloadJSON } = taskFunctions
  const { name: listName, tasks } = taskList ?? {}

  const [name, setName] = useState<string>("")
  const [parenting, setParenting] = useState<string>()
  const [editing, setEditing] = useState<string>()
  const [hideCompleted, setHideCompleted] = useState(false)

  const uploadInputRef = useRef<HTMLInputElement>(null)

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

  function uploadFile(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      const files = event.target.files
      if (!files?.length) {
        return alert("Veuillez choisir un fichier")
      }
      const file = files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        uploadJSON(e?.target?.result)
      }
      reader.readAsText(file)
    } catch (err) {
      console.error(err)
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

  const EyeTag = hideCompleted ? EyeSlashIcon : EyeIcon

  return (
    <div className="bg-light p-4 w-1/4 min-w-96 min-h-96 flex flex-col border-8 border-darkerpink rounded-xl relative">
      <div className="absolute top-0 left-0 flex">
        <div className="p-2">
          <ArrowDownTrayIcon className="w-5 h-5" onClick={downloadJSON} />
        </div>
        <div className="p-2 cursor-pointer">
          <input
            ref={uploadInputRef}
            onChange={uploadFile}
            id="uploadJson"
            title="upload json"
            type="file"
            accept="application/json"
            className="hidden"
          />
          <ArrowUpTrayIcon
            className="w-5 h-5 cursor-pointer"
            onClick={() => uploadInputRef.current?.click()}
          />
        </div>
        <div className="p-2">
          <EyeTag
            className="w-5 h-5 cursor-pointer"
            onClick={() => setHideCompleted(!hideCompleted)}
          />
        </div>
      </div>

      {listName && <h2 className="mb-6">{listName}</h2>}
      <div className="flex flex-col gap-4">
        {!!tasks?.length &&
          tasks?.map((uuid) => (
            <TaskComponent
              key={uuid}
              uuid={uuid}
              allTasks={allTasks}
              setParenting={setParenting}
              setEditing={setEditing}
              parenting={parenting}
              editing={editing}
              hideCompleted={hideCompleted}
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
