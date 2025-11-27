import { AppProvider } from "./Provider";
import { AppRouter } from "./Router";

const App = () => (
  <AppProvider>
    <AppRouter />
  </AppProvider>
);

export default App;
