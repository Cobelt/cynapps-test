import "./App.scss"
import TaskComponent from "./components/Task"
import { useTasks } from "./hooks/useTasks"

function App() {
  const [taskList, taskFunctions, allTasks] = useTasks()
  const { name, tasks } = taskList ?? {}

  return (
    <div className="bg-light p-4 w-1/4 min-w-96 min-h-96 flex flex-col border-8 border-darkerpink rounded-xl relative">
      {name && <h2 className="mb-6">{name}</h2>}

      <div className="flex flex-col gap-4">
        {!!tasks?.length &&
          tasks?.map?.((uuid) => (
            <TaskComponent
              key={uuid}
              uuid={uuid}
              allTasks={allTasks}
              {...taskFunctions}
            />
          ))}
      </div>
    </div>
  )
}

export default App
