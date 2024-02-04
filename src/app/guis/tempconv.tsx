import * as React from 'react'
import {Component} from 'react'
import {observer} from 'mobx-react'
import {observable} from 'mobx'
import {useAtom} from '@reatom/npm-react'

import {Comp, Flex, Label, TextInput} from '../basic'

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

class TempConvPure extends Component<{
  celsius: string
  fahrenheit: string
  onChangeCelsius: AnyListener
  onChangeFahrenheit: AnyListener
}> {

  getBackground = (mine: string, other: string): string => {
    if (mine === '') return undefined
    if (!isNumeric(mine)) return 'coral'
    if (!isNumeric(other)) return 'lightgray'
    return undefined
  }

  render() {
    const { celsius, fahrenheit, onChangeCelsius, onChangeFahrenheit } = this.props
    return (
      <Flex alignItems='center'>
        <TextInput
          style={{background: this.getBackground(celsius, fahrenheit)}}
          value={celsius}
          onChange={onChangeCelsius}
        />
        <Label>Celsius = </Label>
        <TextInput
          style={{background: this.getBackground(fahrenheit, celsius)}}
          value={fahrenheit}
          onChange={onChangeFahrenheit}
        />
        <Label>Fahrenheit</Label>
      </Flex>
    )
  }
}

export const TempConvManual = () => {
  const [celsius, setCelsius] = useAtom('');
  const [fahrenheit, setFahrenheit] = useAtom('');

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

/*
Code a bit contrived just to make use of auto propagation and to show how to
stop circular propagation. Would be cool to have a primitive/option to prevent
circular propagation automatically if that's even possible.

In general, auto propagation is more mistake-resilient as you don't have to
be careful to always update the state via methods that manually propagate
the changes as is the case for TempConvManual.handleChangeCelsius. In this
example, the advantages do not matter since it is too small.
*/

@observer
export class TempConvAuto extends Comp {
  @observable celsius = ''
  @observable fahrenheit = ''

  componentDidMount() {
    let prevF = null
    this.autorun(() => {
      if (this.fahrenheit === prevF) return // stop propagation
      prevF = this.fahrenheit
      if (!isNumeric(this.fahrenheit)) return
      const f = parseFloat(this.fahrenheit)
      prevC = this.celsius = Math.round((f - 32) * (5 / 9)).toString()
    })

    let prevC = null
    this.autorun(() => {
      if (this.celsius === prevC) return // stop propagation
      prevC = this.celsius
      if (!isNumeric(this.celsius)) return
      const c = parseFloat(this.celsius)
      prevF = this.fahrenheit = Math.round(c * (9/5) + 32).toString()
    })
  }

  render() {
    return <TempConvPure
      celsius={this.celsius}
      fahrenheit={this.fahrenheit}
      onChangeCelsius={(e) => this.celsius = e.target.value}
      onChangeFahrenheit={(e) => this.fahrenheit = e.target.value}
    />
  }
}
