/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import _ from 'lodash';
import { useRouter } from 'next/navigation';
import React, { CSSProperties, useEffect, useRef, useState } from 'react';

import { cn, setActive } from '@/lib/utils';
import { Icon } from '@iconify/react/dist/iconify.js';
import styled from 'styled-components';

interface DropdownProps {
  id: string;
  style?: any;
  data?: any;
  childs?: any[];
  menuClassDropdow?: any;
}

const Dropdown: React.FC<DropdownProps> = ({
  id,
  style = '',
  data = {},
  childs = [],
  menuClassDropdow,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const router = useRouter();
  const pathname = _.get(props, 'pathname');
  const isMenu = _.get(props, 'isMenu');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const buttonSelectedClass = style?.dropdownStyles?.buttonSelected
    ? style.dropdownStyles.buttonSelected.toString()
    : '';
  const menuClass = style?.dropdownStyles?.menu ? style.dropdownStyles.menu.toString() : '';
  const buttonChildClass = style?.dropdownStyles?.button
    ? style.dropdownStyles.button.toString()
    : '';

  const styleChild: React.CSSProperties = data?.dropdown?.styleChild || {};

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (childs.length > 0 && isMenu) {
      const matchedChild = childs.find(
        (child) => child?.action?.pageId && pathname === `/${child.action.pageId}`
      );

      if (matchedChild) {
        setSelectedItem(matchedChild.pageId || _.get(matchedChild, 'dataSlice.title') || 'Unnamed');
      } else {
        const firstChild = childs[0];
        setSelectedItem(firstChild.pageId || _.get(firstChild, 'dataSlice.title') || 'Unnamed');
      }
    } else {
      setSelectedItem(data?.name || 'Dropdown');
    }
  }, [pathname, childs, data, isMenu]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleItemClick = (item: any) => {
    if (item?.action?.pageId) router.push(`/${item.action.pageId}`);
    setSelectedItem(item?.name || null);
    setIsOpen(false);
  };

  const renderChild = (child: any) => {
    if (!child || !child.value) return null;

    switch (child.value) {
      case 'button':
        return (
          <button
            onClick={() => handleItemClick(child)}
            className={`cursor-pointer w-full text-left px-4 py-2 rounded-xl  hover:bg-gray-100 transition-colors ${buttonChildClass}`}
          >
            {_.get(child, 'dataSlice.title') || 'Unnamed Button'}
          </button>
        );
      case 'text':
        return (
          <div className={`px-4 py-2  rounded-lg ${buttonChildClass}`}>
            {_.get(child, 'dataSlice.title') || 'Unnamed Text'}
          </div>
        );
      case 'dropdown':
        return (
          <Dropdown
            id={child.id || `${id}-child-${Math.random()}`}
            style={child.style || ''}
            data={child || {}}
            childs={child.childs || []}
            menuClassDropdow={menuClass}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div ref={dropdownRef} className={cn(`relative inline-block`, menuClassDropdow)}>
      <CsButtonSelected
        onClick={handleToggle}
        className={`transition-colors flex items-center gap-2 focus:bg-[##ffffff47] ${buttonSelectedClass}`}
        isActive={setActive({ isMenu, data, cleanedPath: pathname })}
        style={style}
      >
        {selectedItem}
        <span>
          {isOpen ? (
            <Icon icon="iconamoon:arrow-up-2" width="24" height="24" />
          ) : (
            <Icon icon="iconamoon:arrow-down-2" width="24" height="24" />
          )}
        </span>
      </CsButtonSelected>

      {isOpen && (
        <div
          className={cn('absolute left-0 mt-2 z-10 rounded-xl min-w-40', menuClass, {
            'bg-white': !styleChild?.backgroundColor,
            'text-gray-700': !styleChild?.color,
            'p-2':
              !styleChild?.paddingTop &&
              !styleChild?.paddingRight &&
              !styleChild?.paddingBottom &&
              !styleChild?.paddingLeft,
          })}
          style={styleChild}
        >
          {childs.length > 0 ? (
            childs.map((item: any, index: number) => (
              <div key={item?.id || index} className="cursor-pointer">
                {renderChild(item)}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">No items</div>
          )}
        </div>
      )}
    </div>
  );
};

interface StylesProps {
  style?: {
    hover?: CSSProperties;
    [key: string]: any;
  };
  isActive?: boolean;
}

const CsButtonSelected = styled.button<StylesProps>`
  box-sizing: border-box;
  ${(props) =>
    props.isActive && props.style?.hover
      ? Object.entries(props.style.hover)
          .map(([key, value]) => `${key}: ${value};`)
          .join('\n')
      : ''}
`;

export default Dropdown;
