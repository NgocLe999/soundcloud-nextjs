import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Playlists from "@/components/playlists/new.playlist";
import { sendRequest } from "@/components/ultils/api";
import { Container } from "@mui/material";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
export const metadata: Metadata = {
  title: "Your playlist",
  description: "This is playlist",

};
const PageList = async () => {
  const session = await getServerSession(authOptions);

  const res = await sendRequest<IBackendRes<IModelPaginate<IPlaylist>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/by-user`,
    method: "POST",
    queryParams: { current: 1, pageSize: 100 },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: ["fetch-playlist"] },
    },
  });

  // fetch track with paginate
  const res1 = await sendRequest<IBackendRes<IModelPaginate<IData>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks`,
    method: "GET",
    queryParams: { current: 1, pageSize: 100 },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    // nextOption: {
    //   next: { tags: ["fetch-track"] },
    // },
  });

  ///
  const listPlaylist = res?.data?.result ?? [];
  const listTrack = res1?.data?.result ?? [];
  return (
    <Container sx={{ marginTop: "35px" }}>
      <Playlists
        listPlaylist={listPlaylist ?? []}
        listTrack={listTrack ?? []}
      />
    </Container>
  );
};

export default PageList;
