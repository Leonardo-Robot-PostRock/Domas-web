import { EditedNode } from '@/types/tables/table';

import { findNodeById, insertNode } from '@table-library/react-table-library/common';
import { TableNode } from '@table-library/react-table-library/types/table';
import { useAppDispatch, useAppSelector } from '@/store';
import { setData, setSquadDrawerId, setSquadEdited } from '@/store/squad/squadTableReducer';
import { ChangeEvent } from 'react';

/* Handle Drawer */
export const useHandleDrawer = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.squadTable.data);

  const drawerId = useAppSelector((state) => state.squadTable.drawerId);
  const edited = useAppSelector((state) => state.squadTable.edited);

  const handleEdit = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event);

    setSquadEdited(event.target.value);
  };

  const handleCancel = () => {
    dispatch(setSquadEdited(''));
    dispatch(setSquadDrawerId(null));
  };

  const handleSave = () => {
    const node = findNodeById(data.nodes, drawerId as string | number);
    const editedNode: EditedNode = { ...node, name: edited };
    const nodes = insertNode(data.nodes, editedNode as TableNode);

    dispatch(setData(nodes));

    setSquadEdited('');
    setSquadDrawerId(null);
  };
  return {
    handleEdit,
    handleCancel,
    handleSave,
  };
};
