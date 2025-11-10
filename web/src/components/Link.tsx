import { HStack, InputGroup, Input, Flex } from "@chakra-ui/react";
import Table from "./Table";
import { Search } from "lucide-react";

export default function Links() {
  return (
    <Flex justify="start" alignItems="start" direction="column" gap={2}>
      <HStack justify="end">
        <InputGroup startElement={<Search />}>
          <Input
            placeholder="Search username, link..."
            borderRadius="full"
            size="xl"
          />
        </InputGroup>
      </HStack>
      <Table />
    </Flex>
  );
}
