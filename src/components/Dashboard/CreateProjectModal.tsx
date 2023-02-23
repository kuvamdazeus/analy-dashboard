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
  isEdit?: boolean;
}

export default function CreateProjectModal({
  open,
  setOpen,
  isEdit = false,
}: Props) {
  const router = useRouter();

  const user = api.user.getUser.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const createProjectMutation = api.dashboard.createProject.useMutation({
    onSuccess: (projectId) => {
      setOpen(false);
      router.replace(`/dashboard/${projectId}`);
    },
  });

  const updateProjectMutation = api.dashboard.updateProject.useMutation({
    onSuccess: (project) => {
      if (!project) return;

      user.refetch();
      setOpen(false);
    },
  });

  const currentProject = user.data?.projects.find(
    (project) => project.id === location.pathname.split("/").at(-1)
  );

  const [name, setName] = useState(
    isEdit && currentProject ? currentProject.name : ""
  );

  const [url, setUrl] = useState(
    isEdit && currentProject ? currentProject.url : ""
  );

  const submit = () => {
    if (!currentProject) return;

    let parsedUrl = url.trim();

    if (!url.startsWith("https://") && !url.startsWith("http://")) {
      parsedUrl = `https://${url}`;
    }

    if (!isEdit) {
      createProjectMutation.mutate({ name, url: parsedUrl });
    } else {
      updateProjectMutation.mutate({
        projectId: currentProject.id,
        name,
        url: parsedUrl,
      });
    }
  };

  return (
    <Modal isCentered isOpen={open} onClose={() => setOpen(false)}>
      <ModalOverlay />

      <ModalContent p="5">
        <Box>
          <p className="mb-7 text-xl font-semibold italic">
            {isEdit ? "Edit Project" : "Create a New Project"}
          </p>

          <InputGroup>
            <InputLeftElement color="gray.500">
              <FiBox />
            </InputLeftElement>

            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Twitter Inc."
              autoFocus
            />
          </InputGroup>

          <InputGroup mt="3">
            <InputLeftElement color="gray.500">
              <FiGlobe />
            </InputLeftElement>

            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="twitter.com"
            />
          </InputGroup>

          <center>
            <Button
              onClick={submit}
              type="submit"
              w="full"
              bg="green.400"
              color="white"
              mt="7"
              disabled={createProjectMutation.isLoading}
            >
              {isEdit ? "Save" : "Create"}
            </Button>
          </center>
        </Box>
      </ModalContent>
    </Modal>
  );
}
