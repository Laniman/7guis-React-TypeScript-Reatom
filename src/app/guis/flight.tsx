import React, { Component } from 'react';
import { DateTime } from 'luxon';
import { reatomComponent, useAtom } from '@reatom/npm-react';
import { Button, TextInput, VFlex } from '../basic';
import { cx } from "../utils";

const dateFormat = 'dd.MM.yyyy';

function getTimestamp(date: string): number {
  const parsed = DateTime.fromFormat(date, dateFormat);
  if (parsed.invalid != null) return null;
  return parsed.valueOf();
}

function isValidDate(date: string): boolean {
  return getTimestamp(date) != null;
}

export const FlightBooker = reatomComponent(({ ctx }) => {
  const [type, setType, typeAtom] = useAtom<'one-way' | 'return'>('one-way');

  const initDate = DateTime.local().toFormat(dateFormat);
  const [start, setStart, startAtom] = useAtom(initDate);
  const [end, setEnd, endAtom] = useAtom(initDate);

  const [validStart, , validStartAtom] = useAtom((ctx) => isValidDate(ctx.spy(startAtom)));
  const [validEnd, , validEndAtom] = useAtom((ctx) => isValidDate(ctx.spy(endAtom)));

  const disabledEnd = type !== 'return';

  const [bookable] = useAtom((ctx) => {
    if (!ctx.spy(validStartAtom) || !ctx.spy(validEndAtom)) return false;
    if (ctx.spy(typeAtom) === 'return') {
      return getTimestamp(ctx.spy(startAtom)) <= getTimestamp(ctx.spy(endAtom));
    }
    return true;
  });

  const handleBook = () => {
    switch (ctx.get(typeAtom)) {
      case 'one-way':
        return alert(`You have booked a one-way flight for ${ctx.get(startAtom)}`);
      case 'return':
        return alert(
          `You have booked a return flight from ${ctx.get(startAtom)} to ${ctx.get(endAtom)}`,
        );
      default:
        throw 'Impossible';
    }
  };

  return (
    <VFlex className={cx('min-w-[200px]')} vspace="8px">
      <select value={type} onChange={(e) => setType(e.target.value as 'one-way' | 'return')}>
        <option value="one-way">one-way flight</option>
        <option value="return">return flight</option>
      </select>
      <DateInput value={start} valid={validStart} onChange={(e) => setStart(e.target.value)} />
      <DateInput
        value={end}
        valid={validEnd}
        disabled={disabledEnd}
        onChange={(e) => setEnd(e.target.value)}
      />
      <Button disabled={!bookable} onClick={handleBook}>
        Book
      </Button>
    </VFlex>
  );
});

class DateInput extends Component<{
  value: string;
  valid: boolean;
  disabled?: boolean;
  onChange: AnyListener;
}> {
  render() {
    const { value, valid, disabled, onChange } = this.props;
    const d = disabled != null && disabled;
    return (
      <TextInput
        value={value}
        disabled={d}
        style={{ background: !valid && !d ? 'coral' : undefined }}
        onChange={onChange}
      />
    );
  }
}
