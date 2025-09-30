import Header from "./Components/Header";
import ModelViewer from "./Components/ModelViewers";
import Sidebar from "./Components/Sidebar";
import { observer } from "mobx-react-lite";
import { useStore } from "./stores/StoreContext";
import './App.css'
const App = observer(() => {
const store = useStore()
    const isDark = (store.theme ?? "").toString().toLowerCase() === "dark";


  return (
    <div  style={{ display: "flex", flexDirection: "column", height: "100vh" , backgroundImage: isDark ? "url('./background/background.png')" : "url('./background/whitebg.jpg')" , backgroundSize:"cover" , backgroundRepeat:"no-repeat" }} className="bg-c hide-scrollbar">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div style={{ display: "flex",  flex: 3 ,}} className="hide-scrollbar overflow-hidden" >
        {/* Left: Model */}
        <ModelViewer />

        {/* Right: Sidebar */}
        <Sidebar />
      </div>
    </div>
  );
});

export default App;
