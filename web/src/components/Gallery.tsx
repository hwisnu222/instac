import { swrFetcher } from "@/utils/swrFether";
import { Button, Image, Box, SimpleGrid, Card } from "@chakra-ui/react";
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
      <SimpleGrid columns={{ base: 2, lg: 5 }} gap={4}>
        {data?.results?.map((item: MediaItem, idx: number) => (
          <Card.Root key={idx} overflow="hidden">
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

            <Card.Footer p={2}>
              <Button
                variant="solid"
                colorScheme="pink"
                w="100%"
                borderRadius="full"
                size="md"
              >
                {/* <Download /> */} {/* Komponen Ikon */}
                Download
              </Button>
            </Card.Footer>
          </Card.Root>
        ))}
      </SimpleGrid>
    </Box>
  );
}
