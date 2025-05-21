import { Flex, Box, Image, Input, InputGroup } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";

export default function Header() {
  return (
    <Flex
      as="header"
      align="center"
      position={'relative'}
      zIndex={1}
      justify="space-between"
      px={8}
      py={4}
      bg="#983e09"
      boxShadow="sm"
      w="100%"
    >
      <Box>
        <Image
          src="/pizza.png"
          alt="Logo"
          h="50px"
        />
      </Box>
      <Box flex="1" maxW="500px" mx={8} position="relative">
        {/* Ícone fora do Input */}
        <Box position="absolute" left="12px" top="50%" transform="translateY(-50%)" zIndex="1">
          <FaSearch color="black" />
        </Box>
        <Input
          type="text"
          placeholder="Pesquisar..."
          bg="gray.100"
          _placeholder={{ color: "gray.500" }}
          color={'black'}
          pl="2.2rem" // espaço para o ícone
        />
      </Box>
      <Box position="absolute" right="20px" top="50%" transform="translateY(-50%)">
        <FaShoppingCart color='black'/>
      </Box>
    </Flex>
  );
}