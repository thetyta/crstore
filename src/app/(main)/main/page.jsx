'use client'
import { Button, CloseButton, Drawer, Portal, Flex, Card, Image, Text, Box, Heading, Separator } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import Slider from "react-slick";
import React from "react";
import { api } from "@/utils/axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Main() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get("/produto"),
          api.get("/categoria"),
        ]);
        setProdutos(prodRes.data.data || []);
        setCategorias(catRes.data.data || []);
      } catch (err) {
        setProdutos([]);
        setCategorias([]);
      }
    }
    fetchData();
  }, []);

  // Agrupa produtos por categoria
  const grouped = categorias.reduce((acc, cat) => {
    acc[cat.name] = produtos.filter(prod => prod.idCategory === cat.id);
    return acc;
  }, {});

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

  return (
    <>
      <Flex direction="column" align="center" minH="100vh" p={8} background={'#ebebeb'}>
        {Object.entries(grouped).map(([category, items]) => (
          items.length > 0 && (
            <Box key={category} w="100%" maxW="1200px" mb={10}>
              <Heading size="lg" mb={4} color="white" background={'#b50000'} textAlign="center" rounded="md" position={"relative"}>{category}</Heading>
              <Separator mb={4} position={"relative"}/>
              <Box
                sx={{
                  ".slick-prev:before, .slick-next:before": {
                    color: "#000000",
                    fontSize: "30px",
                  },
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Slider {...sliderSettings}>
                  {items.map((item) => (
                    <Box key={item.id} px={2}>
                      <Card.Root minW="300px" maxW="300px" overflow="hidden">
                        <Image
                          src={item.imageURL ? item.imageURL : "/placeholder.jpg"}
                          alt={item.name}
                        />
                        <Card.Body gap="2">
                          <Card.Title>{item.name}</Card.Title>
                          <Card.Description>
                            {item.description && (
                              <span style={{ fontSize: "sm", color: "gray.500", wordBreak: "break-word", whiteSpace: "pre-line" }}>
                                {item.description}
                              </span>
                            )}
                          </Card.Description>
                          <Text textStyle="2xl" fontWeight="medium" letterSpacing="tight" mt="2">
                            {item.price} conto
                          </Text>
                        </Card.Body>
                        <Card.Footer gap="2">
                          <Button variant="solid">Adicionar no carrinho</Button>
                        </Card.Footer>
                      </Card.Root>
                    </Box>
                  ))}
                </Slider>
              </Box>
            </Box>
          )
        ))}
      </Flex>
    </>
  )
}