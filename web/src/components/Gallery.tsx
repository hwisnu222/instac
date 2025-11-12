import { API_BASE } from "@/config/api";
import { swrFetcher } from "@/utils/swrFether";
import {
  Button,
  Image,
  Box,
  SimpleGrid,
  Card,
  IconButton,
  Link,
  HStack,
  Spinner,
  Dialog,
  Portal,
  CloseButton,
} from "@chakra-ui/react";
import { DeleteIcon } from "lucide-react";
import { useTransition } from "react";
import useSWR, { mutate } from "swr";
import { toaster } from "./ui/toaster";
import { PhotoView } from "react-photo-view";

type MediaItem = {
  id: number;
  url: string;
  mimetype: string;
  filename: string;
};

export default function Gallery() {
  const [isPending, startTransition] = useTransition();
  const { data, isLoading } = useSWR("/download/media", swrFetcher);

  const handleRemoveMedia = (id: number) => {
    startTransition(async () => {
      try {
        await API_BASE.delete(`/download/media/${id}`);
        mutate("/download/media");
        toaster.create({
          description: "Post deleted successfully",
          type: "success",
        });
      } catch (error) {
        console.log(error);
        toaster.create({
          description: "failed delete post",
          type: "error",
        });
      }
    });
  };

  return (
    <Box mb={8}>
      {isLoading && (
        <HStack justify="center">
          <Spinner size="md" />
        </HStack>
      )}
      <SimpleGrid columns={{ base: 2, lg: 5 }} gap={{ base: 2, lg: 2 }}>
        {data?.results?.map((item: MediaItem, idx: number) => (
          <Card.Root key={idx}>
            {item.url.includes(".jpg") ? (
              <PhotoView src={item.url}>
                <Image
                  src={item.url}
                  alt="Media thumbnail"
                  mb={2}
                  width="100%"
                  height="200px"
                  objectFit="cover"
                  cursor="pointer"
                  loading="lazy"
                />
              </PhotoView>
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
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <IconButton
                    borderRadius="full"
                    variant="surface"
                    colorPalette="red"
                    disabled={isPending}
                  >
                    <DeleteIcon />
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
                            onClick={() => handleRemoveMedia(item.id)}
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
