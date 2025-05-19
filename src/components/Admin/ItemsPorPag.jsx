"use client"
import { Portal, Select, createListCollection } from "@chakra-ui/react"

export default function ItemsPorPag({
    value,
    setValue,
    setItemsPerPage,
    setCurrentPage
}) {
  return (
    <Select.Root
        collection={valores}
        width="60px"
        value={value}
        onValueChange={(e) => {
            setValue(e.value);
            setItemsPerPage(Number(e.value));
            setCurrentPage(1)
        }}
    >
      <Select.Label></Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Items por página" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {valores.items.map((valor) => (
              <Select.Item key={valor.value}
              item={valor}
              >
                {valor.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  )
}

const valores = createListCollection({
    items: [
      { label: "5", value: 5 },
      { label: "10", value: 10 },
      { label: "15", value: 15},
      { label: "20", value: 20 },
    ],
  })
  