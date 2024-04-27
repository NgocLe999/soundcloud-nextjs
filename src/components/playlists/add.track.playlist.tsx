"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Chip from "@mui/material/Chip";
import OutlinedInput from "@mui/material/OutlinedInput";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Theme, useTheme } from "@mui/material/styles";
import { title } from "process";
import { sendRequest } from "../ultils/api";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ultils/toast";
import { useRouter } from "next/navigation";
// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// };

// const names = [
//   "Oliver Hansen",
//   "Van Henry",
//   "April Tucker",
//   "Ralph Hubbard",
//   "Omar Alexander",
//   "Carlos Abbott",
//   "Miriam Wagner",
//   "Bradley Wilkerson",
//   "Virginia Andrews",
//   "Kelly Snyder",
// ];

// function getStyles(name: string, trackId: string[], theme: Theme) {
//   return {
//     fontWeight:
//       trackId.indexOf(name) === -1
//         ? theme.typography.fontWeightRegular
//         : theme.typography.fontWeightMedium,
//   };
// }

// interface ISelect {
//   listPlaylist: IPlaylist[];
//   setChosenPlaylist: (v: any) => void;
//   chosenPlaylist: any;
// }
// function MultipleSelect(props: ISelect) {
//   const { listPlaylist, chosenPlaylist, setChosenPlaylist } = props;

//   const theme = useTheme();
//   const [trackId, setTrackId] = React.useState<string[]>([]);

//   const handleChange = (event: SelectChangeEvent<typeof trackId>) => {
//     const {
//       target: { value },
//     } = event;
//     setTrackId(typeof value === "string" ? value.split(",") : value);

//     console.log("check personame", trackId);
//     // const playlistSelected = listPlaylist.find((playlist)=>playlist._id === )
//     console.log(">>>>> check listplaylist", listPlaylist);
//   };

//   return (
//     <div>
//       <FormControl fullWidth sx={{ marginTop: "20px" }}>
//         <InputLabel>Chọn Playlist</InputLabel>
//         <Select
//           multiple
//           value={trackId}
//           onChange={handleChange}
//           input={<OutlinedInput label="Chọn Playlist" />}
//           MenuProps={MenuProps}
//         >
//           {listPlaylist.map((name) => (
//             <MenuItem
//               key={name._id}
//               value={name.title}
//               style={getStyles(name.title, trackId, theme)}
//             >
//               {name.title}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>
//     </div>
//   );
// }
// interface ISeclecChip {
//   listTrack: IData[];
//   setChosenPlaylist: (v: any) => void;
//   chosenPlaylist: any;
// }

// function MultipleSelectChip(props: ISeclecChip) {
//   const { listTrack, chosenPlaylist, setChosenPlaylist } = props;
//   const theme = useTheme();
//   const [trackId, setTrackId] = React.useState<string[]>([]);
//   const handleChange = (event: SelectChangeEvent<typeof trackId>) => {
//     const {
//       target: { value },
//     } = event;
//     setTrackId(
//       // On autofill we get a stringified value.
//       typeof value === "string" ? value.split(",") : value
//     );
//     setChosenPlaylist({});
//   };

//   return (
//     <div>
//       <FormControl sx={{ marginTop: "20px" }} fullWidth>
//         <InputLabel>Track Name</InputLabel>
//         <Select
//           multiple
//           value={trackId}
//           onChange={handleChange}
//           input={<OutlinedInput label="Track Name" />}
//           renderValue={(selected) => (
//             <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//               {selected.map((value) => (
//                 <Chip key={value} label={value} />
//               ))}
//             </Box>
//           )}
//           MenuProps={MenuProps}
//         >
//           {listTrack.map((name) => (
//             <MenuItem
//               key={name._id}
//               value={name.title}
//               style={getStyles(name.title, trackId, theme)}
//             >
//               {name.title}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>
//     </div>
//   );
// }

interface IProps {
  listPlaylist: IPlaylist[];
  listTrack: IData[];
}
export default function AddTrackToPlaylist(props: IProps) {
  const theme = useTheme();
  const { listPlaylist, listTrack } = props;
  const [trackId, setTrackId] = React.useState<string[]>([]);
  const { data: session } = useSession();
  const router = useRouter();
  // const [age, setAge] = React.useState("");
  const [playlistId, setPlaylistId] = React.useState("");

  const [open, setOpen] = React.useState(false);
  const toast = useToast();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = async () => {
    if (!playlistId) {
      toast.error("Vui lòng chọn playlist!");
      return;
    }
    if (!trackId.length) {
      toast.error("Vui lòng chọn tracks!");
      return;
    }

    const chosenPlaylist = listPlaylist.find(
      (playlist) => playlist._id === playlistId
    );
    const tracks = trackId.map((track) => track.split("###")?.[1]);
    // console.log("check chosenPlaylist", chosenPlaylist);
    // console.log(">>>> check trackid", trackId);
    // console.log('>>>> check track api',tracks);
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists`,
      method: "PATCH",
      body: {
        id: chosenPlaylist?._id,
        title: chosenPlaylist?.title,
        isPublic: chosenPlaylist?.isPublic,
        tracks: tracks,
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    if (res?.data) {
      setOpen(false);
      toast.success(`Đã tạo thêm thành công track vào playlist`);
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

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  function getStyles(name: string, tracksId: readonly string[], theme: Theme) {
    return {
      fontWeight:
        tracksId.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  // const [trackId, setTrackId] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof trackId>) => {
    setTrackId(event.target.value as any);
    // const {
    //   target: { value },
    // } = event;
    // setTrackId(
    //   // On autofill we get a stringified value.
    //   // typeof value === 'string' ? value.split(',') : value,

    // );
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        sx={{ marginLeft: "20px" }}
      >
        + NEW TRACK TO PLAYLIST
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Thêm mới track vào playlist</DialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth sx={{ margin: "20px 0px" }}>
              <InputLabel id="demo-simple-select-label">
                Playlist Name
              </InputLabel>
              <Select
                value={playlistId}
                label="Playlist Name"
                onChange={(e) => {
                  setPlaylistId(e.target.value);
                }}
              >
                {listPlaylist.map((playlist) => {
                  return (
                    <MenuItem key={playlist._id} value={playlist._id}>
                      {playlist.title}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Track Name</InputLabel>
              <Select
                multiple
                value={trackId}
                onChange={handleChange}
                input={<OutlinedInput label="Track Name" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value?.split("###")?.[0]} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {listTrack.map((track) => (
                  <MenuItem
                    key={track._id}
                    value={`${track.title}###${track._id}`}
                    style={getStyles(
                      `${track.title}###${track._id}`,
                      trackId,
                      theme
                    )}
                  >
                    {track.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} autoFocus>
            Save
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
