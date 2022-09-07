import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import mousetrap from 'mousetrap'

export const useLocalStorage = (key, initialValue) => {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key)
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // If error also return initialValue
      console.log(error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      // Save state
      setStoredValue(valueToStore)
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error)
    }
  }

  return [storedValue, setValue]
}

/**
 * Use mousetrap hook
 *
 * @param  {(string | string[])} handlerKey - A key, key combo or array of combos according to Mousetrap documentation.
 * @param  { function } handlerCallback - A function that is triggered on key combo catch.
 */
export const useMousetrap = (handlerKey, handlerCallback) => {
  const actionRef = useRef(null)
  actionRef.current = handlerCallback

  useEffect(() => {
    mousetrap.bind(handlerKey, (evt, combo) => {
      typeof actionRef.current === 'function' && actionRef.current(evt, combo)
      evt.preventDefault()
    })
    return () => {
      mousetrap.unbind(handlerKey)
    }
  }, [handlerKey])
}

export const useScript = (scriptUrl) => {
  useEffect(() => {
    const script = document.createElement('script')

    script.src = scriptUrl
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [scriptUrl])
}

export const useQuery = () => {
  return new URLSearchParams(useLocation().search)
}

export const useMedia = (queries, values, defaultValue) => {
  // Array containing a media query list for each query
  queries = queries ? queries : ['(max-width: 768px)', '(min-width: 768px)']
  const mediaQueryLists = queries.map((q) => window.matchMedia(q))

  // Function that gets value based on matching media query
  const getValue = () => {
    // Get index of first media query that matches
    const index = mediaQueryLists.findIndex((mql) => mql.matches)
    // Return related value or defaultValue if none
    return typeof values[index] !== 'undefined' ? values[index] : defaultValue
  }

  // State and setter for matched value
  const [value, setValue] = useState(getValue)

  useEffect(
    () => {
      // Event listener callback
      // Note: By defining getValue outside of useEffect we ensure that it has ...
      // ... current values of hook args (as this hook only runs on mount/dismount).
      const handler = () => setValue(getValue)
      // Set a listener for each media query with above handler as callback.
      mediaQueryLists.forEach((mql) => mql.addListener(handler))
      // Remove listeners on cleanup
      return () => mediaQueryLists.forEach((mql) => mql.removeListener(handler))
    },
    [] // Empty array ensures effect is only run on mount and unmount
  )

  return value
}
