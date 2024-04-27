"use client";
import { Avatar, TextField } from "@mui/material";
import { fetchDefaultImage, sendRequest } from "../ultils/api";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useHasMounted } from "../ultils/customHook";
import LikeTrack from "./like.track";
import Image from "next/image";
interface IProps {
  track: IData | null;
  comments: IComment[] | null;
  wavesurfer: any;
}
const CommentsTrack = (props: IProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { track, comments, wavesurfer } = props;
  const [detailComment, setDetailComment] = useState<string>();
  const hasMounted = useHasMounted();
  dayjs.extend(relativeTime);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.round(seconds) % 60;
    const paddedSeconds = `0${secondsRemainder}`.slice(-2);
    return `${minutes}:${paddedSeconds}`;
  };

  const handleOnChange = (e: any) => {
    setDetailComment(e.target.value);
  };

  const handleSubmit = async () => {
    const res = await sendRequest<IBackendRes<IComment>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: {
        content: detailComment,
        moment: Math.round(wavesurfer?.getCurrentTime() ?? 0),
        track: track?._id,
      },
    });
    if (res.data) {
      setDetailComment("");
      router.refresh();
    }
  };
  const handleJumpTrack = (moment: number) => {
    if (wavesurfer) {
      const duration = wavesurfer.getDuration();
      wavesurfer.seekTo(moment / duration);
      wavesurfer.play();
    }
  };
  return (
    <div className="container-comments" style={{ marginTop: "30px" }}>
      <LikeTrack track={track} />
      <TextField
        fullWidth
        label="Comment"
        variant="standard"
        value={detailComment}
        onChange={(e) => handleOnChange(e)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit();
          }
        }}
      />
      <div
        className="container-contents"
        style={{ display: "flex", gap: 150, width: "100%", marginTop: "25px" }}
      >
        <div
          className="content-left"
          style={{
            width: "25%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {session && (
            <Avatar
              sx={{ bgcolor: "white", width: 150, height: 150 }}
              src={fetchDefaultImage(session?.user?.type)}
            />
          )}
          <h4>{session?.user?.email}</h4>
        </div>
        <div
          className="content-right"
          style={{
            display: "flex",
            flexDirection: "column",
            width: "75%",
            gap: 30,
          }}
        >
          {session &&
            comments &&
            comments.map((comment) => {
              return (
                <div
                  className="content-comment"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                >
                  <div
                    className="list-comments"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 20,
                    }}
                  >
                    <Image
                      src={fetchDefaultImage(comment.user.type)}
                      height={35}
                      width={35}
                      alt="avatar"
                    />
                    {/* <img
                      src={fetchDefaultImage(comment.user.type)}
                      style={{ width: 35, height: 35 }}
                    /> */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        handleJumpTrack(comment.moment);
                      }}
                    >
                      <span>{`${comment.user.email} at ${formatTime(
                        comment.moment
                      )}`}</span>
                      <span>{comment.content}</span>
                    </div>
                  </div>
                  <div className="list-time">
                    {
                      /// check đã render tại client và chỉ chạy ở client
                      hasMounted && dayjs(comment.createdAt).fromNow()
                    }
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default CommentsTrack;
