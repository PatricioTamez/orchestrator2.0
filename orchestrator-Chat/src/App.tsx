import ReactRouterBrowser from "./pages/routes";
import { AuthContextProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <AuthContextProvider>
      <ReactRouterBrowser />
      <Toaster />
    </AuthContextProvider>
  );
}

export default App;
