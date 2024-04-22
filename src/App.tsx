import "./App.scss"
import { useTasks } from "./hooks/useTasks"
import { CheckIcon } from "@heroicons/react/24/solid"

function App() {
  const [taskList] = useTasks()
  const { name, tasks } = taskList ?? {}

  return (
    <div className="bg-light p-4 w-1/4 min-w-96 min-h-96 flex flex-col border-8 border-darkerpink rounded-xl relative">
      {name && <h2 className="mb-6">{name}</h2>}

      <div className="flex flex-col gap-4">
        {!!tasks?.length &&
          tasks?.map?.((task) => (
            <div className="flex gap-2">
              <div>
                <button
                  className="w-5 h-5 border border-hotpink rounded-full p-0"
                  onClick={() => console.log("should put to done")}
                >
                  {task?.done && <CheckIcon className="w-5 h-5" />}
                </button>
              </div>

              <div>{task?.name}</div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default App
