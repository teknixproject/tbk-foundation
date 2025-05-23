'use client';

import Image from 'next/image';
import { CSSProperties, useMemo } from 'react';
import clsx from 'clsx';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { getDeviceType } from '@/lib/utils';
import styled from 'styled-components';
import _ from 'lodash';

export interface TokenomicsChartType {
  series: any[];
  colorText?: string;
}

// import Image from "next/image";

function reduceZeroNoNecessary(num: number) {
  const stringValue = num + '';
  const indexOfDot = stringValue.indexOf('.');
  if (indexOfDot == -1) return num;
  const length = stringValue.length;
  const result = stringValue;
  for (let i = length; i > 0; i--) {
    if (+stringValue[i] > 0) {
      break;
    }
    result.slice(0, -1);
  }
  return +result;
}

function roundToTwoSignificantDecimals(num: number) {
  try {
    if (num >= 1) {
      num = Math.floor(+num * 100) / 100;
    }
    const stringValue = num + '';
    const indexOfDot = stringValue.indexOf('.');
    if (indexOfDot == -1) return num;

    const indexOfFirstNumberNotZeroAfterDot = stringValue
      .split('')
      ?.findIndex((char: string, i: number) => +char != 0 && i > indexOfDot);
    const numOfNumberRemain = indexOfFirstNumberNotZeroAfterDot - indexOfDot + 1;
    return reduceZeroNoNecessary(
      Math.floor(+num * 10 ** numOfNumberRemain) / 10 ** numOfNumberRemain
    );
  } catch (error: any) {
    console.log('Error', error);
    return num;
  }
}

function TokenomicsChart({ series }: TokenomicsChartType) {
  const sizeScreen = getDeviceType();
  const isMobile = sizeScreen === 'mobile';

  const total = useMemo(() => {
    return series?.reduce((total, serie) => total + serie?.y, 0);
  }, [series]);

  const finalSeries = useMemo(() => {
    const newSeries = series?.map((serie: any) => ({
      ...serie,
      y: !!serie.y ? Math.max(serie.y, (total / 100) * 3) : 0,
      dataLabels: {
        formatter: function (): string | null {
          if ((this as any)?.options?.name == '') return null;
          return `${roundToTwoSignificantDecimals((serie.y * 100) / total)}%`;
        },
        enabled: !isMobile,
        style: {
          color: serie?.dataLabelColor,
        },
        padding: 0,
        connectorPadding: 0,
      },
    }));

    const length = newSeries?.length;
    const result = [];
    const elementFull = series?.find((serie: any) => (serie.y * 100) / total >= 100);
    const index = newSeries?.findIndex((serie: any) => elementFull?.name == serie.name);
    if (!!elementFull) return [newSeries[index]];

    for (let i = 0; i < length; i++) {
      result.push(newSeries[i]);
      result.push({
        name: '',
        y: total / 100,
        color: '#FFE07000',
        dataLabels: {
          enabled: false, // Hide data labels for this series only
        },
        enableMouseTracking: false,
      });
    }

    return result;
  }, [isMobile, series, total]);

  const chartOptions = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      events: {
        render: function () {},
      },
      marginTop: 0,
      marginBottom: 0,
      spacingBottom: 0,
      spacingLeft: 0,
      spacingRight: 0,
      spacingTop: 0,
      height: isMobile ? 250 : 1050,
      width: isMobile ? 200 : 1050,
    },
    accessibility: {
      point: {
        valueSuffix: '%',
      },
    },
    title: null,
    tooltip: {
      pointFormatter: function (): string | null {
        if ((this as any)?.options?.name == '') return null;
        return `<b>${roundToTwoSignificantDecimals((this as any)?.options?.y)}</b>`;
      },
      backgroundColor: '#00000055',
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: 'pointer',
        borderRadius: 12,
        dataLabels: [
          {
            enabled: true,
            distance: 100,
            format: `
                {point.name}
                  <span
                   style="color: {point.color}; font-weight: bold;"
                  >
                    {point.y}%
                  </span>
            `,
            style: {
              textOutline: 'none',
              fill: 'none',
              width: '250px',
              fontSize: '24px',
              fontWeight: '400',
              color: '#000',
            },
          },
        ],
        showInLegend: true,
      },
      pie: {
        borderWidth: 0,
        borderRadius: 12,
        spacingBottom: 0,
        spacingLeft: 0,
        spacingRight: 0,
        spacingTop: 0,
        slicedOffset: 0,
        lineWidth: 0,
      },
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            chart: {
              height: '100%',
            },
            plotOptions: {
              series: {
                dataLabels: [
                  {
                    distance: 25,
                    format: `
              {point.name}
                  <span
                   style="color: {point.color};"
                  >
                    {point.y}%
                  </span>
            `,
                    style: {
                      fontSize: '12px',
                      fontWeight: '400',
                    },
                  },
                ],
              },
            },
          },
          series: [
            {
              name: 'Registrations',
              colorByPoint: true,
              innerSize: '80%',
              data: finalSeries,
            },
          ],
        },
      ],
    },
    series: [
      {
        name: 'Registrations',
        colorByPoint: true,
        innerSize: '60%',
        data: finalSeries,
      },
    ],
  };

  return (
    <div
      className={clsx(
        `w-full h-[768px] max-lg:h-full flex items-center justify-center ${
          isMobile && 'pt-[32px] pb-[32px]'
        }`
      )}
    >
      <CsHighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
}

