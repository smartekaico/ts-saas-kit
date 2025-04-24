import { UserProvider as UserContextProvider } from "../hooks/useUser";

export function UserProvider({ children }: { children: React.ReactNode }) {
  return <UserContextProvider>{children}</UserContextProvider>;
}
