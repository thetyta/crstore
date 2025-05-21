'use client'
import { Button, CloseButton, Drawer, Portal, Flex, Card, Image, Text, Box, Heading, Separator } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import Slider from "react-slick";
import React from "react";
import { api } from "@/utils/axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Main() {
  const [open, setOpen] = useState(false)
  const [userRole, setUserRole] = useState(null);
  const grouped = items.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    api.get("/usuario/info", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        console.log("Dados recebidos:", res.data);
        setUserRole(res.data.resposta.role);
        
      })
      .catch((err) => {
        console.error("Erro ao buscar usuário:", err);
        setUserRole(null);
      });
  }
}, []);
  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };
function RandomCirclesBackground({ count = 10 }) {
  const circles = Array.from({ length: count }).map((_, i) => {
    const size = Math.random() * 80 + 40; // menor: entre 40px e 120px
    const top = Math.random() * 95;       // pode ir até 95% da tela
    const left = Math.random() * 95;      // pode ir até 95% da tela
    const opacity = 1
    const color = ["#800000", "#ffcccc", ][Math.floor(Math.random() * 1)];
    return { size, top, left, opacity, color };
  });

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      w="100vw"
      h="100vh"
      zIndex={0}
      pointerEvents="none"
      overflow="hidden"
    >
      {circles.map((c, i) => (
        <Box
          key={i}
          position="absolute"
          borderRadius="full"
          bg={c.color}
          opacity={c.opacity}
          width={`${c.size}px`}
          height={`${c.size}px`}
          top={`${c.top}%`}
          left={`${c.left}%`}
          filter="blur(2px)"
        />
      ))}
    </Box>
  );
}

  return (
    <>
    <RandomCirclesBackground count={40} />
      {userRole === "delivery" && (
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
                  <Drawer.Title>Menu</Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                  <p>oi</p>
                </Drawer.Body>
                <Drawer.Footer></Drawer.Footer>
                <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Drawer.CloseTrigger>
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
      )}
      <Flex direction="column" align="center" minH="100vh" p={8} background={'#d57022'}>
        {Object.entries(grouped).map(([category, items]) => (
          <Box key={category} w="100%" maxW="1200px" mb={10}>
            <Heading size="lg" mb={4} color="white" background={'#ac4f11'} textAlign="center" rounded="md" position={"relative"}>{category}</Heading>
            <Separator mb={4} position={"relative"}/>
            <Box>
              <Slider {...sliderSettings}>
                {items.map((item) => (
                  <Box key={item.id} px={2}>
                    <Card.Root minW="300px" maxW="300px" overflow="hidden">
                      <Image
                        src={item.category === 'Pizza' ? '/pizzacalabreso.jpg' : 'https://www.sabornamesa.com.br/media/k2/items/cache/bf1e20a4462b71e3cc4cece2a8c96ac8_XL.jpg'}
                        alt={item.name}
                      />
                      <Card.Body gap="2">
                        <Card.Title>{item.name}</Card.Title>
                        <Card.Description>
                          {item.category}
                          {item.description && <span fontSize="sm" color="gray.500">{item.description}</span>}
                        </Card.Description>
                        <Text textStyle="2xl" fontWeight="medium" letterSpacing="tight" mt="2">
                          R${item.price}
                        </Text>
                      </Card.Body>
                      <Card.Footer gap="2">
                        <Button variant="solid">Buy now</Button>
                        <Button variant="ghost">Add to cart</Button>
                      </Card.Footer>
                    </Card.Root>
                  </Box>
                ))}
              </Slider>
            </Box>
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
  { id: 9, name: "Veggie Burguer", category: "Hamburguer", price: 30.99, description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Suscipit itaque, officiis ut id autem dicta, asperiores nulla totam, ex eligendi sequi nihil. Praesentium, assumenda molestiae vero totam in incidunt eum.' },
  { id: 10, name: "Portuguesa2", category: "Pizza", price: 55.99, description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Suscipit itaque, officiis ut id autem dicta, asperiores nulla totam, ex eligendi sequi nihil. Praesentium, assumenda molestiae vero totam in incidunt eum.' },
]