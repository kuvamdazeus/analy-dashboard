import { useColorMode } from "@chakra-ui/react";

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { colorMode } = useColorMode();

  return <div className={`${colorMode}`}>{children}</div>;
}
