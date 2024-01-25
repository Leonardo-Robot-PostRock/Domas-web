import { NavMenuItemProps } from "@/types/NavMenuItemProps/navMenuItemProps";

import { Flex, Text } from "@chakra-ui/react";
import Link from "next/link";

const NavMenuItem = ({ children }: NavMenuItemProps) => (
  <Link href={children.link} passHref>
    <Flex
      alignItems={"center"}
      bg={children.selected ? "#2F3A44" : "white"}
      color={children.selected ? "white" : "#2F3A44"}
      cursor={"pointer"}
      gap={2}
      m={1}
      p={2}
      borderRadius={"20vh"}
      transition={".3s"}
      _hover={{
        bg: "#2F3A44",
        color: "white",
      }}
    >
      {children.icon ? children.icon : null}
      <Text>{children.title}</Text>
    </Flex>
  </Link>
);

export default NavMenuItem;
