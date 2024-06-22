import { LoadingProvider } from "./contexts/LoadingContext/index.jsx";
import { Spinner } from "./components/Spinner/index.jsx";

function App() {
  return (
    <LoadingProvider>
      <Spinner />
    </LoadingProvider>
  );
}

export default App;
