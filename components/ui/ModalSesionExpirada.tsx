// ModalSesionExpirada.jsx

import { Text, Divider } from '@chakra-ui/react';
import { CustomModal } from '@/components/CustomModal';
import { TimeIcon } from '@chakra-ui/icons';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalSesionExpirada({ isOpen, onClose }: Props) {
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="¡Su sesión ha expirado!"
      description="Por favor, inicie sesión nuevamente para continuar."
      icon={<TimeIcon />} // Reemplaza esto con el icono que desees
      colorIcon="#FF0000" // Cambia el color del icono según tus necesidades
      bodyContent={
        <>
          <Divider />
          {/* Aquí puedes agregar contenido adicional si es necesario */}
        </>
      }
    />
  );
}
