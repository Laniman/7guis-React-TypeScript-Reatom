import React from 'react';
import { reatomComponent, useAtom, useAction } from '@reatom/npm-react';
import { Box, Button, Flex, Label, Stack, TextInput, VFlex } from '../basic';
import { cx, uuid } from '../utils';

const padder = (
  <Label className="invisible">
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
    <VFlex className={cx('min-w-[410px]')} vspace="8px">
      <Flex hspace="4px">
        <Flex className={cx('flex-1')}>
          <Label>
            Filter{'\u00A0'}prefix:{'\u00A0'}
          </Label>
          <TextInput
            className={cx('w-0', 'flex-1')}
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
          />
        </Flex>
        <div className={cx('flex-1')} />
      </Flex>

      <Flex hspace="4px">
        <select
          size={2}
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className={cx('flex-1', 'border-solid', 'border-[1px]', 'border-[#ddd]', 'rounded-[5px]')}
        >
          {filtered.map(([id, x]) => (
            <option key={id} value={id}>
              {x}
            </option>
          ))}
        </select>
        <Box className="flex-1" vspace="4px">
          <Flex>
            <Stack>
              {padder}
              <Label>Name: </Label>
            </Stack>
            <TextInput
              className={cx('flex-1')}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Flex>
          <Flex>
            <Label>Surname: </Label>
            <TextInput
              className={cx('flex-1')}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Flex>
        </Box>
      </Flex>

      <Flex hspace="4px">
        <Button onClick={handleCreate}>Create</Button>
        <Button onClick={handleUpdate}>Update</Button>
        <Button onClick={handleDelete}>Delete</Button>
      </Flex>
    </VFlex>
  );
});
