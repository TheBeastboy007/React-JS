import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Card from './Components/Card'

function App() {
  const [count, setCount] = useState(0)

  let myObj = {
    name: 'Hardik',
    age: 21
  }

  return (
    <>
      <h1 className='bg-green-400 text-black p-4 rounded-xl'>Tailwind Test</h1>
      <Card userName="Shubh Ravat" />
      <Card userName="Priyanshu Vaniya" />
    </>
  )
}

export default App
