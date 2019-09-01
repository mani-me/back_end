import { API } from 'aws-amplify';

export const RDSLambda = async (method, path, body) => {
  const apiName = 'LambdaRDSDev';
  const userInit = {
    body,
    headers: { 'Content-Type': 'application/json' }
  };
  if (method == 'post') {
    return await API.post(apiName, path, userInit);
  } else if (method == 'get') {
    return await API.get(apiName, path, userInit);
  } else if (method == 'put') {
    return await API.put(apiName, path, userInit);
  } else if (method == 'delete') {
    return await API.del(apiName, path, userInit);
  } else {
    return null;
  }
}

export const readUser = async (identityId) => {
  let userInit = {
    headers: { 'Content-Type': 'application/json' }
  };
  return await API.get('LambdaRDS', `/users/read/${identityId}`, userInit);
};

export const updateUserColumn = async (identityId, columnName, columnValue) => {
  let userData = {
    userid: identityId,
    columnname: columnName,
    columnvalue: columnValue
  };
  let userInit = {
    body: userData,
    headers: { 'Content-Type': 'application/json' }
  };
  return await API.post('LambdaRDS', '/users/update/column', userInit);
};

export const updateOrderColumn = (orderId, columnName, columnValue) => {
  let orderData = {
    orderId,
    columnname: columnName,
    columnvalue: columnValue
  };
  let userInit = {
    body: orderData,
    headers: { 'Content-Type': 'application/json' }
  };
  API.post('LambdaRDS', '/orders/update/column', userInit)
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
};

export const getNailProducts = async versionNumber => {
  let apiName = 'LambdaRDSCompany';
  let path = `/nailproducts/read/version/${versionNumber}`;

  return API.get(apiName, path);
};

export const getNailProductItem = async nailProductId => {
  let apiName = 'LambdaRDSCompany';
  let path = `/nailproducts/read/item/${nailProductId}`;

  return await API.get(apiName, path);
};

export const getCustomerCards = async customerId => {
  const userData = {};
  const userInit = {
    body: userData,
    headers: { 'Content-Type': 'application/json' }
  };
  const response = await API.get('LambdaPayment', `/cards/list/${customerId}`, userInit);
  return response;
};

export const addShippingAddress = async body => {
  // [req.body.shippingAddressId, req.body.userId, req.body.name, req.body.addressLine1, req.body.addressCity, req.body.addressZip, req.body.addressState, req.body.addressCountry, req.body.addressLatitude,
  // req.body.addressLongitude];
  const userInit = {
    body,
    headers: { 'Content-Type': 'application/json' }
  };
  const response = await API.post(
    'LambdaRDSClientNoncritical',
    '/shippingaddresses/create',
    userInit
  );
  return response;
};

export const getShippingAddresses = async identityId => {
  const userInit = {
    headers: { 'Content-Type': 'application/json' }
  };
  const response = await API.get(
    'LambdaRDSClientNoncritical',
    `/shippingaddresses/read/${identityId}`,
    userInit
  );
  return response;
};

export const getGroupOrders = async identityId => {
  const userInit = {
    headers: { 'Content-Type': 'application/json' }
  };
  const response = await API.get('LambdaRDS', `/grouporders/read/${identityId}`, userInit);
  return response;
};

export const getOrders = async groupOrderId => {
  const userInit = {
    headers: { 'Content-Type': 'application/json' }
  };
  const response = await API.get('LambdaRDS', `/orders/read/${groupOrderId}`, userInit);
  return response;
};

// LambdaServer
export const rotateImage = async (identityId, angle, fileName) => {
  const userInit = {
    body: { identityId, angle, fileName },
    headers: { 'Content-Type': 'application/json' }
  };
  const response = await API.post('LambdaServer', '/image/rotate/manual', userInit);
  return response;
};

export const sendEmail = async dynamicData => {
  const userInit = {
    body: { ...dynamicData },
    headers: { 'Content-Type': 'application/json' }
  };

  // const response = await API.post('LambdaServer', '/email', userInit);
  // return response;
  return null;
};

export const presignedImageUri = async (adminIdentityId, clientIdentityId, latestKeys) => {
  const init = {
    body: { adminIdentityId, clientIdentityId, latestKeys },
    headers: { 'Content-Type': 'application/json' }
  };
  const response = await API.post('LambdaServer', '/presigned', init);
  return response;
};

export const queryAdminDynamoDB = async user => {
  const response = await API.get('LambdaServer', `/access/${user}`);
  return response[0];
};

export const listAdminDynamoDB = async () => {
  const response = await API.get('LambdaServer', `/access`);
  return response;
};

export const addAttributeAdminDynamoDB = async (adminIdentityId, clientIdentityId) => {
  const init = {
    body: { adminIdentityId, clientIdentityId },
    headers: { 'Content-Type': 'application/json' }
  };
  const response = await API.put('LambdaServer', `/access/modify`, init);
  return response;
};

export const deleteAttributeAdminDynamoDB = async (adminIdentityId, clientIdentityId) => {
  const init = {
    body: { adminIdentityId, clientIdentityId },
    headers: { 'Content-Type': 'application/json' }
  };
  const response = await API.del('LambdaServer', `/access/modify`, init);
  return response;
};

// Subscription
export const getSubscription = async stripeId => {
  if (!stripeId) return null;
  const response = await API.get('LambdaPayment', `/subscription/retrieve/${stripeId}`);
  return response;
};

export const cancelSubscription = async subscriptionId => {
  if (!subscriptionId) return null;
  const response = await API.post('LambdaPayment', `/subscription/cancel/${subscriptionId}`);
  return response;
};

export const resumeSubscription = async subscriptionId => {
  if (!subscriptionId) return null;
  // if null, that means this user does not have any subscriptions, we need to subscribe this user to a new subscription with the right plan.
  const response = await API.post('LambdaPayment', `/subscription/resume/${subscriptionId}`);
  return response;
};

// Test this function
export const startSubscription = async (subscriptionPlan, customerId, discountCode) => {
  let userData = {
    pricingPlan: subscriptionPlan,
    customerId,
    discountCode: discountCode.toLowerCase()
  };
  let userInit = {
    body: userData,
    headers: { 'Content-Type': 'application/json' }
  };

  API.post('LambdaPayment', '/subscription/subscribe', userInit)
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
};

// Retry
const API_RETRIES = 7;
const INIT_TIMEOUT = 2000;

function wait(waitTime) {
  return new Promise(resolve => setTimeout(resolve, waitTime));
}

function retryAPI(apiName, path, myInit, waitTime, retry) {
  if (retry < 0) return Promise.reject(apiName + path);

  return API.post(apiName, path, myInit).catch(error => {
    return wait(waitTime).then(() => retryAPI(apiName, path, myInit, waitTime * 2, retry - 1));
  });
}
