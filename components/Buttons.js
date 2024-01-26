import { Button, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MdCheck } from 'react-icons/md';

export function SuccessButton({ promise = null }) {
  const [dataIsUploading, setDataIsUploading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (promise) {
      setDataIsUploading(true); // Deshabilitar el botón al hacer clic

      promise
        .then(() => {
          // La promesa se cumplió
          setIsSubmitted(true); // Mostrar el icono de verificación
          // Aquí puedes realizar otras acciones si es necesario
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setDataIsUploading(false); // Habilitar el botón en caso de error
          setIsTransitioning(true);
        });
    }
  }, [promise]);

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
  };

  return (
    <Button
      isDisabled={dataIsUploading}
      _hover={{ bg: isSubmitted ? '#40C390' : '#085AFF' }}
      bg={isSubmitted ? '#40C390' : '#0568FF'}
      type={isSubmitted ? 'button' : 'submit'}
      width={'100%'}
      fontWeight={'medium'}
      fontSize={'14px'}
      color={'white'}
      rounded={'xl'}
      transition="background-color 1s"
      className={`transition-button`}
      onAnimationEnd={handleTransitionEnd}
    >
      {isSubmitted ? (
        <MdCheck
          style={{ marginRight: '0.5rem', opacity: isTransitioning ? 0 : 1 }}
          className={`transition-icon ${isTransitioning ? 'fade-out' : 'fade-in'} ${isSubmitted ? 'move-left' : ''}`}
        />
      ) : dataIsUploading ? (
        <Spinner size="sm" color="white" />
      ) : (
        'Cargar'
      )}
      {isSubmitted && (
        <span className={`transition-label ${isSubmitted ? 'slide-in' : 'slide-out'}`}>Datos cargados</span>
      )}
    </Button>
  );
}
