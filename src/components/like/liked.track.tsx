import { Box, Divider } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { convertSlugUrl } from "../ultils/api";
interface IProps {
  listTrackLiked: ILikeTrack[];
}
const LikeTrack = (props: IProps) => {
  const { listTrackLiked } = props;
  return (
    <>
      <div style={{ fontWeight: 600, marginBottom: "20px" }}>
        DANH SÁCH TRACK BẠN ĐÃ LIKE:
      </div>
      <Divider />
      <Box sx={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
        {listTrackLiked.map((track) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginTop: "30px",
              }}
            >
              <Image
                alt="Track-Liked"
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track?.imgUrl}`}
                height={200}
                width={200}
              />
              <Link
                style={{
                  textDecoration: "none",
                  color: "unset",
                  fontWeight: 500,
                }}
                href={`/track/${convertSlugUrl(track.title)}-${
                  track._id
                }.html?audio=${track.trackUrl}`}
              >
                {track.title}
              </Link>
            </div>
          );
        })}
      </Box>
    </>
  );
};

export default LikeTrack;
