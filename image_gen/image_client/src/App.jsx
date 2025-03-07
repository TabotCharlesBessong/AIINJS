import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex w-[100vw] h-[100vh] bg-red-500">
        <p className="text-3xl text-white">
          Hello world!
        </p>
      </div>
    </>
  )
}

export default App
