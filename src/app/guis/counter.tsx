import React from "react";
import { atom } from "@reatom/framework";
import { reatomComponent } from "@reatom/npm-react";
import { Button, Flex, Label } from "../basic";
import { cx } from "../utils";

const countAtom = atom(0);

export const Counter = reatomComponent(({ ctx }) => (
  <Flex className={cx("items-center", "min-w-[200px]")}>
    <Label className="flex-1">{ctx.spy(countAtom)}</Label>
    <Button
      className="flex-1"
      onClick={() => countAtom(ctx, (count) => count + 1)}
    >
      Count
    </Button>
  </Flex>
));
