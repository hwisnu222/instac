import { HStack, InputGroup, Input, Flex, Spinner } from "@chakra-ui/react";
import Table from "./Table";
import { Search } from "lucide-react";
import { swrFetcher } from "@/utils/swrFether";
import useSWR from "swr";
import { useEffect, useState, type ChangeEvent } from "react";

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function Links() {
  const [search, setSearch] = useState("");
  const debouncedSearchTerm = useDebounce(search, 800);
  const { data, isLoading } = useSWR(
    `/download?q=${debouncedSearchTerm}`,
    swrFetcher,
  );

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <Flex justify="start" alignItems="start" direction="column" gap={2}>
      <HStack justify="end">
        <InputGroup startElement={<Search />}>
          <Input
            placeholder="Search username, link..."
            borderRadius="full"
            size="xl"
            onChange={handleChangeSearch}
          />
        </InputGroup>
      </HStack>
      {isLoading && (
        <HStack gap="5" justify="center" w="100%">
          <Spinner size="md" />
        </HStack>
      )}
      <Table items={data?.results} />
    </Flex>
  );
}
