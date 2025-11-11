import {
  Table as ChakraTable,
  IconButton,
  HStack,
  Badge,
  Link,
} from "@chakra-ui/react";
import { Delete, View } from "lucide-react";

type TableProps = {
  id: number;
  url: string;
  status: string;
  username: string;
};

export default function Table({ items }: { items: TableProps[] }) {
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
          {items?.map((item) => (
            <ChakraTable.Row key={item.id}>
              <ChakraTable.Cell>{item.username}</ChakraTable.Cell>
              <ChakraTable.Cell>{item.url}</ChakraTable.Cell>
              <ChakraTable.Cell>
                <Badge colorPalette="pink">{item.status}</Badge>{" "}
              </ChakraTable.Cell>
              <ChakraTable.Cell textAlign="end">
                <HStack gap={2} justify="end">
                  <IconButton variant="outline" borderRadius="full">
                    <Delete />
                  </IconButton>

                  <Link href={item.url} target="_blank">
                    <IconButton borderRadius="full">
                      <View />
                    </IconButton>
                  </Link>
                </HStack>
              </ChakraTable.Cell>
            </ChakraTable.Row>
          ))}
        </ChakraTable.Body>
      </ChakraTable.Root>
    </ChakraTable.ScrollArea>
  );
}
