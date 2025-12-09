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
import { toaster } from "@/components/ui/toaster";
import { useNavigate } from "react-router";
import { swrFetcher } from "@/utils/swrFether";
import useSWR from "swr";

export default function Register() {
  const navigate = useNavigate();
  const { data } = useSWR("/auth/users/count", swrFetcher);

  if (data?.items?.count) {
    navigate("/auth/login");
  }

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const body = Object.fromEntries(new FormData(e.target).entries());
      await API_BASE.post("/auth/register", body);

      navigate("/login");

      toaster.create({
        description: "Register success",
        type: "success",
      });
      navigate("/");
    } catch (error) {
      console.log(error);
      toaster.create({
        description: "Failed to register",
        type: "error",
      });
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
                  name="full_name"
                  placeholder="Fullname"
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
                Sign Up
              </Button>
            </VStack>
          </Card.Body>
        </form>
      </Card.Root>
    </Center>
  );
}
