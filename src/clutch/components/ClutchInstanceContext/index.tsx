'use client';

import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useEffect,
  useState,
} from 'react';
 import { useStore, createStore, StoreApi } from 'zustand';
import {
  useClutchComponentContext,
  useClutchStore,
  useClutchComponentStore,
  cloneChildren,
  storeFactory,
  useDeepEqual,
  TClutchStore,
} from 'clutch';

type TClutchInstanceContext = {
  instanceStore: StoreApi<unknown>;
  instanceId: string;
  serializedId: string;
  component: React.FunctionComponent;
  parentInstanceContext?: TClutchInstanceContext;
};

const ClutchInstanceContext = createContext<TClutchInstanceContext>({
  instanceStore: null,
  instanceId: '',
  serializedId: '',
  component: null,
  parentInstanceContext: null,
});

export const useRegisterAction = <T extends Function>(
  actionName: string,
  action: T,
) => {
 const clutchStore: Partial<TClutchStore> = useClutchStore(useDeepEqual((state) => ({
    registerAction: state.registerAction,
    unregisterAction: state.unregisterAction,
  })));

  const clutchComponentStore: Partial<TClutchStore> = useClutchComponentStore(useDeepEqual((state) => ({
    registerAction: state.registerAction,
    unregisterAction: state.unregisterAction,
  })));

  const clutchInstanceStore: Partial<TClutchStore> = useClutchInstanceStore(useDeepEqual((state) => ({
    registerAction: state.registerAction,
    unregisterAction: state.unregisterAction,
  })));

  const clutchInstanceContext = useContext(ClutchInstanceContext);

  useEffect(() => {
    clutchInstanceStore?.registerAction?.(clutchInstanceContext?.instanceId, actionName, action);
    clutchComponentStore?.registerAction?.(clutchInstanceContext?.instanceId, actionName, action);
    clutchStore?.registerAction?.(clutchInstanceContext?.serializedId, actionName, action);
  }, [
    action,
    actionName,
    clutchStore?.registerAction,
    clutchInstanceStore?.registerAction,
    clutchComponentStore?.registerAction,
    clutchInstanceContext?.serializedId,
    clutchInstanceContext?.instanceId,
  ]);

  useEffect(() => {
    return () => {
      clutchInstanceStore?.unregisterAction?.(clutchInstanceContext?.instanceId, actionName);
      clutchComponentStore?.unregisterAction?.(clutchInstanceContext?.instanceId, actionName);
      clutchStore?.unregisterAction?.(clutchInstanceContext?.serializedId, actionName);
    };
  }, [
    actionName,
    clutchStore?.unregisterAction,
    clutchInstanceStore?.unregisterAction,
    clutchComponentStore?.unregisterAction,
    clutchInstanceContext?.serializedId,
    clutchInstanceContext?.instanceId,
  ]);
};

export const useRegisterState = <T, >(name: string, value: T) => {
const clutchStore = useClutchStore(useDeepEqual((state) => ({
    registerState: state.registerState,
    unregisterState: state.unregisterState,
  })));

  const clutchComponentStore = useClutchComponentStore(useDeepEqual((state) => ({
    registerState: state.registerState,
    unregisterState: state.unregisterState,
  })));

  const clutchInstanceStore = useClutchInstanceStore(useDeepEqual((state) => ({
    registerState: state.registerState,
    unregisterState: state.unregisterState,
  })));

  const clutchInstanceContext = useContext(ClutchInstanceContext);

  const storeSetter = useCallback((valueToSet) => {
    clutchInstanceStore?.registerState?.(clutchInstanceContext?.instanceId, name, valueToSet);
    clutchComponentStore?.registerState?.(clutchInstanceContext?.instanceId, name, valueToSet);
    clutchStore?.registerState?.(clutchInstanceContext?.serializedId, name, valueToSet);
  }, [
    name,
    clutchInstanceStore?.registerState,
    clutchComponentStore?.registerState,
    clutchStore?.registerState,
    clutchInstanceContext?.serializedId,
    clutchInstanceContext?.instanceId,
  ]);

  useEffect(() => {
    storeSetter(value);
  }, [
    storeSetter,
    value,
  ]);

  useEffect(() => {
    return () => {
      clutchInstanceStore?.unregisterState?.(clutchInstanceContext?.instanceId, name);
      clutchComponentStore?.unregisterState?.(clutchInstanceContext?.instanceId, name);
      clutchStore?.unregisterState?.(clutchInstanceContext?.serializedId, name);
    };
  }, [
    name,
    clutchInstanceStore?.unregisterState,
    clutchStore?.unregisterState,
    clutchComponentStore?.unregisterState,
    clutchInstanceContext?.serializedId,
    clutchInstanceContext?.instanceId,
  ]);

  return storeSetter;
};

