import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import "./index.css";
import DashboardSelector from "./pages/DashboardSelector";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <div className="container mx-auto px-4 py-4">
        <DashboardSelector />
      </div>
      <Footer />
    </div>
  );
}

export default App;
