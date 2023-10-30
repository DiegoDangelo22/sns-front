import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home.tsx";
import Profile from "./components/Profile.tsx";
import { UserProvider } from "./UserContext.tsx";
import { ProtectedRoute } from "./ProtectedRoute.tsx";
import Chat from "./components/Chat.tsx";
import { SearchProvider } from "./SearchContext.tsx";
import SearchResults from "./components/SearchResults.tsx";
import Login from "./components/Login.tsx";
import Header from "./components/Header.tsx";
import { Navigate } from "react-router-dom";
import Error from "./components/Error.tsx";
import About from "./components/About.tsx";
import { AuthProvider } from "./AuthContext.tsx";
import { FriendshipProvider } from "./FriendshipsContext.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <div className="h-screen flex flex-col">
    <AuthProvider>
      <UserProvider>
        <Header/>
        <Error/>
      </UserProvider>
    </AuthProvider>
    </div>,
    children: [
      { path: "home", element: <div className='h-screen flex flex-col'>
        <ProtectedRoute>
          <UserProvider>
            <FriendshipProvider>
              <Header/>
              <Home/>
              <Chat/>
            </FriendshipProvider>
          </UserProvider>
        </ProtectedRoute>
      </div>},
      { path: "profile/:id", element: <div className='h-screen flex flex-col'>
        <ProtectedRoute>
          <UserProvider>
            <FriendshipProvider>
              <Header/>
              <Profile/>
              <Chat/>
            </FriendshipProvider>
          </UserProvider>
        </ProtectedRoute>
      </div>},
      { path: "about", element: <div className="h-screen flex flex-col">
        <Header/>
        <About/>
      </div> },
      { path: "login", element: <div className='h-screen flex flex-col'>
        <UserProvider>
          <ProtectedRoute>
            <Header/>
            <Login/>
          </ProtectedRoute>
        </UserProvider>
      </div>},
      { path: "search", element: <div className='h-screen flex flex-col'>
        <Header/>
        <SearchResults/>
      </div>},
      {path: "/",  element: <Navigate to="/home"/>}
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <UserProvider>
    <FriendshipProvider>
      <SearchProvider>
        <RouterProvider router={router} />
      </SearchProvider>
    </FriendshipProvider>
  </UserProvider>
  // </React.StrictMode>,
);
