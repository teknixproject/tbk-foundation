'use client';

import _ from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CSSProperties, useMemo } from 'react';
import styled from 'styled-components';

import { useActions } from '@/hooks/useActions';
import { GridItem } from '@/types/gridItem';
import { TooltipProvider } from '@radix-ui/react-tooltip';

import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { convertStyle } from '@/lib/utils';

interface ButtonCompoProps {
  data?: GridItem;
  style?: CSSProperties;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Button = ({ data, style, ...props }: ButtonCompoProps) => {
  const title = _.get(data, 'dataSlice.title', 'Button');
  const iconStart = _.get(data, 'dataSlice.iconStart', null);
  const iconEnd = _.get(data, 'dataSlice.iconEnd', null);
  const link = _.get(data, 'dataSlice.link', '');
  const route = _.get(data, 'dataSlice.route', '');
  const router = useRouter();

  const { handleActionClick } = useActions(data);

  const tooltip = useMemo(() => {
    return data?.tooltip;
  }, [data]);

  const handleRouteClick = () => {
    if (route) {
      router.push(route);
    }
  };

  const newStyle: CSSProperties = {
    ...style,
    position: 'initial',
    transform: '',
    margin: 0,
    padding: 0,
    maxHeight: '',
    maxWidth: '',
    width: '100%',
    height: '100%',
    background: '',
    backgroundColor: '',
  };

  const content = link ? (
    <Link href={link} passHref>
      <div
        style={convertStyle(newStyle)}
        className="!text-16-500 rounded-full flex items-center gap-2 text-center"
      >
        {iconStart && <span className="icon-start">{iconStart}</span>}
        <span>{title}</span>
        {iconEnd && <span className="icon-end">{iconEnd}</span>}
      </div>
    </Link>
  ) : (
    <CsButton
      type="button"
      style={convertStyle(newStyle)}
      onClick={route ? handleRouteClick : handleActionClick}
      className="cursor-pointer"
      //  isActive={setActive({ isMenu, data, cleanedPath })}
    >
      {iconStart && <span className="icon-start">{iconStart}</span>}
      <span>{title}</span>
      {iconEnd && <span className="icon-end">{iconEnd}</span>}
    </CsButton>
  );

  if (_.isEmpty(tooltip?.title)) return content;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div style={newStyle} className="text-[#858585]">
            {content}
          </div>
        </TooltipTrigger>
        <TooltipContent style={tooltip?.style}>
          <p>{tooltip?.title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface StylesProps {
  style?: {
    hover?: CSSProperties;
    [key: string]: any;
  };
  isActive?: boolean;
}

const flexCenter = {
  display: 'flex',
  'align-items': 'center',
  'justify-content': 'center',
};

const CsButton = styled.button<StylesProps>`
  box-sizing: border-box;

  ${(props) =>
    _.get(props, 'style.after')
      ? Object.entries(flexCenter)
          .map(([key, value]) => `${key}: ${value};`)
          .join('\n')
      : ''}
`;

export default Button;
