import React from "react";
import VideoModal from "./VideoModal";
import Button from '@mui/material/Button';

export default {
  title: "organisms/VideoModal",
  component: VideoModal,
};

export const Default = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <VideoModal src={'/videos/sample.mp4'} onClickClose={handleClose} open={open} />
    </div>
  )
}