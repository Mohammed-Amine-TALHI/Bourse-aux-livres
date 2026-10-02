import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import http, { setUnauthorizedHandler, tokenStore } from "../api/http";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // "loading" until we know whether the stored token is still valid.
  const [loading, setLoading] = useState(Boolean(tokenStore.get()));
  const [wishIds, setWishIds] = useState([]);

  const clearSession = useCallback(() => {
    tokenStore.clear();
    setUser(null);
    setWishIds([]);
  }, []);

  const loadWishlist = useCallback(async () => {
    try {
      const { data } = await http.get("/wishlist");
      setWishIds(data.books.map((book) => book.id));
    } catch {
      setWishIds([]);
    }
  }, []);

  const startSession = useCallback(
    (data) => {
      tokenStore.set(data.access_token);
      setUser(data.user);
      loadWishlist();
    },
    [loadWishlist]
  );

  useEffect(() => {
    setUnauthorizedHandler(clearSession);

    if (!tokenStore.get()) return;

    http
      .get("/me")
      .then(({ data }) => {
        setUser(data);
        loadWishlist();
      })
      .catch(clearSession)
      .finally(() => setLoading(false));
  }, [clearSession, loadWishlist]);

  const login = useCallback(
    async (credentials) => {
      const { data } = await http.post("/login", credentials, { skipAuthRedirect: true });
      startSession(data);
      return data.user;
    },
    [startSession]
  );

  const register = useCallback(
    async (payload) => {
      const { data } = await http.post("/register", payload);
      startSession(data);
      return data.user;
    },
    [startSession]
  );

  const logout = useCallback(async () => {
    try {
      await http.post("/logout", null, { skipAuthRedirect: true });
    } catch {
      // The token may already be expired; the local session is cleared either way.
    }
    clearSession();
  }, [clearSession]);

  const toggleWish = useCallback(
    async (bookId) => {
      const saved = wishIds.includes(bookId);
      if (saved) {
        await http.delete(`/wishlist/${bookId}`);
        setWishIds((ids) => ids.filter((id) => id !== bookId));
      } else {
        await http.post("/wishlist", { book_id: bookId });
        setWishIds((ids) => [...ids, bookId]);
      }
      return !saved;
    },
    [wishIds]
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin: user?.role === "admin",
      wishIds,
      login,
      register,
      logout,
      setUser,
      toggleWish,
    }),
    [user, loading, wishIds, login, register, logout, toggleWish]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
