"use client";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { Button, Grid, Paper, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { useSession } from "next-auth/react";
import { sendRequest } from "@/components/ultils/api";
import { useToast } from "@/components/ultils/toast";
import Image from "next/image";
function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}
function LinearWithValueLabel(props: IProps) {
  return (
    <Box sx={{ width: "100%" }}>
      {props.trackUpload.fileName}
      <LinearProgressWithLabel value={props.trackUpload.percent} />
    </Box>
  );
}
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

function InputFileUpload(props: any) {
  const { data: session } = useSession();
  const { info, setInfo } = props;
  const handleUpload = async (image: any) => {
    const FormData = require("form-data");
    const form = new FormData();
    form.append("fileUpload", image);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/upload`,
        form,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            target_type: "images", // upload file nó sẽ tới đây ở database
            delay: 5000,
          },
        }
      );
      setInfo({
        ...info,
        imgUrl: res?.data?.data?.fileName,
      });
    } catch (error) {
      //@ts-ignore
      alert(`${error?.response?.data?.message}`);
    }
  };
  const handleChangeImage = (e: any) => {
    const event = e.target as HTMLInputElement;

    if (event.files) {
      handleUpload(event.files[0]);
    }
  };
  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
      onChange={(e) => handleChangeImage(e)}
    >
      Upload file
      <VisuallyHiddenInput type="file" />
    </Button>
  );
}
function ImageTrackPreview(props: any) {
  const { info, setInfo } = props;
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Box my={3} gap={4} sx={{ border: "2px solid grey" }}>
        {info.imgUrl && (
          <Image
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${info.imgUrl}`}
            height={250}
            width={250}
            style={{ objectFit: "cover" }}
            alt="image-step2"
          />
          // <img
          //   style={{ width: "100%", height: "100%", objectFit: "cover" }}
          //   src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${info.imgUrl}`}
          // />
        )}
      </Box>
      <InputFileUpload info={info} setInfo={setInfo} />
    </Box>
  );
}
interface IInfoTrack {
  title: string;
  description: string;
  trackUrl: string;
  imgUrl: string;
  category: string;
}
function TrackInfo(props: any) {
  const { trackUpload, info, setInfo, setValue } = props;
  const { data: session } = useSession();
  ////
  const toast = useToast();
  useEffect(() => {
    if (trackUpload && trackUpload.urlFileTrack) {
      setInfo({
        ...info,
        trackUrl: trackUpload.urlFileTrack,
      });
    }
  }, [trackUpload]);
  /////

  const category = [
    {
      value: "CHILL",
      id: 1,
    },
    {
      value: "WORKOUT",
      id: 2,
    },
    {
      value: "PARTY",
      id: 3,
    },
  ];
  const handleSubmitTrack = async (info: IInfoTrack) => {
    const res = await sendRequest<IBackendRes<IData[]>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks`,
      method: "POST",
      body: {
        title: info.title,
        description: info.description,
        trackUrl: info.trackUrl,
        imgUrl: info.imgUrl,
        category: info.category,
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    if (res.data) {
      setValue(0);
      toast.success("Create new track success!");

      /// clear data catch
      await sendRequest<IBackendRes<any>>({
        url: "/api/revalidate",
        method: "POST",
        queryParams: {
          tag: "track-by-profile",
          secret: "justASecretForJWT",
        },
      });
    } else {
      toast.error(res.message);
    }
  };
  return (
    <>
      <Box
        component="form"
        sx={{
          display: "flex",
          gap: 4,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "30px",
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          fullWidth
          label="Title"
          variant="outlined"
          value={info.title}
          onChange={(e) => {
            setInfo({
              ...info,
              title: e.target.value,
            });
          }}
        />
        <TextField
          fullWidth
          label="Description"
          variant="outlined"
          value={info.description}
          onChange={(e) => {
            setInfo({
              ...info,
              description: e.target.value,
            });
          }}
        />
        <TextField
          fullWidth
          select
          label="Category"
          defaultValue=""
          onChange={(e) => {
            setInfo({
              ...info,
              category: e.target.value,
            });
          }}
        >
          {category.map((option) => (
            <MenuItem key={option.id} value={option.value}>
              {option.value}
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="contained"
          sx={{ marginTop: "10px" }}
          onClick={() => {
            handleSubmitTrack(info);
          }}
        >
          Save
        </Button>
      </Box>
    </>
  );
}

interface IProps {
  trackUpload: {
    fileName: string;
    percent: number;
    urlFileTrack: "";
  };
  setValue: (v: number) => void;
}

const Step2 = (props: IProps) => {
  const { trackUpload, setValue } = props;
  const [info, setInfo] = useState<IInfoTrack>({
    title: "",
    description: "",
    trackUrl: "",
    imgUrl: "",
    category: "",
  });
  return (
    <>
      <Grid item xs={12}>
        <LinearWithValueLabel trackUpload={trackUpload} setValue={setValue} />
      </Grid>
      <Grid
        container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid item xs={4}>
          <ImageTrackPreview info={info} setInfo={setInfo} />
        </Grid>
        <Grid item xs={8}>
          <TrackInfo
            info={info}
            setInfo={setInfo}
            trackUpload={trackUpload}
            setValue={setValue}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Step2;
