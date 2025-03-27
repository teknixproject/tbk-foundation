/* eslint-disable @typescript-eslint/no-unused-vars */
import _ from 'lodash';

import { RenderSlice } from '../grid-systems';

interface NavigationProps {
  id: string;
  style?: string;
  data?: any;
  childs?: any[];
}

const Navigation = ({ id, style, data, childs }: NavigationProps) => {
  console.log('🚀 ~ Navigation ~ childs:', childs);
  const isChilds = !_.isEmpty(childs);

  return isChilds ? (
    <>
      {_.map(childs, (child, index) => (
        <RenderSlice slice={child} key={index} idParent={id} />
      ))}
    </>
  ) : (
    <div className="">Navigation</div>
  );
};

export default Navigation;