export const useClutchInstanceContext = () => {
  return useContext(ClutchInstanceContext);
}

function createClutchInstanceStore() {
  return createStore()((set) => storeFactory(set));
}

export const useClutchInstanceStore = (selector: (state: any) => any, lookupInstanceId?: string) => {
  const { instanceStore, parentInstanceContext, instanceId } = useClutchInstanceContext();

  if (lookupInstanceId && lookupInstanceId !== instanceId) {
    let currentParentInstanceContext = parentInstanceContext;

    while (currentParentInstanceContext) {
      if (currentParentInstanceContext.instanceId === lookupInstanceId) {
        return useStore(currentParentInstanceContext.instanceStore, selector);
      }

      currentParentInstanceContext = currentParentInstanceContext.parentInstanceContext;
    }
  }

  if (!instanceStore) {
    return null;
  }

  return useStore(instanceStore, selector);
};

/**
 * @deprecated Use clutchElementConfig({styleSelectors: {...}}) instead
 */
export const useRegisterStyleSelectors = (selectors: unknown): void => {};

export const useClutchSelect = (setVisibility: (shouldBeVisible: boolean) => void, activeTrail = true) => {
  const clutchInstanceStore = useClutchInstanceStore(useDeepEqual((state) => ({
    setOnSelect: state.setOnSelect,
    setOnSelectActiveTrail: state.setOnSelectActiveTrail,
  })));

  useEffect(() => {
    clutchInstanceStore.setOnSelect?.(setVisibility);
    clutchInstanceStore.setOnSelectActiveTrail?.(activeTrail);
  }, [
    clutchInstanceStore.setOnSelect,
    clutchInstanceStore.setOnSelectActiveTrail,
    setVisibility,
    activeTrail,
  ]);

  return null;
};

export const useParentAction = (ParentType: React.FunctionComponent, actionName: string) => {
  const { instanceStore, parentInstanceContext, instanceId } = useClutchInstanceContext();
  let currentParentInstanceContext = parentInstanceContext;

  while (currentParentInstanceContext) {    
    if (currentParentInstanceContext.component === ParentType) {
      const selector = useCallback((state) => state.actions?.[currentParentInstanceContext?.instanceId]?.get(actionName), [currentParentInstanceContext?.instanceId, actionName]);
      return useStore(currentParentInstanceContext.instanceStore, selector);
    }

    currentParentInstanceContext = currentParentInstanceContext.parentInstanceContext;
  }

  if (!instanceStore) {
    return null;
  }

  const selector = useCallback((state) => state.actions?.[instanceId]?.get(actionName), [instanceId, actionName]);

  return useStore(instanceStore, selector);
}

export const useParentState = (ParentType: React.FunctionComponent, stateName: string) => {
  const { instanceStore, parentInstanceContext, instanceId } = useClutchInstanceContext();
  let currentParentInstanceContext = parentInstanceContext;

  while (currentParentInstanceContext) {
    if (currentParentInstanceContext.component === ParentType) {
      const selector = useCallback((state) => state.states?.[currentParentInstanceContext?.instanceId]?.get(stateName), [currentParentInstanceContext?.instanceId, stateName]);
      return useStore(currentParentInstanceContext.instanceStore, selector);
    }

    currentParentInstanceContext = currentParentInstanceContext.parentInstanceContext;
  }

  if (!instanceStore) {
    return null;
  }

  const selector = useCallback((state) => state.states?.[instanceId]?.[stateName], [instanceId, stateName]);

  return useStore(instanceStore, selector);
}

type TClutchInstanceContextProviderProps = {
  instanceId: string;
  component: React.FunctionComponent;
  children: React.ReactNode;
};

export const ClutchInstanceContextProvider = forwardRef(
  ({ instanceId, component, children, ...props }: TClutchInstanceContextProviderProps, ref) => {
    const componentContext = useClutchComponentContext();
    const parentInstanceContext = useClutchInstanceContext();

    const serializedId = useMemo(() => {
      const ids = [...(componentContext?.rootInstances || [])];

      ids.push(instanceId);
      
      return ids.join('#');
    }, [componentContext?.rootInstances, instanceId]);

    const [instanceStore] = useState(createClutchInstanceStore);

    const contextValue = useMemo(
      () => {
        return {
          instanceStore,
          instanceId,
          serializedId,
          component,
          parentInstanceContext,
        };
      },
      [
        instanceStore,
        instanceId,
        serializedId,
        parentInstanceContext,
        component,
      ]
    );

    return (
      <ClutchInstanceContext.Provider value={contextValue}>
        {cloneChildren(children, { ...props, ref })}
      </ClutchInstanceContext.Provider>
    );
  }
);
