'use client';

import React, {
  createContext,
  forwardRef,
  useContext,
  useMemo,
  useState,
} from 'react';
import { storeFactory } from 'clutch';
import { useStore, createStore, StoreApi } from 'zustand';

type TClutchComponentContext = {
  componentStore: StoreApi<unknown>;
  rootInstances: string[];
};

export const ClutchComponentContext = createContext<TClutchComponentContext>({
  componentStore: null,
  rootInstances: [],
});

export const useClutchComponentContext = () => {
  return useContext(ClutchComponentContext);
};

function createClutchComponentStore() {
  return createStore((set) => storeFactory(set));
}

export const useClutchComponentStore = (selector: (state: any) => any) => {
  const { componentStore } = useClutchComponentContext();

  if (!componentStore) {
    return null;
  }

  return useStore(componentStore, selector);
};

export const ClutchComponentContextProvider = forwardRef(
  ({ instanceId, children }: {
    instanceId: string;
    children: React.ReactNode;
  }, ref) => {
    const context = useClutchComponentContext();

    const [componentStore] = useState(createClutchComponentStore);

    const updatedContextValue = useMemo(() => {
      const rootInstances = [...(context.rootInstances || [])];

      rootInstances.push(instanceId);

      return {
        rootInstances,
        componentStore,
      };
    }, [
      instanceId,
      componentStore,
      context?.rootInstances,
    ]);

    return (
      <ClutchComponentContext.Provider value={updatedContextValue}>
        {children}
      </ClutchComponentContext.Provider>
    );
  }
);

