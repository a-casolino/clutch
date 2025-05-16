
import React from 'react';

/**
 * Configuration function for Clutch Elements
 * 
 * @param element The React Component to be used in Clutch
 * @param config Additional information about the component
 */
export const clutchElementConfig = (
  element: React.FunctionComponent,
  config: {
    behavior?: boolean | React.FunctionComponent;
    icon?: string;
    styleSelectors?: { name?: string; value: string }[];
  },
) => config;

export {
  useClutchStore,
  storeFactory,
} from './components/ClutchContext';

export {
  ClutchComponentContextProvider,
  useClutchComponentContext,
  useClutchComponentStore,
} from './components/ClutchComponentContext';

export type { TClutchStore } from './components/ClutchContext';

export {
  ClutchInstanceContextProvider,
  useClutchInstanceContext,
  useClutchInstanceStore,
  useClutchSelect,
  useRegisterAction,
  useRegisterState,
  useParentAction,
  useParentState,
  useRegisterStyleSelectors,
} from './components/ClutchInstanceContext';
export { default as ClutchImage } from './components/ClutchImage';
export { default as ClutchLink } from './components/ClutchLink';
export { default as ClutchRichText } from './components/ClutchRichText';
export { default as ClutchSvg } from './components/ClutchSvg';
export { cloneChildren } from '../app/_debug/components';
export { useDeepEqual } from '../app/_debug/helpers';
