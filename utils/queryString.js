import { Storage } from 'aws-amplify';
import { setStorageBucket, setDefaultBucket } from '../components/Aws';
import { presignedImageUri } from './lambdaFunctions';

// const IMAGE_KEY_MAP = new Map();
// IMAGE_KEY_MAP.set('leftFingers', 0);
// IMAGE_KEY_MAP.set('leftThumb', 1);
// IMAGE_KEY_MAP.set('rightFingers', 2);
// IMAGE_KEY_MAP.set('rightThumb', 3);
// IMAGE_KEY_MAP.set('side', 4);
// IMAGE_KEY_MAP.set('left_fingers', 0);
// IMAGE_KEY_MAP.set('left_thumb', 1);
// IMAGE_KEY_MAP.set('right_fingers', 2);
// IMAGE_KEY_MAP.set('right_thumb', 3);

export const KEY_MAP = [
  {
    camelCase: 'leftFingers',
    statusCamel: 'statusLeftFingers',
    statusLower: 'statusleftfingers',
    versionLower: 'versionleftfingers',
    versionCamel: 'versionLeftFingers',
  },
  {
    camelCase: 'leftThumb',
    statusCamel: 'statusLeftThumb',
    statusLower: 'statusleftthumb',
    versionLower: 'versionleftthumb',
    versionCamel: 'versionLeftThumb',
  },
  {
    camelCase: 'rightFingers',
    statusCamel: 'statusRightFingers',
    statusLower: 'statusrightfingers',
    versionLower: 'versionrightfingers',
    versionCamel: 'versionRightFingers',
  },
  {
    camelCase: 'rightThumb',
    statusCamel: 'statusRightThumb',
    statusLower: 'statusrightthumb',
    versionLower: 'versionrightthumb',
    versionCamel: 'versionRightThumb',
  },
  {
    camelCase: 'side',
    statusCamel: 'statusSide',
    statusLower: 'statusside',
    versionLower: 'versionside',
    versionCamel: 'versionSide',
  }
];

const listUserFiles = async identityId => {
  const result = await Storage.list(``, { level: 'private', identityId });
  return result;
};

const getLatestKeys = (userFiles, userData) => {
  // listedKeys[0] == {key: leftFingers, lastModified: }... leftThumb, rightFingers, rightThumb, side
  let latestKeys = [{}, {}, {}, {}, {}];

  if (!Array.isArray(userFiles)) return listedKeys;

  // we want to use version, use image name, then most recent.
  // so we check for all 4 types in the entire storage, and retrieve the most recent,
  // do for all 5 Pictures
  // move map

  KEY_MAP.map((item, i) => {
    const version = typeof userData[item.versionLower] == 'number' && userData[item.versionLower] > 1 ?
      '.' + userData[item.versionLower] : '';
    const lowJpg = item.camelCase + '@1x' + version + '.jpg';
    const lowPng = item.camelCase + '@1x' + version + '.png';
    const highJpg = item.camelCase + version + '.jpg';
    const highPng = item.camelCase + version + '.png';

    const imagePriority = [lowJpg, lowPng, highJpg, highPng];
    let imageObject = null;

    imagePriority.map(generatedItem => {
      userFiles.map(storageItem => {
        if (storageItem.key == generatedItem && (imageObject == null || storageItem.lastModified.getTime() > imageObject.lastModified.getTime())) {
          imageObject = storageItem;
        }
      });
    });

    if (imageObject) {
      latestKeys[i] = imageObject;
    }
  });


  // it is going through every file in the storage and storing the latest one in the array of objects
  // userFiles.map(item => {
  //   let key = item.key;
  //   if (key) {
  //     // item.key is leftFingers.png -> _keyArray is [leftFingers, .png]
  //     const _keyArray = key.split('.');
  //     const fileName = _keyArray[0];
  //
  //     const compressedKey = _keyArray[0] + '@1x.' + _keyArray[1];
  //     userFiles.map(item2 => {
  //       if (item2.key == compressedKey) key = compressedKey;
  //     });
  //
  //     // If it is a valid key, check for duplicates and if newer file, replace.
  //     if (IMAGE_KEY_MAP.has(fileName)) {
  //       const lastModified = item.lastModified.getTime();
  //       const index = IMAGE_KEY_MAP.get(fileName);
  //
  //       if (
  //         !latestKeys[index] ||
  //         !latestKeys[index].lastModified ||
  //         lastModified > latestKeys[index].lastModified
  //       ) {
  //         const newKey = { key, lastModified };
  //         latestKeys[index] = newKey;
  //       }
  //     }
  //   }
  // });


  // console.log(latestKeys);
  return latestKeys;
};

// const getUserFile = async (s3Key, identityId) => {
//   const result = await Storage.get(s3Key, { level: 'private', identityId }, { expires: 60 * 10 });
//   return result;
// };
//
// // get this from a lambda function (adminIdentityId, userIdentityId, latestKeys), these two functions
// const getLatestSignedUris = async (latestKeys, identityId) => {
//   let signedUris = ['', '', '', '', ''];
//   for (let i = 0; i < 5; ++i) {
//     signedUris[i] = await getUserFile(latestKeys[i].key, identityId);
//   }
//   // latestKeys.map(async (item, i) => {
//   //   const uri = await getUserFile(item.key, identityId);
//   //   signedUris[i] = uri;
//   // })
//   return signedUris;
// };

export const getSignedUriArray = async (adminIdentityId, userObject) => {
  const userFiles = await listUserFiles(userObject.userid);
  const latestKeys = getLatestKeys(userFiles, userObject);
  // const signedUriArray = await getLatestSignedUris(latestKeys, clientIdentityId);
  const signedUriArray = await presignedImageUri(adminIdentityId, userObject.userid, latestKeys);
  return { latestKeys, signedUriArray };
};
