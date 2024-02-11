import { Atom, AtomMut } from "@reatom/framework";

export interface Circle {
  x: AtomMut<number>;
  y: AtomMut<number>;
  diameter: AtomMut<number>;
  hovered: Atom<boolean>;
  selected: Atom<boolean>;
  active: Atom<boolean>;
}
