"use client";
import { actions } from './actions.ts';

function DebugClutchActions(_: any) {
  return null;
}

DebugClutchActions.displayName = 'DebugClutchActions';

export const ClutchActions = () => {
  return (
    <DebugClutchActions actions={actions} />
  );
}