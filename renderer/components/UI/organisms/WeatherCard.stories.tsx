import React from "react";
import WeatherCard from "./WeatherCard";

export default {
  title: "organisms/WeatherCard",
  component: WeatherCard,
};

export const Default = () => <WeatherCard weather={null} />