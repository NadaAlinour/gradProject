import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NotFound from "./pages/PageNotFound";
import Login from "./pages/Login";
import AppRoutes from "./pages/router/AppRoutes";
import { useContext } from "react";
import { useState } from "react";
import "./App.css";
import "/src/assets/stylesheets/home.css";
import "/src/assets/stylesheets/recipe.css";
import "/src/assets/stylesheets/product.css";
import { AuthContext } from "./context/AuthContext";

function App() {
  const [authUser, setAuthUser] = useState(localStorage.getItem("user"));

  return (
    <>
      <AuthContext.Provider value={{ authUser, setAuthUser }}>
        <div className="content-container">
          <Navbar />
          <AppRoutes />
          <Footer />
        </div>
      </AuthContext.Provider>
    </>
  );
}

export default App;
