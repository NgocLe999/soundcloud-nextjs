"use client";
// import { convertSlugUrl } from "@/utils/api";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import IconButton from "@mui/material/IconButton";
import { convertSlugUrl } from "../ultils/api";
import { useTrackContext } from "../lib/tracks.context";
const CurrentTrack = (props: any) => {
  const { track } = props;
  const { trackPlaying, setTrackPlaying } = useTrackContext() as ITrackContext;

  return (
    <Box
      sx={{ display: "flex", width: "100%", justifyContent: "space-between" }}
    >
      <Typography sx={{ py: 2 }}>
        <Link
          style={{ textDecoration: "none", color: "unset" }}
          href={`/track/${convertSlugUrl(track.title)}-${
            track._id
          }.html?audio=${track.trackUrl}`}
        >
          {track.title}
        </Link>
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {(track._id !== trackPlaying._id ||
          (track._id === trackPlaying._id &&
            trackPlaying.isPlaying === false)) && (
          <IconButton
            aria-label="play/pause"
            onClick={() => {
              setTrackPlaying({ ...track, isPlaying: true });
            }}
          >
            <PlayArrowIcon sx={{ height: 25, width: 25 }} />
          </IconButton>
        )}
        {track._id === trackPlaying._id && trackPlaying.isPlaying === true && (
          <IconButton
            aria-label="play/pause"
            onClick={() => {
              setTrackPlaying({ ...track, isPlaying: false });
            }}
          >
            <PauseIcon sx={{ height: 25, width: 25 }} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default CurrentTrack;
