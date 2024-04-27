"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { sendRequest } from "../ultils/api";
import { useSession } from "next-auth/react";
import { Box, FormGroup, toolbarClasses } from "@mui/material";
import { useToast } from "@/components/ultils/toast";
import { useRouter } from "next/navigation";
const CreateNewPlaylist = (props: any) => {
  const [title, setTitle] = React.useState<string>("");
  const [isPublic, setIsPublic] = React.useState<boolean>(true);
  const router = useRouter();
  const [open, setOpen] = React.useState<boolean>(false);
  const { data: session } = useSession();
  const toast = useToast();
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (!title) {
      toast.error("Tiêu đều không được để trống");
      return;
    }
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/empty`,
      method: "POST",
      body: { title, isPublic },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });

    if (res?.data) {
      setOpen(false);
      setTitle("");
      setIsPublic(true);
      toast.success(`Đã tạo thành công playlist: ${title}`);
      await sendRequest<IBackendRes<any>>({
        url: `/api/revalidate`,
        method: "POST",
        queryParams: {
          tag: "fetch-playlist",
          secret: `${process.env.REVALIDATE_SECET}`,
        },
      });
      router.refresh();
    } else {
      toast.error(res.message);
    }
  };
  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        + NEW PLAYLIST
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Thêm mới playlist</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              gap: "30px",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <TextField
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              label="Tiêu đề"
              variant="standard"
            />
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={isPublic}
                    onChange={(event) => setIsPublic(event.target.checked)}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label={isPublic === true ? "Public" : "Private"}
              />
            </FormGroup>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit}>Save</Button>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default CreateNewPlaylist;
