import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const useUser = () => {
  const {
    isAuthenticated,
    user,
    signIn,
    signOut,
    setUser 
  } = useContext(AuthContext);
  
  return {
    isAuthenticated,
    user,
    signIn,
    signOut,
    setUser 
  }
}