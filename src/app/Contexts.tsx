import React, { ReactNode, createContext, useContext, useMemo, useState } from 'react';

type DrawerContextType = {
  isOpen: boolean;
  close: () => void;
  open: (content: any) => void;
  content: any;
};

const DrawerContext = createContext<undefined | DrawerContextType>(undefined);

export const DrawerContextProvider = ({ children }: { children: ReactNode }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState(null);

  const value = useMemo(() => {
    return {
      isOpen: drawerOpen,
      close: () => {
        setDrawerOpen(false);
        setDrawerContent(null);
      },
      open: (content: any) => {
        setDrawerOpen(true);
        setDrawerContent(content);
      },
      content: drawerContent,
    };
  }, [drawerOpen, drawerContent]);

  return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
};

export const useDrawer = () => {
  const context = useContext(DrawerContext);

  if (context === undefined) {
    throw new Error('useDrawer must be used within a DrawerContextProvider');
  }

  return context;
};
