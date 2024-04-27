// import UploadTrack from "@/components/uploads/uploads.track";
import { Container } from "@mui/material";
import dynamic from "next/dynamic";
const UploadTrack = dynamic(
  () => import("@/components/uploads/uploads.track"),
  { ssr: false }
);
const UploadPage = () => {
  return (
    <Container>
      <UploadTrack />
    </Container>
  );
};

export default UploadPage;
