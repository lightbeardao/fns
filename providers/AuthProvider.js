import { createContext, useContext } from "react";

import LoginScreen from "../components/LoginScreen";
import useCurrentUser from "../hooks/use-current-user.hook";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, loggedIn, tools] = useCurrentUser();

  if (!user || !loggedIn)
    return <LoginScreen loginFn={tools.logIn}></LoginScreen>;

  return (
    <AuthContext.Provider
      value={{
        user,
        loggedIn,
        ...tools,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
