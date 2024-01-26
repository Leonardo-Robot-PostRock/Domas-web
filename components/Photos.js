import { useState } from 'react';
import { Flex, Text, Image, Portal, Box, Button, IconButton, Spinner, Tooltip } from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';
import {
  AiOutlineZoomIn,
  AiOutlineZoomOut,
  AiOutlineRedo,
  AiOutlineClose,
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlinePlus,
  AiOutlineDelete,
} from 'react-icons/ai';
import axios from 'axios';
import dayjs from 'dayjs';
import { toastError, toastSuccess } from './Toast';
import { FilePond, registerPlugin } from 'react-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileEncode,
  FilePondPluginFileValidateType
);

const TicketPhotos = ({ photos, ticket_id, reload }) => {
  const [photo, setPhoto] = useState(null);
  const [index, setIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  const handleShowPhoto = (i) => {
    setPhoto(photos[i]);
    setIndex(i);
  };

  const handleShowDeleteModal = (i) => {
    setDeleteIndex(i);
    onDeleteOpen();
  };

  const handleCloseDeleteModal = () => {
    setDeleteIndex(null);
    onDeleteClose();
  };

  const handleClosePhoto = () => {
    setPhoto(null);
  };

  return (
    <Flex direction={'row'} flexWrap={'wrap'} alignItems={'center'} gap={4} p={4}>
      {photos && photos.length > 0 ? (
        photos.map((p, i) => (
          <Tooltip
            key={i}
            label={`Subido por ${p.user} el ${dayjs(p.date).tz('America/Argentina/Mendoza').format('DD/MM/YYYY HH:mm')}`}
          >
            <Box
              position={'relative'}
              rounded={'lg'}
              zIndex={'100'}
              transition={'all .2s'}
              _hover={{ transform: 'scale(1.05)', boxShadow: '0px 0px 10px 2px rgba(0,0,0,0.4)' }}
            >
              <Image
                src={`data:image/jpeg;base64,${p.base64Image}`}
                alt="image"
                boxSize="150px"
                objectFit={'fill'}
                rounded={'lg'}
                border={'2px solid #3973ac'}
                bg={'white'}
                p={2}
                onClick={() => handleShowPhoto(i)}
                cursor={'pointer'}
              />
              <IconButton
                aria-label="Delete"
                icon={<AiOutlineDelete />}
                colorScheme="red"
                rounded={'full'}
                size={'xs'}
                style={{ position: 'absolute', top: '3px', right: '3px' }}
                onClick={() => handleShowDeleteModal(i)}
              />
            </Box>
          </Tooltip>
        ))
      ) : (
        <Text fontSize={'sm'}>No hay fotos</Text>
      )}
      <IconButton size={'md'} isRound={true} colorScheme={'green'} icon={<AiOutlinePlus />} onClick={onOpen} />

      <UploadPhoto isOpen={isOpen} onClose={onClose} ticket_id={ticket_id} reload={reload} />

      {deleteIndex != null && (
        <DeletePhoto
          isOpen={isDeleteOpen}
          onClose={handleCloseDeleteModal}
          ticket_id={ticket_id}
          photo_id={photos[deleteIndex].id}
          reload={reload}
        />
      )}

      {photo && (
        <Portal>
          <Box display={'block'} position={'fixed'} top={'0'} left={'0'} w={'99vw'} bg={'#00000080'} zIndex={'100'}>
            <TransformWrapper initialScale={1}>
              <FullSizeControls
                onClose={handleClosePhoto}
                total={photos.length - 1}
                current={index}
                changePhoto={handleShowPhoto}
              />
              <TransformComponent>
                <Box justifyContent={'center'} alignItems={'center'} w={'100vw'} h={'95vh'} pb={3}>
                  <Image
                    src={`data:image/jpeg;base64,${photo.base64Image}`}
                    alt="image"
                    boxSize="99%"
                    objectFit={'contain'}
                    objectPosition={'center'}
                    rounded={'lg'}
                    p={2}
                    onClick={handleClosePhoto}
                    cursor={'pointer'}
                  />
                </Box>
              </TransformComponent>
            </TransformWrapper>
          </Box>
        </Portal>
      )}
    </Flex>
  );
};

const FullSizeControls = ({ onClose, total, current, changePhoto }) => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  const handleChangePhoto = (action) => {
    if (action === 'next') {
      if (current < total) {
        changePhoto(current + 1);
      }
    } else if (action === 'prev') {
      if (current > 0) {
        changePhoto(current - 1);
      }
    }
  };

  return (
    <Box display={'flex'} flexDirection={'row'} justifyContent={'space-evenly'} alignItems={'center'} gap={3} py={2}>
      <IconButton
        icon={<AiOutlineLeft size={25} />}
        size={'lg'}
        isRound={true}
        colorScheme="yellow"
        isDisabled={current === 0}
        onClick={() => handleChangePhoto('prev')}
      ></IconButton>

      <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} gap={3}>
        <IconButton
          icon={<AiOutlineRedo size={25} />}
          size={'lg'}
          isRound={true}
          colorScheme="green"
          onClick={() => resetTransform()}
        ></IconButton>
        <IconButton
          icon={<AiOutlineZoomIn size={25} />}
          size={'lg'}
          isRound={true}
          colorScheme="facebook"
          onClick={() => zoomIn()}
        ></IconButton>
        <IconButton
          icon={<AiOutlineZoomOut size={25} />}
          size={'lg'}
          isRound={true}
          colorScheme="facebook"
          onClick={() => zoomOut()}
        ></IconButton>
        <IconButton
          icon={<AiOutlineClose size={25} />}
          size={'lg'}
          isRound={true}
          colorScheme="red"
          onClick={onClose}
        ></IconButton>
      </Box>

      <IconButton
        icon={<AiOutlineRight size={25} />}
        size={'lg'}
        isRound={true}
        colorScheme="yellow"
        isDisabled={current === total}
        onClick={() => handleChangePhoto('next')}
      ></IconButton>
    </Box>
  );
};

