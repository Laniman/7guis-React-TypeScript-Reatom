import React from "react";
import { Component } from "react";
import { atom } from "@reatom/framework";
import { reatomComponent, useAtom } from "@reatom/npm-react";
import { Flex, Label, TextInput } from "../basic";

function isNumeric(n: string): boolean {
  return !isNaN(parseFloat(n)) && isFinite(Number(n));
}

class TempConvPure extends Component<{
  celsius: string;
  fahrenheit: string;
  onChangeCelsius: React.ChangeEventHandler<HTMLInputElement>;
  onChangeFahrenheit: React.ChangeEventHandler<HTMLInputElement>;
}> {
  getBackground = (mine: string, other: string): string => {
    if (mine === "") return undefined;
    if (!isNumeric(mine)) return "coral";
    if (!isNumeric(other)) return "lightgray";
    return undefined;
  };

  render() {
    const { celsius, fahrenheit, onChangeCelsius, onChangeFahrenheit } =
      this.props;
    return (
      <Flex className="items-center">
        <TextInput
          style={{ background: this.getBackground(celsius, fahrenheit) }}
          value={celsius}
          onChange={onChangeCelsius}
        />
        <Label>Celsius = </Label>
        <TextInput
          style={{ background: this.getBackground(fahrenheit, celsius) }}
          value={fahrenheit}
          onChange={onChangeFahrenheit}
        />
        <Label>Fahrenheit</Label>
      </Flex>
    );
  }
}

export const TempConvManual = () => {
  const [celsius, setCelsius] = useAtom("");
  const [fahrenheit, setFahrenheit] = useAtom("");

  const handleChangeCelsius = React.useCallback(
    (event) => {
      const value = event.currentTarget.value;
      setCelsius(value);
      if (!isNumeric(value)) return;
      const c = parseFloat(value);
      const nextFahrenheit = Math.round(c * (9 / 5) + 32).toString();
      setFahrenheit(nextFahrenheit);
    },
    [setCelsius, setFahrenheit],
  );

  const handleChangeFahrenheit = React.useCallback(
    (event) => {
      const value = event.currentTarget.value;
      setFahrenheit(value);
      if (!isNumeric(value)) return;
      const f = parseFloat(value);
      const nextCelsius = Math.round((f - 32) * (5 / 9)).toString();
      setCelsius(nextCelsius);
    },
    [setFahrenheit, setCelsius],
  );

  return (
    <TempConvPure
      celsius={celsius}
      fahrenheit={fahrenheit}
      onChangeCelsius={handleChangeCelsius}
      onChangeFahrenheit={handleChangeFahrenheit}
    />
  );
};

const celsiusAtom = atom("");
const fahrenheitAtom = atom("");

celsiusAtom.onChange((ctx, value) => {
  if (!isNumeric(value)) return;
  const c = parseFloat(value);
  fahrenheitAtom(ctx, Math.round(c * (9 / 5) + 32).toString());
});

fahrenheitAtom.onChange((ctx, value) => {
  if (!isNumeric(value)) return;
  const f = parseFloat(value);
  celsiusAtom(ctx, Math.round((f - 32) * (5 / 9)).toString());
});

export const TempConvAuto = reatomComponent(({ ctx }) => {
  return (
    <TempConvPure
      celsius={ctx.spy(celsiusAtom)}
      fahrenheit={ctx.spy(fahrenheitAtom)}
      onChangeCelsius={(e) => {
        celsiusAtom(ctx, e.target.value);
      }}
      onChangeFahrenheit={(e) => {
        fahrenheitAtom(ctx, e.target.value);
      }}
    />
  );
});
