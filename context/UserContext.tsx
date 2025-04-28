"use client";

import { createContext, useContext } from "react";

export type UserType = {
  name?: string;
  email?: string;
  image?: string;
} | undefined;

const UserContext = createContext<UserType>(undefined);

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export function UserProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: UserType;
}) {
  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
}
