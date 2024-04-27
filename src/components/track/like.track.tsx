import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

import FavoriteIcon from "@mui/icons-material/Favorite";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { sendRequest } from "../ultils/api";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
interface IProps {
  track: IData | null;
}
export default function LikeTrack(props: IProps) {
  const router = useRouter();
  const { track } = props;
  const [tracklike, setTrackLike] = useState<ILikeTrack[] | null>(null);
  const { data: session } = useSession();

  const fetchTrackLiked = async () => {
    if (session?.access_token) {
      const res = await sendRequest<IBackendRes<IModelPaginate<ILikeTrack>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
        method: "GET",
        queryParams: {
          current: 1,
          pageSize: 100,
          sort: "-createdAt",
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
      if (res.data) {
        setTrackLike(res?.data?.result);
      }
    }
  };
  useEffect(() => {
    fetchTrackLiked();
  }, [session]);

  const handleClick = async () => {
    await sendRequest<IBackendRes<IModelPaginate<ILikeTrack>>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
      method: "POST",
      body: {
        track: track?._id,
        quantity: tracklike?.some((trackliked) => trackliked._id === track?._id)
          ? -1
          : 1,
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    /// clear data catch
    await sendRequest<IBackendRes<any>>({
      url: "/api/revalidate",
      method: "POST",
      queryParams: {
        tag: "track-by-tag",
        secret: "justASecretForJWT ",
      },
    });
    await sendRequest<IBackendRes<any>>({
      url: "/api/revalidate",
      method: "POST",
      queryParams: {
        tag: "liked-by-user",
        secret: "justASecretForJWT ",
      },
    });
    fetchTrackLiked();
    router.refresh();
  };

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "20px",
      }}
    >
      <Chip
        label="Like"
        onClick={handleClick}
        icon={<FavoriteIcon sx={{ fontSize: 20 }} />}
        variant="outlined"
        color={
          tracklike?.some((trackliked) => trackliked._id === track?._id)
            ? "error"
            : "default"
        }
      />
      <div>
        <Chip
          label={track?.countPlay}
          icon={<PlayArrowIcon sx={{ fontSize: 20 }} />}
          sx={{ marginRight: "10px" }}
        />
        <Chip
          label={track?.countLike}
          icon={<FavoriteIcon sx={{ fontSize: 20 }} />}
        />
      </div>
    </Stack>
  );
}
