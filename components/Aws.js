import Amplify from 'aws-amplify';

export function configureAmplify() {
  Amplify.configure({
    Auth: {
      identityPoolId: 'us-west-2:b6aead91-652e-4a92-9fb4-59b3dbf07a06',
      region: 'us-west-2',
      userPoolId: 'us-west-2_kmveSnn8d',
      userPoolWebClientId: '3747ab1hdfmk20hch02lsc8khk',
      // mandatorySignIn: true
    },
    Storage: {
      bucket: 'mani-me-react-native-userfiles-1',
      region: 'us-west-2'
    },
    API: {
      endpoints: [
        {
          name: 'LambdaRDSClient',
          endpoint: 'https://2ehwnnicy0.execute-api.us-west-1.amazonaws.com/v1',
          service: 'execute-api',
          region: 'us-west-1'
        },
        {
          name: 'LambdaServer',
          endpoint: 'https://frclo239p9.execute-api.us-west-1.amazonaws.com/production',
          service: 'execute-api',
          region: 'us-west-1'
        }
      ]
    }
  });
}

export function setDefaultBucket() {
}

export function setStorageBucket(bucket) {
}
