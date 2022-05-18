import "react-toastify/dist/ReactToastify.css";
import AllRoutes from "./AllRoutes";
import { ToastContainer } from "react-toastify";
import Footer from "./components/miscellaneous/Footer";
import ToggleColorMode from "./ToggleColorMode";
import PageLoadProgress from "./PageLoadProgress";

function App() {
  return (
    <div>
      <ToggleColorMode>
        <AllRoutes />
        <PageLoadProgress />
        <Footer />
      </ToggleColorMode>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
