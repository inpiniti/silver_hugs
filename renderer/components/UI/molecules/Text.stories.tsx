import React from "react";
import Text from "./Text";

export default {
  title: "molecules/Text",
  component: Text,
};

export const Default = () => <Text value={'안녕하세요'}/>;
export const IconText = () => <Text icon={"current"} value={'현재 일정'}/>;
export const LabelText = () => <Text label={'체감'} value={'7.4˚'}/>;
export const BigIconText = () => <Text icon={"sunny"} size={"h1"} value={'7.8˚'}/>;
export const ManyText = () =>
<>
  <Text value={'어제보다 0.6˚ ↑'}/> <Text label={'/'}/> <Text value={'맑음'}/>
</>