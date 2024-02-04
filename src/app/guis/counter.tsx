// Deliberately using a global counter to keep things simplistic
// and to show an alternative style. If you want to have several
// counters then the state should be bound to the component,
// of course.

import * as React from 'react'
import { atom } from '@reatom/framework'
import { reatomComponent } from '@reatom/npm-react'
import {Button, Flex, Label} from '../basic'

const countAtom = atom(0);

export const Counter = reatomComponent(({ ctx }) =>
  <Flex alignItems='center' minWidth='200px'>
    <Label flex='1'>{ctx.spy(countAtom)}</Label>
    <Button flex='1' onClick={() => countAtom(ctx, (count) => count + 1)}>Count</Button>
  </Flex>
)
