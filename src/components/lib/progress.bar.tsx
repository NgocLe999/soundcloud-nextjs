"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

const ProgressBarWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <ProgressBar
        height="2px"
        color="#f70"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
};

export default ProgressBarWrapper;
