import React from "react";
import { Helmet } from "react-helmet-async";
import { SITE_TITLE } from "../constants";

interface IHelmetOnlyTitle {
  title: string;
}

export const HelmetOnlyTitle: React.FC<IHelmetOnlyTitle> = ({ title }) => (
  <Helmet>
    <title>
      {title} | {SITE_TITLE}
    </title>
  </Helmet>
);