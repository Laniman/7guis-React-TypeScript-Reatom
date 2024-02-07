import * as React from 'react';
import { Component } from 'react';
import { css } from 'emotion';
import { Box, Button, Flex, Label, Stack, TextInput, VFlex } from '../basic';
import { uuid } from '../utils';
import { reatomComponent, useAtom, useAction } from '@reatom/npm-react';

const padder = (
  <Label
    className={css`
      visibility: hidden;
    `}
  >
    Surname:{' '}
  </Label>
);

export const Crud = reatomComponent(({ ctx }) => {
  const [prefix, setPrefix, prefixAtom] = useAtom('');
  const [firstName, setFirstName, firstNameAtom] = useAtom('');
  const [lastName, setLastName, lastNameAtom] = useAtom('');
  const [, , nameAtom] = useAtom((ctx) => `${ctx.spy(lastNameAtom)}, ${ctx.spy(firstNameAtom)}`);
  const [selected, setSelected, selectedAtom] = useAtom('');
  const [, , dbAtom] = useAtom([
    [uuid(), 'Emil, Hans'],
    [uuid(), 'Mustermann, Max'],
    [uuid(), 'Tisch, Roman'],
  ]);
  const [filtered] = useAtom((ctx) =>
    ctx
      .spy(dbAtom)
      .filter(([_, x]) => x.toLowerCase().indexOf(ctx.spy(prefixAtom).toLowerCase()) !== -1),
  );

  const handleCreate = useAction(
    (ctx) => dbAtom(ctx, (prev) => prev.concat([[uuid(), ctx.get(nameAtom)]])),
    [dbAtom, nameAtom],
  );

  const handleUpdate = useAction(
    (ctx) => {
      const id = ctx.get(selectedAtom);
      const index = ctx.get(dbAtom).findIndex(([i]) => i === id);
      if (index === -1) return;

      dbAtom(ctx, (prev) => {
        return prev.map((item, i) => {
          if (i !== index) return item;
          return [uuid(), ctx.get(nameAtom)];
        });
      });
    },
    [selectedAtom, dbAtom, nameAtom],
  );

  const handleDelete = useAction(
    (ctx) => {
      const id = ctx.get(selectedAtom);
      const index = ctx.get(dbAtom).findIndex(([i]) => i === id);
      if (index === -1) return;
      dbAtom(ctx, (prev) => prev.filter((_, i) => i !== index));
    },
    [selectedAtom, dbAtom],
  );

  return (
    <VFlex minWidth="410px" vspace={2}>
      <Flex hspace={1}>
        <Flex flex="1">
          <Label>
            Filter{'\u00A0'}prefix:{'\u00A0'}
          </Label>
          <TextField
            width="0"
            flex="1"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
          />
        </Flex>
        <Box flex="1" />
      </Flex>

      <Flex hspace={1}>
        <select
          size={2}
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className={css`
            flex: 1;
            border: 1px solid #ddd;
            border-radius: 5px;
          `}
        >
          {filtered.map(([id, x]) => (
            <option key={id} value={id}>
              {x}
            </option>
          ))}
        </select>
        <Box flex="1" vspace={1}>
          <Flex>
            <Stack>
              {padder}
              <Label>Name: </Label>
            </Stack>
            <TextField flex="1" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </Flex>
          <Flex>
            <Label>Surname: </Label>
            <TextField flex="1" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </Flex>
        </Box>
      </Flex>

      <Flex hspace={1}>
        <Button onClick={handleCreate}>Create</Button>
        <Button onClick={handleUpdate}>Update</Button>
        <Button onClick={handleDelete}>Delete</Button>
      </Flex>
    </VFlex>
  );
});

class TextField extends Component<{
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> {
  render() {
    return <TextInput {...this.props} />;
  }
}
