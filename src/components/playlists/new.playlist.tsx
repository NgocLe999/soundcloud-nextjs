"use client";
import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CreateNewPlaylist from "./create.new.playlist";
import AddTrackToPlaylist from "./add.track.playlist";
import CurrentTrack from "./current.track";
import { Divider } from "@mui/material";

interface IProps {
  listPlaylist: IPlaylist[];
  listTrack: IData[];
}
export default function Playlists(props: IProps) {
  const { listPlaylist, listTrack } = props;

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <span>DANH SÁCH PHÁT:</span>
        <div>
          <CreateNewPlaylist />
          <AddTrackToPlaylist
            listPlaylist={listPlaylist}
            listTrack={listTrack}
          />
        </div>
      </div>
      {listPlaylist.length === 0 && (
        <div>
          <h2 style={{ textAlign: "center" }}>NO PLAYLIST</h2>
        </div>
      )}
      {listPlaylist &&
        listPlaylist.map((list) => {
          return (
            <Accordion sx={{ marginTop: "7px" } } key={`key-${list._id}`}>
              <AccordionSummary
                expandIcon={<ArrowDownwardIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography>{list.title}</Typography>
              </AccordionSummary>
              <AccordionDetails  key={`keyss-${list._id}`}>
                {list?.tracks?.map((track) => {
                  return (
                    <>
                      <CurrentTrack key={track._id} track={track} />
                      <Divider />
                    </>
                  );
                })}
                {list?.tracks?.length === 0 && <span>No data</span>}
              </AccordionDetails>
            </Accordion>
          );
        })}
    </>
  );
}
