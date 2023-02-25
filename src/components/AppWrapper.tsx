import { useEffect, useState } from "react";
import { useColorMode } from "@chakra-ui/react";
import { FiAlertCircle } from "react-icons/fi";

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { colorMode } = useColorMode();
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 1000) setShowDialog(true);
  }, []);

  if (showDialog)
    return (
      <section className="flex h-screen w-screen flex-col items-center justify-center bg-gray-900 text-white ">
        <FiAlertCircle className="mb-10 text-6xl text-red-500" />

        <p className="mb-5 text-3xl">We're Sorry!</p>

        <p className="mb-5 text-center font-light">
          This website is not available on smaller screen resolutions yet...
          <br />
          We are working towards a mobile-friendly design!
        </p>
      </section>
    );
  return <div className={`${colorMode}`}>{children}</div>;
}
