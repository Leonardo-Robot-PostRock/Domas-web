"use client";
import { IconButton, IconButtonProps } from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

interface Props extends Omit<IconButtonProps, "icon"> {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const CustomIconButton = ({ isOpen, onOpen, onClose, ...rest }: Props) => {
  return (
    <IconButton
      size={"md"}
      icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
      {...rest}
    />
  );
};

export default CustomIconButton;
