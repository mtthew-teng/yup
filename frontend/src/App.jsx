import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Table from './pages/Table'
import Home from './pages/Home'
import Graph from './pages/Graph'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home/>}/>
          <Route path="table" element={<Table/>}/>
          <Route path="graph" element={<Graph/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