const UploadPhoto = ({ isOpen, onClose, ticket_id, reload }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    const userInfo = JSON.parse(localStorage.getItem('user'));

    const data = {
      ticket_id: ticket_id,
      mesa_username: userInfo.mesa_username,
      photos: [],
    };

    files.forEach((file) => {
      let fileEncodeBase64String = file.getFileEncodeBase64String();

      data.photos.push(fileEncodeBase64String);
    });

    axios
      .post(`/api/mesa/ticket/photos?ticket_id=${ticket_id}`, { data: data })
      .then((res) => {
        toastSuccess('Las fotos han sido cargadas');
        setFiles([]);
        reload(new Date());
        handleOnClose();
      })
      .catch((err) => {
        //console.log(err);
        toastError('Error al cargar las fotos');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleOnClose = () => {
    setFiles([]);
    onClose();
  };

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={handleOnClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Cargar Imágenes</ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={0}>
          {loading ? (
            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} my={10} h={'100%'} w={'100%'}>
              <Spinner />
              <Text ml={3}>Subiendo...</Text>
            </Box>
          ) : (
            <FilePond
              files={files}
              onupdatefiles={setFiles}
              allowMultiple={true}
              maxFiles={3}
              name="files"
              labelIdle='Arrastra y suelta tus imágenes o <span class="filepond--label-action">Abrir Buscador</span>'
              credits={true}
              allowFileTypeValidation={true}
              acceptedFileTypes={['image/png', 'image/jpeg', 'image/jpg']}
              labelFileTypeNotAllowed="El tipo de archivo no es válido"
              fileValidateTypeLabelExpectedTypes="Esperados: PNG, JPG, JPEG"
              maxTotalFileSize="3MB"
              labelMaxTotalFileSizeExceeded="El conjunto de archivos excede el tamaño máximo permitido"
              labelMaxTotalFileSize="Tamaño máximo: 3MB"
            />
          )}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit} isLoading={loading}>
            {' '}
            Subir{' '}
          </Button>
          <Button onClick={handleOnClose} isDisabled={loading}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const DeletePhoto = ({ isOpen, onClose, ticket_id, photo_id, reload }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = (photo_id) => {
    setLoading(true);
    axios
      .delete(`/api/mesa/ticket/photos?ticket_id=${ticket_id}&photo_id=${photo_id}`)
      .then((res) => {
        toastSuccess('La imagen ha sido borrada');
        reload(new Date());
        onClose();
      })
      .catch((err) => {
        //console.log(err);
        toastError('Error al borrar la imagen');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirmar Acción</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          {loading ? (
            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} my={10} h={'100%'} w={'100%'}>
              <Spinner />
              <Text ml={3}>Eliminando...</Text>
            </Box>
          ) : (
            <Text>¿Seguro que quieres borrar esta imagen?</Text>
          )}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={() => handleDelete(photo_id)} isLoading={loading}>
            Borrar
          </Button>
          <Button variant="ghost" onClick={onClose} isDisabled={loading}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TicketPhotos;
