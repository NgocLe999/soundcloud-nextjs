"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { WaveSurferOptions } from "wavesurfer.js";
import "./wave.track.scss";
import { useWavesurfer } from "../ultils/customHook";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import { Tooltip } from "@mui/material";
import { useTrackContext } from "../lib/tracks.context";
import { fetchDefaultImage, sendRequest } from "../ultils/api";
import CommentsTrack from "./comments.track";
import { useSession } from "next-auth/react";
import Image from "next/image";
interface IProps {
  track: IData | null;
  comments: IComment[] | null;
}
const WaveTrack = (props: IProps) => {
  const { track, comments } = props;
  const { data: session } = useSession();
  const { trackPlaying, setTrackPlaying } = useTrackContext() as ITrackContext;
  const router = useRouter();
  const searchParams = useSearchParams();

  const fileName = searchParams.get("audio");
  const containerRef = useRef<HTMLDivElement>(null);

  const hoverRef = useRef<HTMLDivElement>(null);

  const viewRef = useRef(true);
  const [time, setTime] = useState<string>("0:00");
  const [duration, setDuration] = useState<string>("0:00");

  const optionsMemo = useMemo((): Omit<WaveSurferOptions, "container"> => {
    let gradient, progressGradient;
    if (typeof window !== "undefined") {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      // Define the waveform gradient
      gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
      gradient.addColorStop(0, "#656666"); // Top color
      gradient.addColorStop((canvas.height * 0.7) / canvas.height, "#656666"); // Top color
      gradient.addColorStop(
        (canvas.height * 0.7 + 1) / canvas.height,
        "#ffffff"
      ); // White line
      gradient.addColorStop(
        (canvas.height * 0.7 + 2) / canvas.height,
        "#ffffff"
      ); // White line
      gradient.addColorStop(
        (canvas.height * 0.7 + 3) / canvas.height,
        "#B1B1B1"
      ); // Bottom color
      gradient.addColorStop(1, "#B1B1B1"); // Bottom color

      // Define the progress gradient
      progressGradient = ctx.createLinearGradient(
        0,
        0,
        0,
        canvas.height * 1.35
      );
      progressGradient.addColorStop(0, "#EE772F"); // Top color
      progressGradient.addColorStop(
        (canvas.height * 0.7) / canvas.height,
        "#EB4926"
      ); // Top color
      progressGradient.addColorStop(
        (canvas.height * 0.7 + 1) / canvas.height,
        "#ffffff"
      ); // White line
      progressGradient.addColorStop(
        (canvas.height * 0.7 + 2) / canvas.height,
        "#ffffff"
      ); // White line
      progressGradient.addColorStop(
        (canvas.height * 0.7 + 3) / canvas.height,
        "#F6B094"
      ); // Bottom color
      progressGradient.addColorStop(1, "#F6B094"); // Bottom color
    }

    return {
      waveColor: gradient,
      progressColor: progressGradient,
      height: 100,
      barWidth: 3,
      url: `/api?audio=${fileName}`,
    };
  }, []);
  const wavesurfer = useWavesurfer(containerRef, optionsMemo);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Initialize wavesurfer when the container mounts
  // or any of the props change
  useEffect(() => {
    if (!wavesurfer) return;
    setIsPlaying(false);

    const hover = hoverRef.current!;
    const waveform = containerRef.current!;
    waveform.addEventListener(
      "pointermove",
      (e) => (hover.style.width = `${e.offsetX}px`)
    );

    const subscriptions = [
      wavesurfer.on("play", () => setIsPlaying(true))!,
      wavesurfer.on("pause", () => setIsPlaying(false))!,
      wavesurfer.on("decode", (duration) => {
        setDuration(formatTime(duration));
      }),
      wavesurfer.on("timeupdate", (currentTime) => {
        setTime(formatTime(currentTime));
      }),
      // Play/pause on click
      wavesurfer.on("interaction", () => {
        wavesurfer.playPause();
      }),
    ];

    return () => {
      subscriptions.forEach((unsub) => unsub());
    };
  }, [wavesurfer]);

  // useEffect(() => {
  //   if (track?._id === trackPlaying._id && wavesurfer) {
  //     trackPlaying.isPlaying ? wavesurfer.play() : wavesurfer.pause();
  //   }
  // }, [trackPlaying]);

  useEffect(() => {
    if (wavesurfer && trackPlaying.isPlaying) {
      wavesurfer.pause();
    }
  }, [trackPlaying]);

  useEffect(() => {
    if (track?._id && !trackPlaying._id) {
      setTrackPlaying({ ...track, isPlaying: false });
    }
  }, [track]);

  // On play button click

  const onPlayClick = useCallback(() => {
    if (wavesurfer) {
      wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play();
    }
  }, [wavesurfer]);

  const handleIncreateViewPlay = async () => {
    console.log("check viewref", viewRef.current);

    if (viewRef.current) {
      await sendRequest<IBackendRes<IModelPaginate<ILikeTrack>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/increase-view`,
        method: "POST",
        body: {
          trackId: track?._id,
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
      // clear data catch
      router.refresh();
    }
    viewRef.current = false;
  };
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.round(seconds) % 60;
    const paddedSeconds = `0${secondsRemainder}`.slice(-2);
    return `${minutes}:${paddedSeconds}`;
  };

  const arrComments = [
    {
      id: 1,
      avatar: `${process.env.NEXT_PUBLIC_BACKEND_URL}
      /images/chill1.png`,
      moment: 10,
      user: "username 1",
      content: "just a comment1",
    },
    {
      id: 2,
      avatar: `${process.env.NEXT_PUBLIC_BACKEND_URL}
      /images/chill1.png`,
      moment: 30,
      user: "username 2",
      content: "just a comment3",
    },
    {
      id: 3,
      avatar: `${process.env.NEXT_PUBLIC_BACKEND_URL}
      /images/chill1.png`,
      moment: 100,
      user: "username 3",
      content: "just a comment3",
    },
  ];
  const calLeft = (moment: number) => {
    const durationTrack = wavesurfer?.getDuration() ?? 0;
    const percent = (moment / durationTrack) * 100;
    return `${percent}%`;
  };

  return (
    <>
      <div className="container-full-track">
        <div className="content-left">
          <div className="title-container">
            <div
              onClick={() => {
                onPlayClick();
                handleIncreateViewPlay();
                if (track) {
                  setTrackPlaying({ ...track, isPlaying: false });
                }
              }}
            >
              {!isPlaying ? (
                <PlayCircleIcon
                  sx={{
                    fontSize: 70,
                    color: "#f50",
                    cursor: "pointer",
                    ":hover": { color: "#fc2e0d" },
                  }}
                />
              ) : (
                <PauseCircleIcon
                  sx={{
                    fontSize: 70,
                    color: "#f50",
                    cursor: "pointer",
                    ":hover": { color: "#fc2e0d" },
                  }}
                />
              )}
            </div>
            <div className="sound-title">
              <h2>{track?.title}</h2>
              <span>{track?.description}</span>
            </div>
          </div>
          <div ref={containerRef} className="wave-form-container">
            <div className="time">{time}</div>
            <div className="duration">{duration}</div>
            <div ref={hoverRef} className="hover-wave"></div>
            <div
              className="overlay"
              style={{
                position: "absolute",
                height: "30px",
                width: "100%",
                bottom: "7px",
                background: "rgb(71, 63, 64)",
              }}
            ></div>
          </div>
          <div className="comments">
            {comments &&
              comments.map((item: IComment) => {
                return (
                  <Tooltip title={item.content} arrow key={item._id}>
                    <Image
                      src={fetchDefaultImage(item.user.type)}
                      style={{ left: `${calLeft(item.moment)}` }}
                      alt="tooltip"
                      height={25}
                      width={25}
                    />
                    {/* <img
                      src={fetchDefaultImage(item.user.type)}
                      style={{ left: `${calLeft(item.moment)}` }}
                    /> */}
                  </Tooltip>
                );
              })}
          </div>
        </div>
        <div className="content-right">
          {track?.imgUrl ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track?.imgUrl}`}
              height={300}
              width={340}
              alt="raw-image"
              style={{ objectFit: "cover" }}
            />
          ) : (
            // <img
            //   src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track?.imgUrl}`}
            // />
            <img src={`/user/soundcloud.png`} />
          )}
        </div>
      </div>
      <div>
        <CommentsTrack
          track={track}
          comments={comments}
          wavesurfer={wavesurfer}
        />
      </div>
    </>
  );
};

export default WaveTrack;
