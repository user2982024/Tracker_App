import { Toaster } from "react-hot-toast";
import AuthForm from "./components/Auth/AuthForm";

const App = () => {
  return (
    <>
      <Toaster position="top-right" />
      <AuthForm />
    </>
  );
};

export default App;
