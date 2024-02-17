import React from "react";
import { reatomComponent } from "@reatom/npm-react";
import { Flex, TextInput } from "../../basic";
import { cx } from "../../utils";
import { type CellType } from "./model";

interface CellProps {
  cell: CellType;
}

export const Cell = reatomComponent(({ ctx, ...props }) => {
  const { cell, ...rest } = props;

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.nativeEvent.stopImmediatePropagation();
    cell.initialContent = ctx.get(cell.content);
    cell.makeSelected(ctx);
  };

  const handleEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      try {
        cell.applyChange(ctx);
        cell.unselect(ctx);
      } catch (e) {
        alert(e.message);
      }
    }
  };

  const handleEscKeyUp = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      cell.abortEditing(ctx);
    }
  };

  const handeFocus = React.useCallback((ref: HTMLInputElement) => {
    if (ref) ref.focus();
  }, []);

  return (
    <Flex
      className={cx("px-0.5", "min-h-8", "items-center", "content-center")}
      onClick={handleClick}
      {...rest}
    >
      {ctx.spy(cell.editing) ? (
        <TextInput
          ref={handeFocus}
          className={cx("w-full")}
          onKeyDown={handleEnterKeyPress}
          onKeyUp={handleEscKeyUp}
          value={ctx.spy(cell.content)}
          onChange={(event) => {
            cell.content(ctx, event.target.value);
          }}
        />
      ) : (
        ctx.spy(cell.displayValue)
      )}
    </Flex>
  );
}) as React.FC<CellProps>;

Cell.displayName = "Cell";
