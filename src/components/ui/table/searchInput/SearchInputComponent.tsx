import type { ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib';

import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';

import { setSearch } from '@/lib/store/teamsTable/teamsTableSlice';

export const SearchInputComponent = (): ReactNode => {
  const dispatch = useAppDispatch();
  const search = useAppSelector((state) => state.teamsTable.search);

  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <FaSearch color="4a5568" />
      </InputLeftElement>
      <Input
        id="searchInput"
        autoComplete="off"
        placeholder="Buscar cuadrilla"
        value={search}
        onChange={(event) => dispatch(setSearch(event.target.value))}
      />
    </InputGroup>
  );
};
