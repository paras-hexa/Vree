import { observer } from "mobx-react-lite";
import { useStore } from "../stores/StoreContext";

const Header = observer(() => {
  const store = useStore();

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
      }}
    >
      {/* Logo */}
    <div style={{ fontSize: "23px", fontWeight: "bold" }}>
      <img src="./logo/logo.svg" alt="Logo" style={{ height: "40px" }} />
    </div>

      {/* Theme Toggle */}
      <button
        onClick={() =>
          store.setTheme(store.theme === "Dark" ? "Light" : "Dark")
        }
        style={{
          border: "none",
          borderRadius: "20px",
          padding: "8px 16px",
          cursor: "pointer",
          background: store.theme === "Dark" ? "#444" : "#ddd",
          color: store.theme === "Dark" ? "#fff" : "#000",
        }}
      >
        {store.theme === "Dark" ?<img src="./icons/moon.png"></img> :<img src="./icons/sun.png"></img>}
      </button>
    </header>
  );
});

export default Header;
