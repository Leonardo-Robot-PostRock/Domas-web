import { useAppDispatch, useAppSelector } from '@/store';

import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';

import { setSearch } from '@/store/squad/squadTableReducer';

export const SearchInputComponent = () => {
  const dispatch = useAppDispatch();
  const search = useAppSelector((state) => state.squadTable.search);

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
