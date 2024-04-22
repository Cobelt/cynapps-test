import { useState } from "react"

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T) => void, () => void] => {
  // Initialize state with the value from localStorage, if it exists
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : initialValue
  })

  // Update the localStorage value and the state
  const setValue = (value: T): void => {
    setStoredValue(value)
    window.localStorage.setItem(key, JSON.stringify(value))
  }

  // Delete the localStorage value and reset the state to the initial value
  const clearValue = (): void => {
    setStoredValue(initialValue)
    window.localStorage.removeItem(key)
  }

  return [storedValue, setValue, clearValue]
}
