import { api } from "@/utils/api";
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { FiBox, FiGlobe } from "react-icons/fi";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function CreateProjectModal({ open, setOpen }: Props) {
  const router = useRouter();

  const createProjectMutation = api.dashboard.createProject.useMutation({
    onSuccess: (projectId) => {
      setOpen(false);
      router.push(`/dashboard/${projectId}`);
    },
  });

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  const createProject = () => {
    createProjectMutation.mutate({ name, url });
  };

  return (
    <Modal isCentered isOpen={open} onClose={() => setOpen(false)}>
      <ModalOverlay />

      <ModalContent p="5">
        <Box>
          <p className="mb-7 text-xl font-semibold italic">
            Create a New Project
          </p>

          <InputGroup>
            <InputLeftElement color="gray.500">
              <FiBox />
            </InputLeftElement>

            <Input
              onChange={(e) => setName(e.target.value)}
              isRequired
              placeholder="Twitter Inc."
              autoFocus
            />
          </InputGroup>

          <InputGroup mt="3">
            <InputLeftElement color="gray.500">
              <FiGlobe />
            </InputLeftElement>

            <Input
              onChange={(e) => setUrl(e.target.value)}
              isRequired
              placeholder="twitter.com"
            />
          </InputGroup>

          <center>
            <Button
              onClick={createProject}
              type="submit"
              w="full"
              bg="green.400"
              color="white"
              mt="7"
              disabled={createProjectMutation.isLoading}
            >
              Create
            </Button>
          </center>
        </Box>
      </ModalContent>
    </Modal>
  );
}
