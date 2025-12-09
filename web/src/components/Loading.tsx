import { Center, Spinner } from "@chakra-ui/react";

export default function Loading() {
  return (
    <Center minHeight="100vh">
      <Spinner size="xl" />
    </Center>
  );
}
