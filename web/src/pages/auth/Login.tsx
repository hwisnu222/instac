import { type ChangeEvent } from "react";
import {
  Center,
  Card,
  Button,
  Input,
  InputGroup,
  VStack,
  Heading,
} from "@chakra-ui/react";
import { API_BASE } from "@/config/api";
import useSWR from "swr";
import { swrFetcher } from "@/utils/swrFether";
import { useNavigate } from "react-router";
import { toaster } from "@/components/ui/toaster";
import { flushSync } from "react-dom";
export default function Login() {
  const navigate = useNavigate();

  const { data } = useSWR("/auth/users/count", swrFetcher);

  if (!data?.items?.count) {
    navigate("/auth/register");
  }

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const res = await API_BASE.post("/auth/token", formData);
      flushSync(() => {
        localStorage.setItem("@token", res.data.access_token);
      });
      navigate("/");
    } catch (err) {
      toaster.error({
        description: "Please check your username and password",
        type: "error",
      });
      console.log(err);
    }
  };

  return (
    <Center minHeight="100vh">
      <Card.Root borderRadius="2xl">
        <form onSubmit={handleSubmit}>
          <Card.Body>
            <VStack gap={4}>
              <Heading size="3xl">Instac</Heading>
              <InputGroup>
                <Input
                  name="username"
                  placeholder="Username"
                  type="text"
                  size="xl"
                  borderRadius="full"
                />
              </InputGroup>
              <InputGroup>
                <Input
                  name="password"
                  placeholder="Password"
                  type="password"
                  size="xl"
                  borderRadius="full"
                />
              </InputGroup>
              <Button
                variant="solid"
                borderRadius="full"
                w="100%"
                type="submit"
              >
                Sign In
              </Button>
            </VStack>
          </Card.Body>
        </form>
      </Card.Root>
    </Center>
  );
}
