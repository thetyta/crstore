'use client'
import { Button, CloseButton, Drawer, Portal, Flex, Card, Image, Text, Box, Heading, Separator, HStack, Skeleton, SkeletonCircle, SkeletonText, Stack, Toast } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import Slider from "react-slick";
import React from "react";
import { toaster } from '@/components/ui/toaster';
import { api } from "@/utils/axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CardSkeleton = () => (
  <Box px={2}>
    <Card.Root minW="300px" maxW="300px" overflow="hidden">
      <Skeleton height="180px" width="100%" />
      <Card.Body gap="2">
        <Skeleton height="24px" width="70%" mb={2} />
        <SkeletonText noOfLines={2} spacing="2" width="90%" />
        <Skeleton height="20px" width="40%" mt={2} />
      </Card.Body>
      <Card.Footer gap="2">
        <Skeleton height="36px" width="80%" />
      </Card.Footer>
    </Card.Root>
  </Box>
);

export default function Main() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleAddToCart = async (item) => {
    if (!item || !item.id) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    console.log('ADICIONANDO AO CARRINHO: ', item);
    
    
    try {
      await api.post(
        "/usuario/carrinho",
        { idProduct: item.id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toaster.create({ title: "Adicionado ao carrinho!", status: "success" });
    } catch (err) {
      console.log('ERRO: ', err);
      console.log('ITEM COMPLETO: ', item);
      console.log("ID DO ITEM: ", item.id);
      toaster.create({ title: "Erro ao adicionar ao carrinho", status: "error" });
    }
  };

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
      } finally {
        setLoading(false);
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
      <Flex direction="column" align="center" minH="100vh" p={8} background={'#ebebeb'}>
        {loading ? (
          Object.entries({ "Carregando": [1, 2, 3] }).map(([category, items]) => (
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
                  {items.map((_, idx) => (
                    <CardSkeleton key={idx} />
                  ))}
                </Slider>
              </Box>
            </Box>
          ))
        ) : (
          Object.entries(grouped).map(([category, items]) => (
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
                      item && (
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
                              <Button
                                variant="solid"
                                onClick={() => handleAddToCart(item)}
                              >
                                Adicionar no carrinho
                              </Button>
                            </Card.Footer>
                          </Card.Root>
                        </Box>
                      )
                    ))}
                  </Slider>
                </Box>
              </Box>
            )
          ))
        )}
      </Flex>
  )
}