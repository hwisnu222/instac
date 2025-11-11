import { useTransition } from "react";
import {
  Table as ChakraTable,
  IconButton,
  HStack,
  Badge,
  Link,
  Dialog,
  Button,
  CloseButton,
  Portal,
} from "@chakra-ui/react";
import { Delete, View } from "lucide-react";
import { mutate } from "swr";
import { toaster } from "./ui/toaster";
import { API_BASE } from "@/config/api";

type TableProps = {
  id: number;
  url: string;
  status: string;
  username: string;
};

export default function Table({ items }: { items: TableProps[] }) {
  const [isPending, startTransition] = useTransition();

  const handleRemoveList = (id: number) => {
    startTransition(async () => {
      try {
        await API_BASE.delete(`/download/${id}`);
        mutate("/download");
        toaster.create({
          description: "item deleted successfully",
          type: "success",
        });
      } catch (error) {
        console.log(error);
        toaster.create({
          description: "failed delete item",
          type: "error",
        });
      }
    });
  };
  return (
    <ChakraTable.ScrollArea
      borderWidth="1px"
      rounded="md"
      height="600px"
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
                <Badge colorPalette={item.status === "done" ? "green" : "red"}>
                  {item.status}
                </Badge>{" "}
              </ChakraTable.Cell>
              <ChakraTable.Cell textAlign="end">
                <HStack gap={2} justify="end">
                  <Dialog.Root>
                    <Dialog.Trigger asChild>
                      <IconButton variant="outline" borderRadius="full">
                        <Delete />
                      </IconButton>
                    </Dialog.Trigger>
                    <Portal>
                      <Dialog.Backdrop />
                      <Dialog.Positioner>
                        <Dialog.Content>
                          <Dialog.Header>
                            <Dialog.Title>Remove?</Dialog.Title>
                          </Dialog.Header>
                          <Dialog.Body>
                            <p>Do you want remove this item? </p>
                          </Dialog.Body>
                          <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                              <Button variant="outline">Cancel</Button>
                            </Dialog.ActionTrigger>

                            <Dialog.ActionTrigger asChild>
                              <Button
                                onClick={() => handleRemoveList(item.id)}
                                disabled={isPending}
                                colorPalette="red"
                              >
                                Remove
                              </Button>{" "}
                            </Dialog.ActionTrigger>
                          </Dialog.Footer>
                          <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                          </Dialog.CloseTrigger>
                        </Dialog.Content>
                      </Dialog.Positioner>
                    </Portal>
                  </Dialog.Root>

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
