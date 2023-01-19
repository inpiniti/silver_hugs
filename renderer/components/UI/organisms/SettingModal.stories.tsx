import React from "react";
import SettingModal from "./SettingModal";
import Button from '@mui/material/Button';

export default {
  title: "organisms/SettingModal",
  component: SettingModal,
};

export const Default = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <SettingModal onClickClose={handleClose} open={open} cookie={'123'}/>
    </div>
  )
}