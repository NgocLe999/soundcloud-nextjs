import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import LikeTrack from "@/components/like/liked.track";
import { sendRequest } from "@/components/ultils/api";
import { Container } from "@mui/material";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
export const metadata: Metadata = {
  title: "Your Track Liked",
  description: "This is playlist",

};
const LikePage = async () => {
  const session = await getServerSession(authOptions);
  const res = await sendRequest<IBackendRes<IModelPaginate<ILikeTrack>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
    method: "GET",
    queryParams: { current: 1, pageSize: 100 },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: ["liked-by-user"] },
    },
  });
  console.log("check res", res);
  const listTrackLiked = res?.data?.result ?? [];
  return (
    <Container sx={{ marginTop: "35px" }}>
      <LikeTrack listTrackLiked={listTrackLiked} />
    </Container>
  );
};

export default LikePage;
