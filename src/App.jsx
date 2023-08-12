import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ChartComponent from './d3sankey'
import { data } from './d3sankey/Data'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <ChartComponent 
    
    data={data} width={1000} height={900}
    />
    </>
  )
}

export default App
