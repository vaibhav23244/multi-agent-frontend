import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChatInterface from "./components/ChatInterface";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto p-4">
        <ChatInterface />
      </div>
    </QueryClientProvider>
  );
}

export default App;
