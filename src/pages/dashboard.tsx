import Navbar from "@/components/Dashboard/Navbar";
import { api } from "@/utils/api";

export default function Dashboard() {
  const user = api.user.getUser.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  return (
    <div>
      <Navbar />
      <p>Dashboard</p>
    </div>
  );
}
