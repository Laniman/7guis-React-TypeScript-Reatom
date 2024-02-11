import React from "react";
import { Component } from "react";
import { reatomComponent, useAtom } from "@reatom/npm-react";
import { mapState } from "@reatom/lens";
import { reatomTimer } from "@reatom/timer";
import { Box, Button, Flex, Label, Stack, VFlex } from "../basic";
import { cx } from "../utils";

function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}

const padder = <Label className="invisible">Elapsed Time: </Label>;

const MAX = 30000;
const INTERVAL = 100;

const timerAtom = reatomTimer({
  name: "timer",
  interval: INTERVAL,
  delayMultiplier: 1,
  progressPrecision: 1,
  resetProgress: false,
});

const nowAtom = timerAtom.pipe(mapState(() => new Date().getTime()));

export const Timer = reatomComponent(({ ctx }) => {
  const [max, setMax, maxAtom] = useAtom(MAX / 2);
  const [, setStart, startAtom] = useAtom(new Date().getTime());

  const [elapsed] = useAtom((ctx) => {
    const max = ctx.spy(maxAtom);
    const start = ctx.spy(startAtom);
    if (new Date().getTime() - start >= max) return max;
    const now = ctx.spy(nowAtom);
    return clamp(now - start, 0, max);
  });

  React.useEffect(() => {
    if (max <= INTERVAL) {
      timerAtom.stopTimer(ctx);
    } else {
      void timerAtom.startTimer(ctx, max);
    }
  }, [max]);

  return (
    <VFlex className={cx("min-w-[350px]")} vspace="4px">
      <GaugeTime max={max} value={elapsed} />
      <TextTime value={elapsed} />
      <Flex className={cx("items-center")}>
        <Stack>
          {padder}
          <Label>Duration: </Label>
        </Stack>
        <Box className="mr-1" />
        <input
          type="range"
          min={0}
          max={MAX}
          value={max}
          onChange={(e) => setMax(Math.max(1, parseInt(e.target.value)))}
          className={cx("flex-1")}
        />
      </Flex>
      <Button
        onClick={() => {
          setStart(new Date().getTime());
          void timerAtom.startTimer(ctx, Math.max(max, INTERVAL));
        }}
      >
        Reset Timer
      </Button>
    </VFlex>
  );
}) as React.FC;

Timer.displayName = "Timer";

class TextTime extends Component<{
  value: number;
}> {
  render() {
    const value = this.props.value;
    const seconds = Math.floor(value / 1000);
    const dezipart = Math.floor(value / 100) % 10;
    const formatted = `${seconds}.${dezipart}s`;
    return (
      <Flex className={cx("items-center", "select-none")}>
        {padder}
        <Label className="flex-1 text-left">{formatted}</Label>
      </Flex>
    );
  }
}

class GaugeTime extends Component<{
  value: number;
  max: number;
}> {
  render() {
    const { value, max } = this.props;
    return (
      <Flex className={cx("items-center")}>
        <Label>Elapsed Time: </Label>
        <Box className="mr-1" />
        <meter min={0} max={max} value={value} className={cx("flex-1")} />
      </Flex>
    );
  }
}
