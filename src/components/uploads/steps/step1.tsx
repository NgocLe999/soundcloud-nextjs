"use client";
import { useDropzone, FileWithPath } from "react-dropzone";
import "../steps/step1.scss";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useCallback } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
function InputFileUpload() {
  return (
    <Button
      onClick={(e) => e.preventDefault()}
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      Upload file
      <VisuallyHiddenInput type="file" />
    </Button>
  );
}
interface IProps {
  setValue: (v: number) => void;
  setTrackUpload: any;
  trackUpload: any;
}
function Step1(props: IProps) {
  const { data: session } = useSession();
  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[]) => {
      props.setValue(1);
      if (acceptedFiles && acceptedFiles[0]) {
        const audio = acceptedFiles[0];
        const FormData = require("form-data");
        const form = new FormData();
        form.append("fileUpload", audio);
        // uncaugth in promise --> use try catch

        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/upload`,
            form,
            {
              headers: {
                Authorization: `Bearer ${session?.access_token}`,
                target_type: "tracks", // upload file nó sẽ tới đây ở database
              },
              onUploadProgress: (progressEvent) => {
                let percentCompleted = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total!
                );
                props.setTrackUpload({
                  ...props.trackUpload,
                  fileName: acceptedFiles[0].name,
                  percent: percentCompleted,
                });
              },
            }
          );
          props.setTrackUpload((prevState: any) => ({
            ...prevState,
            urlFileTrack: res?.data?.data?.fileName,
          }));
          // console.log("check res", res?.data?.data?.fileName);
        } catch (error) {
          //@ts-ignore
          alert(`${error?.response?.data?.message}`);
        }
      }
    },
    [session]
  );
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".mp3", ".m4a"],
    },
  });

  const files = acceptedFiles.map((file: FileWithPath) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <section className="container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <p>Drag and drop your tracks & albums here</p>
        <InputFileUpload />
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </section>
  );
}

export default Step1;
