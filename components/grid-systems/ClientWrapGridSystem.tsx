/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import _ from 'lodash';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useConstructorDataAPI, usePreviewUI } from '@/app/actions/use-constructor';
import GridSystemContainer from '@/components/grid-systems';
import { getDeviceType } from '@/lib/utils';
import { actionService } from '@/services';
import { apiCallService } from '@/services/apiCall';
import { stateManagerService } from '@/services/stateManagement';
import { apiResourceStore, layoutStore } from '@/stores';
import { actionsStore } from '@/stores/actions';
import { stateManagementStore } from '@/stores/stateManagement';
import { TTypeSelectState } from '@/types';

import LoadingPage from './loadingPage';
import SandPackUI from './preview-ui';

type DeviceType = 'mobile' | 'desktop';
export default function ClientWrapper(props: any) {
  // const { isLoading } = useConstructorDataAPI(props.documentId, props.pathName);

  const isPreviewUI = _.get(props, 'pathName') === 'preview-ui';

  if (isPreviewUI) {
    return <PreviewUI {...props} />;
  }
  return <RenderUIClient {...props} />;
}

const RenderUIClient = (props: any) => {
  //#region store
  const { setData } = layoutStore();
  const { addAndUpdateApiResource, apiResources } = apiResourceStore();
  const { setDataTypeDocumentVariable } = stateManagementStore();
  const { setActions } = actionsStore();

  const { bodyLayout, footerLayout, headerLayout, isLoading } = useConstructorDataAPI(
    props.documentId,
    props.pathName
  );

  useEffect(() => {
    if (bodyLayout) setData(bodyLayout);
  }, []);

  // #region hooks
  const searchParams = useSearchParams();
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
  const uid = searchParams.get('uid') || 'home';

  const [deviceType, setDeviceType] = useState<DeviceType>(getDeviceType());
  const selectedHeaderLayout = headerLayout[deviceType] ?? headerLayout ?? {};
  const selectedBodyLayout = bodyLayout[deviceType] ?? bodyLayout ?? {};
  const selectedFooterLayout = footerLayout[deviceType] ?? footerLayout ?? {};

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      setDeviceType(getDeviceType());
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [props.page]);

  const getStates = async () => {
    const list: TTypeSelectState[] = ['appState', 'componentState', 'globalState'];
    try {
      await Promise.all(
        list.map(async (type: TTypeSelectState) => {
          const result = await stateManagerService.getData(
            type === 'globalState'
              ? {
                  projectId: projectId ?? '',
                  type,
                }
              : {
                  uid: uid ?? '',
                  projectId: projectId ?? '',
                  type,
                }
          );
          if (_.isEmpty(result?.data)) return;
          const { state } = result?.data;
          if (_.isEmpty(state)) return;

          if (state) {
            setDataTypeDocumentVariable({
              type,
              dataUpdate: state,
            });
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
    getStates();
    getApiCall();
    getActions();
  }, [uid, projectId]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="relative">
      {/* Header */}
      <GridSystemContainer
        isLoading={isLoading}
        {...props}
        page={selectedHeaderLayout || {}}
        deviceType={deviceType}
        isHeader
      />
      {/* Body */}
      <GridSystemContainer
        isLoading={isLoading}
        {...props}
        page={selectedBodyLayout || {}}
        deviceType={deviceType}
        isBody
      />
      {/* Footer */}
      <GridSystemContainer
        isLoading={isLoading}
        {...props}
        page={selectedFooterLayout || {}}
        deviceType={deviceType}
        isFooter
      />
    </div>
  );
};

const PreviewUI = (props: any) => {
  //#region store
  const { setData } = layoutStore();
  const { addAndUpdateApiResource, apiResources } = apiResourceStore();
  const { setDataTypeDocumentVariable } = stateManagementStore();
  const { setActions } = actionsStore();

  // #region hooks
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');
  const [deviceType, setDeviceType] = useState(getDeviceType());
  const { dataPreviewUI, isLoading } = usePreviewUI(projectId ?? '');

  // #region state
  const uid = searchParams.get('uid');
  const isPage = _.get(dataPreviewUI, 'data.typePreview') === 'page';
  const layout = _.get(dataPreviewUI, 'data.previewData');

  //#region function
  useEffect(() => {
    const handleResize = () => setDeviceType(getDeviceType());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getStates = async () => {
    const list: TTypeSelectState[] = ['appState', 'componentState', 'globalState'];
    try {
      await Promise.all(
        list.map(async (type: TTypeSelectState) => {
          const result = await stateManagerService.getData(
            type === 'globalState'
              ? {
                  projectId: projectId ?? '',
                  type,
                }
              : {
                  uid: uid ?? '',
                  projectId: projectId ?? '',
                  type,
                }
          );
          if (_.isEmpty(result?.data)) return;
          const { state } = result?.data;
          if (_.isEmpty(state)) return;

          if (state) {
            setDataTypeDocumentVariable({
              type,
              dataUpdate: state,
            });
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
    if (layout) setData(layout);

    getStates();
    getApiCall();
    getActions();
  }, [uid, projectId]);

  //#region render
  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="component-preview-container">
      {isPage ? (
        <GridSystemContainer
          isLoading={isLoading}
          {...props}
          page={layout[deviceType] || {}}
          deviceType={deviceType}
        />
      ) : (
        <SandPackUI dataPreviewUI={dataPreviewUI} />
      )}
    </div>
  );
};
