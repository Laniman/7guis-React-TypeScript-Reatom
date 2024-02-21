import React from "react";
import { reatomComponent, useAction } from "@reatom/npm-react";
import { CircleDrawerPure } from "./frame";
import {
  addCircleAction,
  mouseLeaveAction,
  mouseMoveAction,
  contextMenuAction,
  changeDiameterAction,
  stopChangeDiameterAction,
  adjustAction,
  getClosestAction,
  circlesAtom,
  inContextModeAtom,
} from "./model";

export const CircleDrawerTraditional = reatomComponent(({ ctx }) => {
  const handleAddCircle = useAction(addCircleAction);
  const handleMouseMove = useAction(mouseMoveAction);
  const handleMouseLeave = useAction(mouseLeaveAction);
  const handleContextMenu = useAction(contextMenuAction);
  const handleChangeDiameter = useAction(changeDiameterAction);
  const handleStopChangeDiameter = useAction(stopChangeDiameterAction);
  const handleAdjust = useAction(adjustAction);
  const getClosest = useAction(getClosestAction);

  return (
    <CircleDrawerPure
      inContextMode={inContextModeAtom}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onCanvasClick={handleAddCircle}
      onCircleClick={handleContextMenu}
      onAdjustClick={handleAdjust}
      getClosest={getClosest}
      onDiameterChange={handleChangeDiameter}
      onDiameterRelease={handleStopChangeDiameter}
      onUndo={ctx.bind(circlesAtom.undo)}
      onRedo={ctx.bind(circlesAtom.redo)}
      canUndo={ctx.spy(circlesAtom.isUndoAtom)}
      canRedo={ctx.spy(circlesAtom.isRedoAtom)}
    />
  );
}) as React.FC;

CircleDrawerTraditional.displayName = "CircleDrawerTraditional";
