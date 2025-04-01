/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Image from 'next/image';

import { CSSProperties } from 'react';

import { useData } from '@/hooks';

import { GridItem } from '../grid-systems/const';

interface TextProps {
  data: GridItem;
  style?: CSSProperties;
}

const PieChartTokenomics = ({ data, style }: TextProps) => {
  return (
    <div className="relative flex flex-col justify-center w-full">
      <Image
        height={497.015}
        width={714}
        src={'/assets/decor/shadow-blue.svg'}
        alt="decor-grid-bottom"
        className="absolute top-0 -translate-y-1/2 left-full -translate-x-1/2 blur-[100px] rotate-90"
      />
      <Image
        height={497.015}
        width={714}
        src={'/assets/decor/shadow-blue.svg'}
        alt="decor-grid-bottom"
        className="absolute top-full -translate-y-1/2 left-0 -translate-x-1/2 blur-[100px] rotate-90"
      />
      <div className="absolute left-1/2 top-1/2 -translate-x-[40%] -translate-y-1/2">
        <div className="relative size-[186px] max-lg:size-[80px]">
          <Image alt="logo" src={'/assets/icons/logo.png'} fill className="absolute object-cover" />
        </div>
      </div>
      {/* <TokenomicsChart
        series={[
          {
            name: "Reserve / Contingency",
            y: 10, // Percentage y
            color: "#DF5D5F", // Red
            dataLabelColor: "#fff",
          },
          {
            name: "Ecosystem / Development / Operation",
            y: 15, // Percentage y
            color: "#66BB60", // Green
            dataLabelColor: "#fff",
          },
          {
            name: "Investors / Strategic Partners",
            y: 20, // Percentage y
            color: "#C789E9", // Purple
            dataLabelColor: "#fff",
          },
          {
            name: "Liquidity",
            y: 10, // Percentage y
            color: "#838AEC", // Blue
            dataLabelColor: "#fff",
          },
          {
            name: "Team / Advisors",
            y: 3, // Percentage y
            color: "#FFA65D", // Orange
            dataLabelColor: "#fff",
          },
          {
            name: "Marketing",
            y: 35, // Percentage y
            color: "#66DFCF", // Teal
            dataLabelColor: "#fff",
          },
          {
            name: "Community",
            y: 7, // Percentage y
            color: "#F2FF65", // Yellow
            dataLabelColor: "#fff",
          },
        ]}
      /> */}
    </div>
  );
};

export default PieChartTokenomics;