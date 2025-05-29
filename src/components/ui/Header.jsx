'use client'
import { Flex, Box, Image, Drawer, Button, Portal, CloseButton } from "@chakra-ui/react";
import { FaShoppingCart } from "react-icons/fa";
import { useEffect, useState } from "react";
import { api } from "@/utils/axios";
import { FaAlignJustify } from "react-icons/fa";
import { MdOutlineDeliveryDining } from "react-icons/md";
import { IoFastFoodOutline } from "react-icons/io5";
import { GoGear } from "react-icons/go";
import { IconButton } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [open, setOpen] = useState(false)
  const [userRole, setUserRole] = useState(null);
  const [token, setToken] = useState(null);
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    setUserRole(null);
    setToken(null);
    router.push('/');
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setToken(token);
      if (token) {
        api.get("/usuario/info")
          .then(res => {
            setUserRole(res.data.resposta.role);
          })
          .catch(() => setUserRole(null));
      }
    }
  }, []);

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      px={8}
      py={4}
      bg="#dedede"
      boxShadow="sm"
      w="100%"
    >
      <Flex align="center" gap={2}>
        <Box as="button" onClick={() => router.push('/main')} p={0} bg="none" border="none">
          <Image src="/pizza.png" alt="Logo" h="50px" cursor="pointer" />
        </Box>
        {(userRole === "delivery" || userRole === 'admin') && (
          <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)} placement={'start'} size={'xs'}>
            <Drawer.Trigger asChild>
              <Box display="flex" alignItems="center" ml={2}>
                <Button
                  variant="outline"
                  size="sm"
                  background="red"
                  color="white"
                  borderRadius="2%"
                  _hover={{ background: 'red.600' }}
                >
                  <FaAlignJustify /> Abrir menu do entregador
                </Button>
              </Box>
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
      <Flex align="center" gap={4}>
        {token && (
          <IconButton bg={'#dedede'} onClick={() => router.push('/carrinho')}>
            <FaShoppingCart color='black' />
          </IconButton>
        )}
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