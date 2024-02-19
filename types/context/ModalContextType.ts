export interface ModalContextType {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  isOpenDelete: boolean;
  onOpenDelete: () => void;
  onCloseDelete: () => void;
}
