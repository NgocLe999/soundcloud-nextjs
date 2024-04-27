"use client";
import { createContext, useContext, useState } from "react";

const TrackContext = createContext<ITrackContext | null>(null);

export const TrackContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const initState = {
    _id: "",
    title: "",
    description: "",
    category: "",
    imgUrl: "",
    trackUrl: "",
    countLike: 0,
    countPlay: 0,
    uploader: {
      _id: "",
      email: "",
      name: "",
      role: "",
      type: "",
    },
    isDeleted: false,
    createAt: "",
    updateAt: "",
    isPlaying: false,
  };
  const [trackPlaying, setTrackPlaying] = useState<ITrackPlay>(initState);

  return (
    <TrackContext.Provider value={{ trackPlaying, setTrackPlaying }}>
      {children}
    </TrackContext.Provider>
  );
};

export const useTrackContext = () => useContext(TrackContext);
