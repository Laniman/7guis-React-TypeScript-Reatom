import { action, atom, reatomArray, reatomBoolean } from "@reatom/framework";
import { withUndo } from "@reatom/undo";
import type { Atom, AtomMut } from "@reatom/framework";
import { useCallback } from "react";

export interface Circle {
  x: AtomMut<number>;
  y: AtomMut<number>;
  diameter: AtomMut<number>;
  hovered: Atom<boolean>;
  selected: Atom<boolean>;
  active: Atom<boolean>;
}

export const circlesAtom = reatomArray<Circle>([], "circlesAtom").pipe(
  withUndo(),
);
export const inContextModeAtom = reatomBoolean(false);
export const selectedAtom = atom<Circle | null>(null);
export const hoveredAtom = atom<Circle | null>(null);

inContextModeAtom.onChange((ctx, prev) => {
  if (!prev) selectedAtom(ctx, null);
});

export const reatomCircle = (
  x: number,
  y: number,
  diameter: number,
): Circle => {
  const circle: Circle = {
    x: atom(x, "circle-x"),
    y: atom(y, "circle-y"),
    diameter: atom(diameter, "circle-diameter"),
    hovered: atom((ctx) => {
      return circle === ctx.spy(hoveredAtom);
    }, "circle-hovered"),
    selected: atom((ctx) => {
      return circle === ctx.spy(selectedAtom);
    }, "circle-selected"),
    active: atom((ctx) => {
      if (ctx.spy(selectedAtom) === null) return ctx.spy(circle.hovered);
      return ctx.spy(circle.selected);
    }, "circle-active"),
  };

  return circle;
};

export const getClosestAction = action(
  (ctx, x: number, y: number): Circle | null => {
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
  },
);

export const addCircleAction = action((ctx, x: number, y: number) => {
  const circle = reatomCircle(x, y, 30);
  const length = ctx.get(circlesAtom).length;
  circlesAtom.toSpliced(ctx, length, 0, circle);
  hoveredAtom(ctx, circle);
}, "addCircleAction");

export const contextMenuAction = action((ctx) => {
  const hovered = ctx.get(hoveredAtom);
  if (hovered === null) return;
  selectedAtom(ctx, hovered);
});

export const mouseMoveAction = action((ctx, x: number, y: number) => {
  const closest = getClosestAction(ctx, x, y);
  hoveredAtom(ctx, closest);
});

export const mouseLeaveAction = action((ctx) => {
  hoveredAtom(ctx, null);
});

export const adjustAction = action(() => {});

export const changeDiameterAction = action((ctx, d: number) => {
  const selected = ctx.get(selectedAtom)!;
  selected.diameter(ctx, d);
});

export const stopChangeDiameterAction = action(
  (ctx, initial: number, d: number) => {
    const circle = ctx.get(selectedAtom)!;
    const circles = ctx.get(circlesAtom);
    const index = circles.indexOf(circle);
    circle.diameter(ctx, initial);
    const next = reatomCircle(ctx.get(circle.x), ctx.get(circle.y), d);
    circlesAtom.with(ctx, index, next);
    selectedAtom(ctx, next);
    hoveredAtom(ctx, next);
  },
);

export const getInitialDiameterAction = action((ctx) =>
  ctx.get(ctx.get(selectedAtom)!.diameter),
);
