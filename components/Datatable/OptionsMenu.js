import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    PopoverArrow,
    IconButton,
    Button,
    Stack,
    Flex,
    Text,
} from '@chakra-ui/react';

import { BsThreeDots } from 'react-icons/bs';

export default function OptionsMenu ({ items }) {
    return (

        <Flex justifyContent="center">
            <Popover placement="bottom" isLazy>
                <PopoverTrigger>
                    <IconButton
                        aria-label="More server options"
                        icon={<BsThreeDots />}
                        variant="solid"
                        w="fit-content"
                        bg={'#F4F7FE'}
                    />
                </PopoverTrigger>
                <PopoverContent w="fit-content" _focus={{ boxShadow: 'none' }}>
                    <PopoverArrow />
                    <PopoverBody>
                        <Stack>
                            {
                                items.map((item, index) => (<Button
                                    key={index}
                                    w="194px"
                                    variant="ghost"
                                    rightIcon={item.rightIcon}
                                    justifyContent="space-between"
                                    fontWeight="normal"
                                    fontSize="sm">
                                    <Text>
                                        {item.label}
                                    </Text>
                                </Button>))
                            }

                        </Stack>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </Flex>
    );
}