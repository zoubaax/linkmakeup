import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [drawerUserId, setDrawerUserId] = useState(null);
  const [attentionItems, setAttentionItems] = useState([]);

  const openUserDrawer = useCallback((userId) => {
    if (userId) setDrawerUserId(userId);
  }, []);

  const closeUserDrawer = useCallback(() => {
    setDrawerUserId(null);
  }, []);

  const value = useMemo(() => ({
    drawerUserId,
    openUserDrawer,
    closeUserDrawer,
    attentionItems,
    setAttentionItems,
  }), [drawerUserId, openUserDrawer, closeUserDrawer, attentionItems]);

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error('useAdmin must be used inside AdminProvider');
  }
  return ctx;
}

export default AdminContext;
