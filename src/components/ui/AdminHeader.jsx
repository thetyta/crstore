'use client'
import { Flex, Box, Button } from "@chakra-ui/react";
import Link from "next/link";

const crudPages = [
  { name: "Página Inicial", path: "/main"},
  { name: "Categorias", path: "/admin/category" },
  { name: "Cupons", path: "/admin/cupom" },
  { name: "Endereços", path: "/admin/address" },
  { name: "Métodos de Pagamento", path: "/admin/payment" },
  { name: "Pedidos", path: "/admin/order" },
  { name: "Produtos", path: "/admin/products" },
  { name: "Usuários", path: "/admin/user" },
];

export default function AdminHeader() {
  return (
    <Flex
      as="nav"
      align="center"
      justify="center"
      gap={6}
      px={8}
      py={4}
      bg="#222"
      color="white"
      boxShadow="sm"
      w="100%"
    >
      {crudPages.map((page) => (
        <Box key={page.path}>
          <Link href={page.path} passHref>
            <Button as="span" variant="ghost" colorScheme="red" color="white">
              {page.name}
            </Button>
          </Link>
        </Box>
      ))}
    </Flex>
  );
}