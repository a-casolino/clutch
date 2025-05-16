"use client";
import { helpers } from './helpers.ts';

function DebugClutchHelpers(_: any) {
  return null;
}

DebugClutchHelpers.displayName = 'DebugClutchHelpers';

export const ClutchHelpers = () => {
  return (
    <DebugClutchHelpers helpers={helpers} />
  );
}