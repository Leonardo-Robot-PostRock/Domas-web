import { useAppDispatch, useAppSelector } from '@/lib';

import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';

import { setSearch } from '@/lib/store/teamsTable/teamsTableSlice';

export const SearchInputComponent = () => {
  const dispatch = useAppDispatch();
  const search = useAppSelector((state) => state.teamsTable.search);

  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none" children={<FaSearch style={{ color: '#4a5568' }} />} />
      <Input
        placeholder="Buscar cuadrilla"
        value={search}
        onChange={(event) => dispatch(setSearch(event.target.value))}
      />
    </InputGroup>
  );
};
