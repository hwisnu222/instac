import {
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Input,
  Button,
  Flex,
  InputGroup,
  Box,
  Card,
  Image,
} from "@chakra-ui/react";
import "./App.css";
import Table from "./components/Table";
import { Link2, Download, Search, Github } from "lucide-react";

function App() {
  return (
    <Box pb={8}>
      <Flex
        justify="space-between"
        p={4}
        alignItems="center"
        position="sticky"
        top={0}
      >
        <Heading>Fagram</Heading>
        <Button colorScheme="red" borderRadius="full">
          <Github />
          Github
        </Button>
      </Flex>
      <Container>
        <VStack gap={4} w="100%" pt={20} mb={8}>
          <Heading className="sora-600" size="5xl">
            Instagram Downloader
          </Heading>
          <Text w="50%" textAlign="center">
            We all know that feeling: seeing the perfect tutorial, a hilarious
            Reel, or a stunning photo... and then losing it forever in your
            saved list
          </Text>
          <InputGroup
            startElement={<Link2 />}
            endElement={
              <Button
                colorPalette="pink.600"
                variant="solid"
                borderRadius="full"
              >
                <Download />
                Download
              </Button>
            }
            pr={1}
          >
            <Input
              placeholder="https://instagram.com/p/G453HGDH/"
              size="xl"
              type="url"
              borderRadius="full"
            />
          </InputGroup>
        </VStack>
        <Flex gap={4} mb={8}>
          <Card.Root maxW="sm" overflow="hidden">
            <Image
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
              alt="Green double couch with wooden legs"
              mb={2}
            />
            <Card.Footer gap="2">
              <Button variant="solid" w="100%" borderRadius="full">
                <Download />
                Download
              </Button>
            </Card.Footer>
          </Card.Root>
        </Flex>

        <Flex
          w="100%"
          gap={4}
          direction="column"
          justify="start"
          alignItems="start"
        >
          <Heading>History</Heading>
          <HStack justify="end">
            <InputGroup startElement={<Search />}>
              <Input placeholder="Search username, link..." />
            </InputGroup>
          </HStack>
          <Table />
        </Flex>
      </Container>
    </Box>
  );
}

export default App;
