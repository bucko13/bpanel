import { getClient } from '@bpanel/bpanel-utils';
import bcurl from 'bcurl';

import * as types from '../constants/node';
import { setChainInfo, getGenesisBlock } from './chainActions';

const client = getClient();

export function setNodeInfo(info) {
  return {
    type: types.SET_NODE,
    payload: info
  };
}

export function requestingNode(loadingState) {
  return {
    type: types.SET_LOADING,
    payload: loadingState
  };
}

export function setBcoinUri(uri) {
  return {
    type: types.SET_BCOIN_URI,
    payload: uri
  };
}

export function getNodeInfo() {
  return async dispatch => {
    dispatch(requestingNode(true));
    dispatch(getServerInfo());
    dispatch(getGenesisBlock());
    try {
      const nodeInfo = await client.node.getInfo();
      dispatch(requestingNode(false));
      dispatch(setNodeInfo(nodeInfo));
      dispatch(setChainInfo(nodeInfo.chain));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };
}

export function getServerInfo() {
  return async dispatch => {
    try {
      const client = bcurl.client({ port: 5000 });
      const response = await client.get('server');
      dispatch(setBcoinUri(response.bcoinUri));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('There was a problem querying the server:', e.stack);
    }
  };
}
export default {
  setNodeInfo,
  requestingNode,
  getNodeInfo
};
