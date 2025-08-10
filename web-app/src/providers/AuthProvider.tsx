import {
  type AuthorizedUserProfile,
  authServices,
} from "@app/services/auth.services"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

export interface AuthContextValue {
  user: AuthorizedUserProfile | null
  isAuthorized: boolean
  // setUser: (user: AuthorizedUserProfile | null) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthorizedUserProfile | null>(null)

  useEffect(() => {
    authServices
      .myProfile()
      .then((profile) => {
        if (profile?._id) {
          setUser(profile)
        }
      })
      .catch(() => {
        setUser(null)
      })
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthorized: Boolean(user),
      setUser,
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
