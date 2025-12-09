import {
  HStack,
  InputGroup,
  Input,
  Flex,
  Spinner,
  Pagination,
  ButtonGroup,
  IconButton,
} from "@chakra-ui/react";
import Table from "./Table";
import { Search } from "lucide-react";
import { swrFetcher } from "@/utils/swrFether";
import useSWR from "swr";
import { useEffect, useState, type ChangeEvent } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import type { ChangePage } from "./Gallery";

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

export default function LinkList() {
  const [search, setSearch] = useState("");
  const debouncedSearchTerm = useDebounce(search, 800);
  const [page, setPage] = useState(1);

  const params = new URLSearchParams({
    page: page.toString(),
  });

  const { data, isLoading } = useSWR(
    `/download?q=${debouncedSearchTerm}&${params}`,
    swrFetcher,
  );

  const handleChangePage = (value: ChangePage) => {
    setPage(value.page);
  };
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
      <Table items={data?.items} />
      <HStack justify="center" mt={8} w="100%">
        <Pagination.Root
          count={data?.total}
          pageSize={data?.size}
          defaultPage={1}
          onPageChange={handleChangePage}
        >
          <ButtonGroup variant="outline" size="lg">
            <Pagination.PrevTrigger asChild borderRadius="full">
              <IconButton>
                <LuChevronLeft />
              </IconButton>
            </Pagination.PrevTrigger>

            <Pagination.Items
              render={(page) => (
                <IconButton
                  variant={{ base: "outline", _selected: "solid" }}
                  borderRadius="full"
                >
                  {page.value}
                </IconButton>
              )}
            />

            <Pagination.NextTrigger asChild borderRadius="full">
              <IconButton>
                <LuChevronRight />
              </IconButton>
            </Pagination.NextTrigger>
          </ButtonGroup>
        </Pagination.Root>
      </HStack>
    </Flex>
  );
}
