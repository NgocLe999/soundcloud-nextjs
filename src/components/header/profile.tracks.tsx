"use client";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

import SkipNextIcon from "@mui/icons-material/SkipNext";
import { useTrackContext } from "../lib/tracks.context";
import Link from "next/link";

export default function ProfileTracks(props: any) {
  const { data } = props;
  const { trackPlaying, setTrackPlaying } = useTrackContext() as ITrackContext; /// ép kiểu này mới chạy được
  const theme = useTheme();
  //   console.log(">>> check trackplaying:", trackPlaying);

  return (
    <Card
      sx={{
        display: "flex",
        justifyContent: "space-between",
        height: "200px",
        ":hover": {
          cursor: "pointer",
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Link
          href={`/track/${data._id}?audio=${data.trackUrl}&id=${data._id}`}
          style={{ textDecoration: "none", color: "#ff5722" }}
        >
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography component="div" variant="h5">
              {data.title}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
            >
              {data.description}
            </Typography>
          </CardContent>
        </Link>
        <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
          <IconButton aria-label="previous">
            {theme.direction === "rtl" ? (
              <SkipNextIcon />
            ) : (
              <SkipPreviousIcon />
            )}
          </IconButton>
          {(data._id !== trackPlaying._id ||
            (data._id === trackPlaying._id &&
              trackPlaying.isPlaying === false)) && (
            <IconButton
              aria-label="play/pause"
              onClick={() => setTrackPlaying({ ...data, isPlaying: true })}
            >
              <PlayArrowIcon sx={{ height: 38, width: 38 }} />
            </IconButton>
          )}
          {trackPlaying.isPlaying === true && data._id === trackPlaying._id && (
            <IconButton
              aria-label="play/pause"
              onClick={() => setTrackPlaying({ ...data, isPlaying: false })}
            >
              <PauseIcon sx={{ height: 38, width: 38 }} />
            </IconButton>
          )}

          <IconButton aria-label="next">
            {theme.direction === "rtl" ? (
              <SkipPreviousIcon />
            ) : (
              <SkipNextIcon />
            )}
          </IconButton>
        </Box>
      </Box>

      <CardMedia
        component="img"
        sx={{ width: "30%" }}
        image={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${data.imgUrl}`}
        alt="Live from space album cover"
      />
    </Card>
  );
}
