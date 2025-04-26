import { UserProvider as UserContextProvider } from "src/hooks/useUser";

export function UserProvider({ children }: { children: React.ReactNode }) {
  return <UserContextProvider>{children}</UserContextProvider>;
}
