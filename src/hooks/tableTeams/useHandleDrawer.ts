import { EditedNode } from '@/types/tables/table';

import { findNodeById, insertNode } from '@table-library/react-table-library/common';
import { TableNode } from '@table-library/react-table-library/types/table';
import { useAppDispatch, useAppSelector } from '@/store';
import { setData, setSquadDrawerId, setSquadEdited } from '@/store/squad/squadReducer';

/* Drawer */
export const useHandleDrawer = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.squad.data);

  const drawerId = useAppSelector((state) => state.squad.drawerId);
  const edited = useAppSelector((state) => state.squad.edited);

  const handleEdit = (event) => {
    console.log(event);

    setSquadEdited(event.target.value);
  };

  const handleCancel = () => {
    dispatch(setSquadEdited(''));
    dispatch(setSquadDrawerId(null));
  };

  const handleSave = () => {
    const node = findNodeById(data, drawerId as string | number);
    const editedNode: EditedNode = { ...node, name: edited };
    const nodes = insertNode(data, editedNode as TableNode);

    dispatch(setData({ nodes }));

    setSquadEdited('');
    setSquadDrawerId(null);
  };
  return {
    handleEdit,
    handleCancel,
    handleSave,
  };
};
