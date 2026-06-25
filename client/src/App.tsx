import { router } from './app/Router'
import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from './utils/widgets/toast/ToastContainer'

function App() {

  return (
    <>
      <RouterProvider router={router} />
       <ToastContainer />
    </>
  )
}

export default App