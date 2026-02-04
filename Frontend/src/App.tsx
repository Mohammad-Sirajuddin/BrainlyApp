import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home";
import { SignUpPage } from "./pages/SignUp";
import { SignInPage } from "./pages/SignIn";
import { SharedCollection } from "./pages/SharedCollection";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" replace />}></Route>
        <Route path="/signup" element={<SignUpPage />}></Route>
        <Route path="/signin" element={<SignInPage />}></Route>
        <Route path="/Home" element={<Home />}></Route>
        <Route
          path="/shared/:shareToken"
          element={<SharedCollection />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
