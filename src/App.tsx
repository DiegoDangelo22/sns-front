import { Outlet } from 'react-router-dom'
import { AuthProvider } from './AuthContext.tsx'

const App = () => {
    return (
    <AuthProvider>
        <Outlet/>
    </AuthProvider>
    )
}
export default App