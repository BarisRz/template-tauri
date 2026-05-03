import "./App.css";
import TitleBar from "./components/TitleBar";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <main className="bg-mainbg h-screen w-full">
      <TitleBar />
      <Outlet />
    </main>
  );
}

export default App;
