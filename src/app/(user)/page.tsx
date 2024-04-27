import MainSlider from "@/components/main/main.slider";
import { sendRequest } from "@/components/ultils/api";
import { Container } from "@mui/material";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";


export default async function HomePage() {
  const session = await getServerSession(authOptions);

  const chills = await sendRequest<IBackendRes<IData[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: "POST",
    body: {
      category: "CHILL",
      limit: 10,
    },
  });
  const workouts = await sendRequest<IBackendRes<IData[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: "POST",
    body: {
      category: "WORKOUT",
      limit: 10,
    },
  });
  const party = await sendRequest<IBackendRes<IData[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: "POST",
    body: {
      category: "PARTY",
      limit: 10,
    },
  });

  // console.log("check res sendRequest", chills.data);

  return (
    <Container>
      <MainSlider data={chills?.data ?? []} title="Chill" />
      <MainSlider data={workouts?.data ?? []} title="Workout" />
      <MainSlider data={party?.data ?? []} title="Party" />
    </Container>
  );
}
