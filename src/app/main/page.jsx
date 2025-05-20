'use client'
import { Button, CloseButton, Drawer, Portal, Flex, Card, Image, Text, SimpleGrid, Box, Heading, Separator } from "@chakra-ui/react"
import { useState } from "react"

export default function Main() {
  const [open, setOpen] = useState(false)

  // Agrupa os itens por categoria
  const grouped = items.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <>
      <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)} placement={'start'} size={'xs'}>
        <Drawer.Trigger asChild>
          <Button variant="outline" size="sm">
            Open Drawer
          </Button>
        </Drawer.Trigger>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>Drawer Title</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <p>
                </p>
              </Drawer.Body>
              <Drawer.Footer>
              </Drawer.Footer>
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
      <Flex direction="column" align="center" minH="100vh" p={8}>
        {Object.entries(grouped).map(([category, items]) => (
          <Box key={category} w="100%" maxW="1200px" mb={10}>
            <Heading size="lg" mb={4} color="gray.700">{category}</Heading>
            <Separator mb={4} />
            <SimpleGrid columns={[1, 2, 3]} spacing={6}>
              {items.map((item) => (
                <Card.Root key={item.id} maxW="sm" overflow="hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                    alt={item.name}
                  />
                  <Card.Body gap="2">
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Description>
                      Categoria: {item.category}
                    </Card.Description>
                    <Text textStyle="2xl" fontWeight="medium" letterSpacing="tight" mt="2">
                      ${item.price}
                    </Text>
                  </Card.Body>
                  <Card.Footer gap="2">
                    <Button variant="solid">Buy now</Button>
                    <Button variant="ghost">Add to cart</Button>
                  </Card.Footer>
                </Card.Root>
              ))}
            </SimpleGrid>
          </Box>
        ))}
      </Flex>
    </>
  )
}

const items = [
  { id: 1, name: "Calabresa", category: "Pizza", price: 49.99 },
  { id: 2, name: "Mussarela", category: "Pizza", price: 47.99 },
  { id: 3, name: "Portuguesa", category: "Pizza", price: 52.99 },
  { id: 4, name: "Cheddar Burguer", category: "Hamburguer", price: 29.99 },
  { id: 5, name: "Bacon Burguer", category: "Hamburguer", price: 32.99 },
  { id: 6, name: "Salada Burguer", category: "Hamburguer", price: 27.99 },
  { id: 7, name: "Duplo Burguer", category: "Hamburguer", price: 35.99 },
  { id: 8, name: "Frango Burguer", category: "Hamburguer", price: 28.99 },
  { id: 9, name: "Veggie Burguer", category: "Hamburguer", price: 30.99 },
  { id: 10, name: "Laptop", category: "Eletrônicos", price: 999.99 },
  { id: 11, name: "Headphones", category: "Eletrônicos", price: 199.99 },
]