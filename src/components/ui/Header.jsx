'use client'
import { Flex, Box, Image, Input, Drawer, Button, Portal, CloseButton } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { use, useEffect, useState } from "react";
import { api } from "@/utils/axios";
import { FaAlignJustify } from "react-icons/fa";
import { MdOutlineDeliveryDining } from "react-icons/md";
import { IoFastFoodOutline } from "react-icons/io5";
import { GoGear } from "react-icons/go";
import { IconButton } from "@chakra-ui/react"

export default function Header() {
  const [open, setOpen] = useState(false)
  const [userRole, setUserRole] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserRole(null);
    window.location.href = '/';
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.get("/usuario/info", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          setUserRole(res.data.resposta.role);
        })
        .catch(() => setUserRole(null));
    }
  }, []);

  return (
    <Flex
      as="header"
      align="center"
      position={'relative'}
      zIndex={1}
      justify="space-between"
      px={8}
      py={4}
      bg="#dedede"
      boxShadow="sm"
      w="100%"
    >
      <Flex align="center" gap={2}>
        <Image src="/pizza.png" alt="Logo" h="50px" />
        {(userRole === "delivery" || userRole === 'admin') && (
          <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)} placement={'start'} size={'xs'}>
            <Drawer.Trigger asChild>
              <Button variant="outline" size="sm" background={'red'} color={'white'} borderRadius={'2%'} _hover={{ background: 'red.600' }}>
                <FaAlignJustify /> Abrir menu do entregador
              </Button>
            </Drawer.Trigger>
            <Portal>
              <Drawer.Backdrop />
              <Drawer.Positioner>
                <Drawer.Content>
                  <Drawer.Header>
                    <Drawer.Title>Menu do entregador</Drawer.Title>
                  </Drawer.Header>
                  <Drawer.Body>
                    <Box mb={4}>
                      <Button background={'red'} color={'white'} onClick={() => window.location.href = '/entregas'}>
                        <MdOutlineDeliveryDining />
                        Minhas Entregas
                      </Button>
                    </Box>
                    <Box>
                      <Button mb={4} background={'red'} color={'white'} onClick={() => window.location.href = '/pedidos'}>
                        <IoFastFoodOutline />
                        Pedidos
                      </Button>
                    </Box>
                    {userRole === 'admin' && (
                      <Box>
                        <Button mb={4} background={'red'} color={'white'} onClick={() => window.location.href = '/admin'}>
                          <GoGear />
                          CRUDS
                        </Button>
                      </Box>
                    )}
                  </Drawer.Body>
                  <Drawer.Footer>
                    <Box>
                      <Button mb={4} background={'red'} color={'white'}>
                        <GoGear />
                        Configurações
                      </Button>
                    </Box>
                  </Drawer.Footer>
                  <Drawer.CloseTrigger asChild>
                    <CloseButton size="sm" />
                  </Drawer.CloseTrigger>
                </Drawer.Content>
              </Drawer.Positioner>
            </Portal>
          </Drawer.Root>
        )}
      </Flex>
      <Box
        flex="none"
        maxW="320px"
        w="100%"
        mx="auto"
        position="relative"
        alignSelf="center"
      >
        <Box position="absolute" left="12px" top="50%" transform="translateY(-50%)" zIndex="1">
          <FaSearch color="black" />
        </Box>
        <Input
          type="text"
          placeholder="Pesquisar..."
          bg="gray.100"
          _placeholder={{ color: "gray.500" }}
          color={'black'}
          pl="2.2rem"
          width="100%"
        />
      </Box>
      <Flex align="center" gap={4} position="absolute" right="20px" top="50%" transform="translateY(-50%)">
        <IconButton bg={'#dedede'} onClick={() => window.location.href = '/carrinho'}>
          <FaShoppingCart color='black' />
        </IconButton>
        {userRole && (
          <Button
            background="red"
            color="white"
            variant="outline"
            onClick={handleLogout}
          >
            Sair
          </Button>
        )}
        {!userRole && (
          <Button
            background="red"
            color="white"
            variant="outline"
            onClick={() => window.location.href = '/'}
          >
            Login
          </Button>
        )}
      </Flex>
    </Flex>
  );
}