'use client';

import _ from 'lodash';
import { usePathname, useSearchParams } from 'next/navigation'; // Thêm usePathname
import { useEffect, useState } from 'react';

import { useConstructorDataAPI } from '@/app/actions/use-constructor';
import { getDeviceType } from '@/lib/utils';
import { actionService } from '@/services';
import { apiCallService } from '@/services/apiCall';
import { stateManagerService } from '@/services/stateManagement';
import { apiResourceStore } from '@/stores';
import { actionsStore } from '@/stores/actions';
import { stateManagementStore } from '@/stores/stateManagement';
import { TTypeSelectState } from '@/types';

import dynamic from 'next/dynamic';

type DeviceType = 'mobile' | 'desktop';

const GridSystemContainer = dynamic(() => import('@/components/grid-systems'), {
  loading: () => <LoadingPage />,
  ssr: false,
});

const LoadingPage = dynamic(() => import('./loadingPage'), {
  ssr: false,
});

export default function HeaderClient(props: any) {
  const pathname = usePathname();
  const cleanedPath = pathname.startsWith('/') ? pathname.slice(1) : pathname;
  // const isPreviewUI = pathname === '/preview-ui'; // Dùng pathname thay vì props.pathName

  // console.log('HeaderClient props:', cleanedPath);

  return <RenderUIClient {...props} pathName={cleanedPath} />; // Truyền pathname vào RenderUIClient
}

const RenderUIClient = (props: any) => {
  const { addAndUpdateApiResource } = apiResourceStore();
  const { setDataTypeDocumentVariable } = stateManagementStore();
  const { setActions } = actionsStore();

  // Dùng props.pathName từ usePathname thay vì props gốc
  const { headerLayout, isLoading } = useConstructorDataAPI(props?.documentId, props?.pathName);

  const searchParams = useSearchParams();
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
  const uid = searchParams.get('uid') || 'home';

  const [deviceType, setDeviceType] = useState<DeviceType>(getDeviceType());
  const selectedHeaderLayout = headerLayout[deviceType] ?? headerLayout ?? {};

  console.log('selectedHeaderLayout:', selectedHeaderLayout);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      setDeviceType(getDeviceType());
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const getStates = async () => {
    const list: TTypeSelectState[] = ['appState', 'componentState', 'globalState'];
    try {
      await Promise.all(
        list.map(async (type: TTypeSelectState) => {
          const result = await stateManagerService.getData(
            type === 'globalState'
              ? { projectId: projectId ?? '', type }
              : { uid: uid ?? 'home', projectId: projectId ?? '', type }
          );
          if (_.isEmpty(result?.data)) return;
          const { state } = result?.data;
          if (_.isEmpty(state)) return;
          if (state) {
            setDataTypeDocumentVariable({ type, dataUpdate: state });
          }
        })
      );
    } catch (error) {
      console.log('🚀 ~ getStates ~ error:', error);
    }
  };

  const getActions = async () => {
    try {
      const result = await actionService.getData({
        projectId: projectId ?? '',
        uid: uid ?? '',
      });
      if (_.isEmpty(result?.data?.data)) return;
      setActions(result.data.data);
    } catch (error) {
      console.log('🚀 ~ getStates ~ error:', error);
    }
  };

  const getApiCall = async () => {
    try {
      const result = await apiCallService.get({ uid: uid ?? '', projectId: projectId ?? '' });
      addAndUpdateApiResource({ uid: uid ?? '', apis: result?.data?.apis });
    } catch (error) {
      console.log('🚀 ~ getApiCall ~ error:', error);
    }
  };

  useEffect(() => {
    if (!projectId) return;
    getStates();
    getApiCall();
    getActions();
  }, [uid, projectId]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="relative">
      {!_.isEmpty(selectedHeaderLayout) && (
        <GridSystemContainer
          isLoading={isLoading}
          {...props}
          page={selectedHeaderLayout || {}}
          deviceType={deviceType}
          isHeader
        />
      )}
    </div>
  );
};
