import React from 'react';
import ReactDOM from 'react-dom';
import { css } from 'emotion';
import { reatomComponent } from '@reatom/npm-react';
import { atom, AtomMut } from '@reatom/framework';
import { Box, BoxClickable, Button, Flex, VFlex } from '../../basic';
import { cx } from "../../utils";
import { Circle } from './model';

interface CircleCompProps {
  circle: Circle;
}

const CircleComp = reatomComponent<CircleCompProps>(({ ctx, ...props }) => {
  const { circle } = props;

  return (
    <Box
      position="absolute"
      left={ctx.spy(circle.x)}
      top={ctx.spy(circle.y)}
      width={ctx.spy(circle.diameter)}
      height={ctx.spy(circle.diameter)}
      border="1px solid #333"
      borderRadius={100}
      style={{
        transform: 'translate(-50%, -50%)',
        background: ctx.spy(circle.active) ? '#eee' : undefined,
      }}
    />
  );
});

interface CircleDrawerPureProps {
  circles: Array<Circle>;
  inContextMode: AtomMut<boolean>;
  onMouseMove: (x: number, y: number) => void;
  onMouseLeave: () => void;
  onCanvasClick: (x: number, y: number) => void;
  onCircleClick: (c: Circle) => void;
  onAdjustClick: () => void;
  getInitialDiameter: () => number;
  onDiameterChange: (d: number) => void;
  onDiameterRelease: (initial: number, d: number) => void;
  getClosest: (x: number, y: number) => Circle;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const contextMenuVisibleAtom = atom(false);
const contextMenuXAtom = atom(0);
const contextMenuYAtom = atom(0);

const diameterDialogVisibleAtom = atom(false);
const diameterDialogXAtom = atom(0);
const diameterDialogYAtom = atom(0);
const diameterAtom = atom(0);

export const CircleDrawerPure = reatomComponent<CircleDrawerPureProps>(({ ctx, ...props }) => {
  const canvasRef = React.useRef(null);
  const contextMenuRef = React.useRef<HTMLDivElement>(null);
  const diameterDialogRef = React.useRef<HTMLDivElement>(null);
  const initialDiameter = React.useRef<number>(null);

  const contextMenuVisible = ctx.spy(contextMenuVisibleAtom);
  const contextMenuX = ctx.spy(contextMenuXAtom);
  const contextMenuY = ctx.spy(contextMenuYAtom);

  const diameterDialogVisible = ctx.spy(diameterDialogVisibleAtom);
  const diameterDialogX = ctx.spy(diameterDialogXAtom);
  const diameterDialogY = ctx.spy(diameterDialogYAtom);
  const diameter = ctx.spy(diameterAtom);

  React.useEffect(() => {
    props.inContextMode(ctx, contextMenuVisible || diameterDialogVisible);
  }, [contextMenuVisible, diameterDialogVisible]);

  React.useEffect(() => {
    document.addEventListener('click', handleDocumentContextMenuClick, { capture: true });
    document.addEventListener('click', handleDocumentDialogClick, { capture: true });

    return () => {
      document.removeEventListener('click', handleDocumentContextMenuClick, { capture: true });
      document.removeEventListener('click', handleDocumentDialogClick, { capture: true });
    };
  }, []);

  const handleDocumentContextMenuClick = (e: Event) => {
    if (!(e.target instanceof Node)) return;
    if (
      !ctx.get(contextMenuVisibleAtom) ||
      contextMenuRef.current.contains(e.target)
    ) {
      return;
    }
    e.stopPropagation();
    contextMenuVisibleAtom(ctx, false);
  };

  const handleDocumentDialogClick = (e: Event) => {
    if (!(e.target instanceof Node)) return;
    if (
      !ctx.get(diameterDialogVisibleAtom) ||
      diameterDialogRef.current.contains(e.target)
    ) {
      return;
    }
    e.stopPropagation();
    diameterDialogVisibleAtom(ctx, false);
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const canvas = ReactDOM.findDOMNode(canvasRef.current) as HTMLElement;
    const x = e.pageX - canvas.offsetLeft;
    const y = e.pageY - canvas.offsetTop;
    const closest = props.getClosest(x, y);
    if (closest == null) {
      props.onCanvasClick(x, y);
    } else {
      props.onCircleClick(closest);
      handleContextMenu(e);
    }
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLElement>) => {
    contextMenuVisibleAtom(ctx, true);
    contextMenuXAtom(ctx, e.pageX);
    contextMenuYAtom(ctx, e.pageY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const canvas = ReactDOM.findDOMNode(canvasRef.current) as HTMLElement;
    const x = e.pageX - canvas.offsetLeft;
    const y = e.pageY - canvas.offsetTop;
    props.onMouseMove(x, y);
  };

  const handleMouseLeave = () => {
    props.onMouseLeave();
  };

  const handleContextMenuAdjust = () => {
    props.onAdjustClick();
    contextMenuVisibleAtom(ctx, false);
    diameterDialogVisibleAtom(ctx, true);
    diameterDialogXAtom(ctx, contextMenuX);
    diameterDialogYAtom(ctx, contextMenuY);
    const d = props.getInitialDiameter();
    diameterAtom(ctx, d);
    initialDiameter.current = d;
  };

  const handleChangeDiameter = (e: React.FormEvent<HTMLInputElement>) => {
    const d = parseInt(e.currentTarget.value);
    diameterAtom(ctx, d);
    if (initialDiameter.current == null) {
      initialDiameter.current = d;
    }
    props.onDiameterChange(d);
  };

  const handleStopChangeDiameter = (e: React.FormEvent<HTMLInputElement>) => {
    props.onDiameterRelease(initialDiameter.current, parseInt(e.currentTarget.value));
    initialDiameter.current = null;
  };

  return (
    <VFlex className={cx('min-w-[410px]', 'h-[250px]')} vspace="4px">
      <Flex hspace={1} alignSelf="center">
        <Button disabled={!props.canUndo} onClick={() => props.onUndo()}>
          Undo
        </Button>
        <Button disabled={!props.canRedo} onClick={() => props.onRedo()}>
          Redo
        </Button>
      </Flex>

      <Box
        innerRef={canvasRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        flex="1"
        bg="white"
        border="1px solid #bbb"
        position="relative"
        style={{ overflow: 'hidden' }}
      >
        {props.circles.map((c, i) => (
          <CircleComp key={i} circle={c} />
        ))}
      </Box>

      {contextMenuVisible && (
        <BoxClickable
          ref={contextMenuRef}
          style={{ left: contextMenuX, top: contextMenuY }}
          onClick={handleContextMenuAdjust}
          className={cx(
            'p-1',
            'absolute',
            'w-[120px]',
            'bg-[#eee]',
            'border-[1px]',
            'border-[#888]',
            'border-solid',
            'rounded-[4px]',
            'shadow-[0px_1px_5px_rgba(0,0,0,0.15)]',
          )}
        >
          Adjust Diameter
        </BoxClickable>
      )}
      {diameterDialogVisible && (
        <VFlex
          ref={diameterDialogRef}
          className={cx(
            'p-1',
            'items-center',
            'absolute',
            'w-[180px]',
            'bg-[#eee]',
            'border-[1px]',
            'border-[#888]',
            'border-solid',
            'rounded-[4px]',
            'shadow-[0px_1px_5px_rgba(0,0,0,0.15)]',
          )}
          vspace="4px"
          style={{
            left: diameterDialogX,
            top: diameterDialogY,
          }}
        >
          <Box flex="1">Adjust Diameter</Box>
          <input
            type="range"
            min={2}
            max={100}
            value={diameter}
            onChange={handleChangeDiameter}
            onMouseUp={handleStopChangeDiameter}
            className={css`
              flex: 1;
            `}
          />
        </VFlex>
      )}
    </VFlex>
  );
});
