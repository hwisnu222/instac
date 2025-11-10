import { Table as ChakraTable, IconButton, HStack } from "@chakra-ui/react";
import { Delete, View } from "lucide-react";

export default function Table() {
  return (
    <ChakraTable.ScrollArea
      borderWidth="1px"
      rounded="md"
      minHeight="160px"
      w="100%"
      borderRadius="xl"
    >
      <ChakraTable.Root size="lg" stickyHeader>
        <ChakraTable.Header>
          <ChakraTable.Row bg="bg.subtle">
            <ChakraTable.ColumnHeader>Username</ChakraTable.ColumnHeader>
            <ChakraTable.ColumnHeader>Link</ChakraTable.ColumnHeader>
            <ChakraTable.ColumnHeader>Status</ChakraTable.ColumnHeader>
            <ChakraTable.ColumnHeader textAlign="end">
              Action
            </ChakraTable.ColumnHeader>
          </ChakraTable.Row>
        </ChakraTable.Header>

        <ChakraTable.Body>
          {items.map((item) => (
            <ChakraTable.Row key={item.id}>
              <ChakraTable.Cell>{item.username}</ChakraTable.Cell>
              <ChakraTable.Cell>{item.link}</ChakraTable.Cell>
              <ChakraTable.Cell>{item.status}</ChakraTable.Cell>
              <ChakraTable.Cell textAlign="end">
                <HStack gap={2} justify="end">
                  <IconButton variant="outline" borderRadius="full">
                    <Delete />
                  </IconButton>

                  <IconButton borderRadius="full">
                    <View />
                  </IconButton>
                </HStack>
              </ChakraTable.Cell>
            </ChakraTable.Row>
          ))}
        </ChakraTable.Body>
      </ChakraTable.Root>
    </ChakraTable.ScrollArea>
  );
}

const items = [
  {
    id: 1,
    username: "user_1",
    link: "https://instagram.com/p/safsa323KJ",
    status: "done",
  },
  {
    id: 1,
    username: "user_2",
    link: "https://instagram.com/p/safsa323KJ",
    status: "done",
  },
  {
    id: 1,
    username: "user_3",
    link: "https://instagram.com/p/safsa323KJ",
    status: "done",
  },
];
