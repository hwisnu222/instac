import {
  Container,
  VStack,
  Heading,
  Text,
  Input,
  Button,
  Flex,
  InputGroup,
  Box,
  Highlight,
  Tabs,
} from "@chakra-ui/react";
import "./App.css";
import {
  Link2,
  Download,
  Github,
  ListChevronsDownUp,
  GalleryThumbnails,
} from "lucide-react";
import Links from "./components/Links";
import Gallery from "./components/Gallery";
import { useState, useTransition, type ChangeEvent } from "react";
import { API_BASE } from "./config/api";
import { toaster } from "./components/ui/toaster";

function App() {
  const [isPending, startTransition] = useTransition();
  const [url, setUrl] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleSubmit = () => {
    try {
      startTransition(async () => {
        const res = await API_BASE.post("/download", {
          url,
        });
        console.log(res);
        toaster.create({
          description: "Post saved successfully",
          type: "success",
        });
      });
    } catch (error) {
      console.log(error);
      toaster.create({
        description: "Failed save post",
        type: "error",
      });
    }
  };

  return (
    <Box pb={8}>
      <Flex
        justify="space-between"
        p={4}
        alignItems="center"
        position="sticky"
        top={0}
        bg="white"
        zIndex={20}
      >
        <Heading>Instac</Heading>
        <Button borderRadius="full">
          <Github />
          Github
        </Button>
      </Flex>
      <Container>
        <VStack gap={4} w="100%" pt={20} mb={8}>
          <Heading
            className="sora-600"
            size={{ base: "5xl", lg: "6xl" }}
            textAlign="center"
          >
            <Highlight query="Instagram" styles={{ color: "pink.600" }}>
              Instagram Downloader
            </Highlight>
          </Heading>
          <Text w={{ base: "80%", lg: "35%" }} textAlign="center">
            We all know that feeling: seeing the perfect tutorial, a hilarious
            Reel, or a stunning photo... and then losing it forever in your
            saved list
          </Text>
          <InputGroup
            startElement={<Link2 />}
            endElement={
              <Button
                colorPalette="pink"
                variant="solid"
                borderRadius="full"
                size="xl"
                onClick={handleSubmit}
                disabled={isPending}
              >
                <Download />
                <Text display={{ base: "none", lg: "block" }} opacity={1}>
                  Download
                </Text>
              </Button>
            }
            pr={1}
            my={8}
          >
            <Input
              placeholder="https://instagram.com/p/G453HGDH/"
              size="2xl"
              type="url"
              borderRadius="full"
              shadow="md"
              variant="outline"
              onChange={handleChange}
            />
          </InputGroup>
        </VStack>

        <Flex w="100%" gap={4} direction="column" justify="start">
          <Heading>History</Heading>
          <Tabs.Root defaultValue="links">
            <Tabs.List>
              <Tabs.Trigger value="links">
                <ListChevronsDownUp />
                List
              </Tabs.Trigger>
              <Tabs.Trigger value="galleries">
                <GalleryThumbnails />
                Media
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="links" w="100%">
              <Links />
            </Tabs.Content>
            <Tabs.Content value="galleries">
              <Gallery />
            </Tabs.Content>
          </Tabs.Root>
        </Flex>
      </Container>
    </Box>
  );
}

export default App;
