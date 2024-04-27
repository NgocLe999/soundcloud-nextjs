import ProfileTracks from "@/components/header/profile.tracks";
import { sendRequest } from "@/components/ultils/api";
import { Container, Grid } from "@mui/material";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Profile",
  description: "This is profile",

};
const ProfilePage = async ({ params }: { params: { slug: string } }) => {
  const tracks = await sendRequest<IBackendRes<IModelPaginate<IData>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/users?current=1&pageSize=20`,
    method: "POST",
    body: {
      id: params.slug,
    },
    nextOption: {
      next: { tags: ["track-by-profile"] },
    },
  });
  const data = tracks?.data?.result ?? [];
  return (
    <Container sx={{ padding: 3 }}>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {data.map((item, index) => (
          <Grid item xs={2} sm={6} md={6} key={index}>
            <ProfileTracks data={item} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProfilePage;