const CsHighchartsReact = styled(HighchartsReact)`
  .highcharts-label {
    text {
      color: #000 !important;
    }
  }
`;

interface PieChartTokenomicsCompoProps {
  data?: any;
  style?: CSSProperties;
}

const PieChartTokenomicsCompo = ({ style }: PieChartTokenomicsCompoProps) => {
  const sizeScreen = getDeviceType();
  const isMobile = sizeScreen === 'mobile';

  const colorText = _.get(style, 'color') || '#FFF';

  return (
    <div className="relative flex flex-col justify-center w-full">
      <div
        style={{
          left: isMobile ? '50%' : '41%',
        }}
        className={`absolute ${
          isMobile ? 'top-1/4' : 'top-1/2'
        } -translate-x-[20%] max-sm:-translate-x-[38%] -translate-y-1/2`}
      >
        <div className="relative size-[186px] max-lg:size-[100px] h-[130px]">
          <Image alt="logo" src={'https://res.cloudinary.com/dkvtxczjf/image/upload/v1743649413/uploads/LogoTBK-noColor.png'} fill className="absolute" />
        </div>
      </div>
      <TokenomicsChart
        series={[
          {
            name: 'Ecosystem / Development / Operation',
            y: 15, // Percentage y
            color: '#66BB60', // Green
            dataLabelColor: colorText ? colorText : '#fff',
          },
          {
            name: 'Investors / Strategic Partners',
            y: 20, // Percentage y
            color: '#C789E9', // Purple
            dataLabelColor: colorText ? colorText : '#fff',
          },
          {
            name: 'Liquidity',
            y: 10, // Percentage y
            color: '#838AEC', // Blue
            dataLabelColor: colorText ? colorText : '#fff',
          },
          {
            name: 'Team / Advisors',
            y: 3, // Percentage y
            color: '#FFA65D', // Orange
            dataLabelColor: colorText ? colorText : '#fff',
          },
          {
            name: 'Marketing',
            y: 35, // Percentage y
            color: '#66DFCF', // Teal
            dataLabelColor: colorText ? colorText : '#fff',
          },
          {
            name: 'Community',
            y: 7, // Percentage y
            color: '#F2FF65', // Yellow
            dataLabelColor: colorText ? colorText : '#fff',
          },

          {
            name: 'Reserve / Contingency',
            y: 10, // Percentage y
            color: '#DF5D5F', // Red
            dataLabelColor: colorText ? colorText : '#fff',
          },
        ]}
        colorText={colorText}
      />
      {isMobile && <NotePieChart colorText={colorText || '#fff'} />}
    </div>
  );
};

