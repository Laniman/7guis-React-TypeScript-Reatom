import React from "react";
import {
  atom,
  action,
  reatomArray,
  reatomBoolean,
  type AtomMut,
} from "@reatom/framework";
import { reatomComponent, useAction } from "@reatom/npm-react";
import { withUndo } from "@reatom/undo";
import { CircleDrawerPure } from "./frame";
import type { Circle } from "./model";

const circlesAtom = reatomArray<Circle>().pipe(withUndo());
const inContextModeAtom = reatomBoolean(false);
const selectedAtom = atom<Circle>(null) as AtomMut<Circle>;
const hoveredAtom = atom<Circle>(null) as AtomMut<Circle>;

inContextModeAtom.onChange((ctx, prev) => {
  if (!prev) selectedAtom(ctx, null);
});

const reatomCircle = (x: number, y: number, diameter: number): Circle => {
  const circle = {
    x: atom(x),
    y: atom(y),
    diameter: atom(diameter),
    hovered: atom((ctx) => {
      return circle === ctx.spy(hoveredAtom);
    }),
    selected: atom((ctx) => {
      return circle === ctx.spy(selectedAtom);
    }),
    active: atom((ctx) => {
      if (ctx.spy(selectedAtom) === null) return ctx.spy(circle.hovered);
      return ctx.spy(circle.selected);
    }),
  };

  return circle;
};

const getClosestAction = action((ctx, x: number, y: number): Circle => {
  let circle = null;
  let minDist = Number.MAX_VALUE;
  const circles = ctx.get(circlesAtom);
  for (const c of circles) {
    const d = Math.sqrt(
      Math.pow(x - ctx.get(c.x), 2) + Math.pow(y - ctx.get(c.y), 2),
    );
    if (d <= ctx.get(c.diameter) / 2 && d < minDist) {
      circle = c;
      minDist = d;
    }
  }
  return circle;
});

const addCircleAction = action((ctx, x: number, y: number) => {
  const circle = reatomCircle(x, y, 30);
  const length = ctx.get(circlesAtom).length;
  circlesAtom.toSpliced(ctx, length, 0, circle);
  hoveredAtom(ctx, circle);
});

const contextMenuAction = action((ctx) => {
  const hovered = ctx.get(hoveredAtom);
  if (hovered === null) return;
  selectedAtom(ctx, hovered);
});

const mouseMoveAction = action((ctx, x: number, y: number) => {
  const closest = getClosestAction(ctx, x, y);
  hoveredAtom(ctx, closest);
});

const mouseLeaveAction = action((ctx) => {
  hoveredAtom(ctx, null);
});

const adjustAction = action(() => {});

const changeDiameterAction = action((ctx, d: number) => {
  const selected = ctx.get(selectedAtom);
  selected.diameter(ctx, d);
});

const stopChangeDiameterAction = action((ctx, initial: number, d: number) => {
  const circle = ctx.get(selectedAtom);
  const circles = ctx.get(circlesAtom);
  const index = circles.indexOf(circle);
  circle.diameter(ctx, initial);
  const next = reatomCircle(ctx.get(circle.x), ctx.get(circle.y), d);
  circlesAtom.with(ctx, index, next);
  selectedAtom(ctx, next);
  hoveredAtom(ctx, next);
});

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
      circles={ctx.spy(circlesAtom)}
      inContextMode={inContextModeAtom}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onCanvasClick={handleAddCircle}
      onCircleClick={handleContextMenu}
      onAdjustClick={handleAdjust}
      getInitialDiameter={() => ctx.get(ctx.get(selectedAtom).diameter)}
      getClosest={getClosest}
      onDiameterChange={handleChangeDiameter}
      onDiameterRelease={handleStopChangeDiameter}
      onUndo={() => {
        circlesAtom.undo(ctx);
      }}
      onRedo={() => {
        circlesAtom.redo(ctx);
      }}
      canUndo={ctx.spy(circlesAtom.isUndoAtom)}
      canRedo={ctx.spy(circlesAtom.isRedoAtom)}
    />
  );
}) as React.FC;

CircleDrawerTraditional.displayName = "CircleDrawerTraditional";
