import {
  atom,
  action,
  reatomArray,
  type AtomMut,
  type Ctx,
  type Atom,
} from "@reatom/framework";
import { Formula, Textual } from "./formula";
import { FormulaParser } from "./parser";

export interface CellType {
  initialContent: string;
  content: AtomMut<string>;
  formula: AtomMut<Formula>;
  editing: Atom<boolean>;
  value: Atom<number>;
  displayValue: Atom<string>;
  makeSelected(ctx: Ctx): void;
  unselect(ctx: Ctx): void;
  applyChange(ctx: Ctx): void;
  abortEditing(ctx: Ctx): void;
}

const reatomCell = (): CellType => {
  const obj: CellType = {
    initialContent: "",
    content: atom(""),
    formula: atom(new Textual("")),
    editing: atom((ctx) => ctx.spy(selectedCellAtom) === obj),
    value: atom((ctx) => {
      try {
        const v = ctx.spy(obj.formula).eval(ctx.spy(cellsAtom));
        return ctx.spy(v);
      } catch (err) {
        return NaN;
      }
    }),
    displayValue: atom((ctx) => {
      const f = ctx.spy(obj.formula);

      if (f.hasValue) {
        return ctx.spy(obj.value).toString();
      } else {
        return f.toString();
      }
    }),
    makeSelected: (ctx: Ctx) => {
      selectedCellAtom(ctx, obj);
    },
    unselect: (ctx: Ctx) => {
      selectedCellAtom(ctx, null);
    },
    applyChange(ctx: Ctx) {
      const next = ctx.get(parser).parse(ctx.get(obj.content));
      obj.formula(ctx, next);
    },
    abortEditing(ctx: Ctx) {
      obj.content(ctx, obj.initialContent);
      obj.unselect(ctx);
    },
  };

  return obj;
};

const initialCells = Array.from({ length: 10 }, () =>
  Array.from({ length: 5 }, () => reatomCell()),
);

export const cellsAtom = reatomArray(initialCells);

export const selectedCellAtom = atom<null | CellType>(
  null,
) as AtomMut<CellType>;

export const storeAbort = action((ctx) => {
  const selected = ctx.get(selectedCellAtom);
  if (!selected) return;
  selected.abortEditing(ctx);
});

export const parser = atom(new FormulaParser());