const TextWithColor = styled.span<{ color: string }>`
  color: ${(props) => props.color};
`;

const NotePieChart = ({ colorText }: { colorText: any }) => {
  return (
    <div className="w-[343px] h-[248px] px-6 flex-col justify-start items-start gap-1 inline-flex">
      <div className="self-stretch justify-start items-center gap-3 inline-flex">
        <div className="w-1.5 h-1.5 bg-[#65bb5f] rounded-full" />
        <div className="grow shrink basis-0">
          <TextWithColor
            color={colorText || '#FFF'}
            className={`text-[13px] font-normal font-['Poppins'] leading-loose`}
          >
            Ecosystem / Development / Operation
          </TextWithColor>
          <span className="text-[#65bb5f] text-[13px] font-semibold font-['Poppins'] leading-loose">
            15%
          </span>
        </div>
      </div>
      <div className="self-stretch justify-start items-center gap-3 inline-flex">
        <div className="w-1.5 h-1.5 bg-[#c789e9] rounded-full" />
        <div className="grow shrink basis-0">
          <TextWithColor
            color={colorText || '#FFF'}
            className={`text-[13px] font-normal font-['Poppins'] leading-loose`}
          >
            Investors / Strategic Partners{' '}
          </TextWithColor>
          <span className="text-[#c789e9] text-[13px] font-semibold font-['Poppins'] leading-loose">
            20%
          </span>
        </div>
      </div>
      <div className="justify-start items-center gap-3 inline-flex">
        <div className="w-1.5 h-1.5 bg-[#838aec] rounded-full" />
        <div>
          <TextWithColor
            color={colorText || '#FFF'}
            className={`text-[13px] font-normal font-['Poppins'] leading-loose`}
          >
            Liquidity{' '}
          </TextWithColor>
          <span className="text-[#838aec] text-[13px] font-semibold font-['Poppins'] leading-loose">
            10%
          </span>
        </div>
      </div>
      <div className="justify-start items-center gap-3 inline-flex">
        <div className="w-1.5 h-1.5 bg-[#ffa55c] rounded-full" />
        <div>
          <TextWithColor
            color={colorText || '#FFF'}
            className={`text-[13px] font-normal font-['Poppins'] leading-loose`}
          >
            Team / Advisors{' '}
          </TextWithColor>
          <span className="text-[#ffa55c] text-[13px] font-semibold font-['Poppins'] leading-loose">
            3%
          </span>
        </div>
      </div>
      <div className="justify-start items-center gap-3 inline-flex">
        <div className="w-1.5 h-1.5 bg-[#65dad0] rounded-full" />
        <div>
          <TextWithColor
            color={colorText || '#FFF'}
            className={`text-[13px] font-normal font-['Poppins'] leading-loose`}
          >
            Marketing{' '}
          </TextWithColor>
          <span className="text-[#65dad0] text-[13px] font-semibold font-['Poppins'] leading-loose">
            35%
          </span>
        </div>
      </div>
      <div className="justify-start items-center gap-3 inline-flex">
        <div className="w-1.5 h-1.5 bg-[#edfb68] rounded-full" />
        <div>
          <TextWithColor
            color={colorText || '#FFF'}
            className={`text-[13px] font-normal font-['Poppins'] leading-loose`}
          >
            Community{' '}
          </TextWithColor>
          <span className="text-[#c7d43a] text-[13px] font-semibold font-['Poppins'] leading-loose">
            7%
          </span>
        </div>
      </div>
      <div className="self-stretch justify-start items-center gap-3 inline-flex">
        <div className="w-1.5 h-1.5 bg-[#df5e5f] rounded-full" />
        <div>
          <TextWithColor
            color={colorText || '#FFF'}
            className={`text-[13px] font-normal font-['Poppins'] leading-loose`}
          >
            Reserve / Contingency{' '}
          </TextWithColor>
          <span className="text-[#df5e5f] text-[13px] font-semibold font-['Poppins'] leading-loose">
            10%
          </span>
        </div>
      </div>
    </div>
  );
};

export default PieChartTokenomicsCompo;
