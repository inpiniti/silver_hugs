import React from "react";
import ConnectCard from "./ConnectCard";

export default {
  title: "organisms/ConnectCard",
  component: ConnectCard,
};

const handleClick = () => { alert('hi') }

export const Default = () => <ConnectCard title={'쌍방향 수업참여'} date={'2022년 6월 12일'} onClick={handleClick} />