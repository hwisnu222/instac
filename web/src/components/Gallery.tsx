import { swrFetcher } from "@/utils/swrFether";
import {
  Button,
  Image,
  Box,
  SimpleGrid,
  Card,
  IconButton,
  Link,
} from "@chakra-ui/react";
import { DeleteIcon } from "lucide-react";
import useSWR from "swr";

type MediaItem = {
  url: string;
  mimetype: string;
  filename: string;
};

export default function Gallery() {
  const { data } = useSWR("/download/media", swrFetcher);

  return (
    <Box mb={8}>
      <SimpleGrid columns={{ base: 2, lg: 5 }} gap={{ base: 2, lg: 2 }}>
        {data?.results?.map((item: MediaItem, idx: number) => (
          <Card.Root key={idx}>
            {item.url.includes(".jpg") ? (
              <Image
                src={item.url}
                alt="Media thumbnail"
                mb={2}
                width="100%"
                height="200px"
                objectFit="cover"
              />
            ) : (
              <Box mb={2} width="100%" height="200px">
                <video
                  controls
                  src={item.url}
                  preload="metadata"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                >
                  Browser Anda tidak mendukung tag video.
                </video>
              </Box>
            )}
            <Card.Footer p={{ base: 1, lg: 2 }}>
              <IconButton
                borderRadius="full"
                variant="surface"
                colorPalette="red"
              >
                <DeleteIcon />
              </IconButton>
              <Link href={item.url} w="100%" target="_blank">
                <Button
                  variant="solid"
                  colorScheme="pink"
                  borderRadius="full"
                  size="md"
                  flex={1}
                >
                  Download
                </Button>
              </Link>
            </Card.Footer>
          </Card.Root>
        ))}
      </SimpleGrid>
    </Box>
  );
}
