"use client";

import AppBar from "@mui/material/AppBar";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { Box, Container, Hidden } from "@mui/material";
import { useHasMounted } from "../ultils/customHook";
import { useTrackContext } from "../lib/tracks.context";
import { useEffect, useRef } from "react";
import { Elsie } from "next/font/google";
import { Height } from "@mui/icons-material";

export default function AppFooter() {
  const { trackPlaying, setTrackPlaying } = useTrackContext() as ITrackContext;
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef && trackPlaying.isPlaying === true) {
      //@ts-ignore
      audioRef?.current?.audio?.current?.play();
    } else {
      //@ts-ignore
      audioRef?.current?.audio?.current?.pause();
    }
  }, [trackPlaying]);

  const hasMounted = useHasMounted();
  if (!hasMounted) {
    return <></>;
  }

  return (
    <div style={{ marginTop: 30, height: 88 }}>
      {trackPlaying._id && (
        <AppBar
          position="fixed"
          color="primary"
          sx={{
            top: "auto",
            bottom: 0,
            background: "#f3f3f3",
          }}
        >
          <Container
            sx={{
              display: "flex",
              gap: "20px",
              ".rhap_main": {
                gap: 6,
              },
            }}
          >
            <AudioPlayer
              onPlay={() => {
                setTrackPlaying({ ...trackPlaying, isPlaying: true });
              }}
              onPause={() => {
                setTrackPlaying({ ...trackPlaying, isPlaying: false });
              }}
              layout={"horizontal-reverse"}
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${trackPlaying.trackUrl}`}
              volume={0.5}
              style={{
                backgroundColor: "#f3f3f3",
                boxShadow: "none",
              }}
              ref={audioRef}
              // Try other props!
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                color: "#333",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 100,
                fontSize: "14px",
                width: "20%",
        
              }}
            >
              <div
                className="title"
                style={{
                  color: "#999",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                {trackPlaying.title}
              </div>
              <div
                style={{
                  color: "#333",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                }}
              >
                {trackPlaying.description}
              </div>
            </div>
          </Container>
        </AppBar>
      )}
    </div>
  );
}
