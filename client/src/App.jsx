import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import { Toaster} from 'react-hot-toast'
export default function App() {
  return (
    <>
    <Toaster/>
    <Routes>
        <Route path="/" element={<Home />} />
    </Routes>
    </>
  )
}