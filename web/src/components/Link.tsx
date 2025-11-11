import { HStack, InputGroup, Input, Flex, Spinner } from "@chakra-ui/react";
import Table from "./Table";
import { Search } from "lucide-react";
import { swrFetcher } from "@/utils/swrFether";
import useSWR from "swr";

export default function Links() {
  const { data, isLoading } = useSWR("/download", swrFetcher);

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
      {isLoading && (
        <HStack gap="5">
          <Spinner size="md" />
        </HStack>
      )}
      <Table items={data?.results} />
    </Flex>
  );
}
