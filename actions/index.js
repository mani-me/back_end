export const setKeyValue = (key, value) => ({
  type: 'SET_KEY_VALUE',
  key,
  value
});

export const setIsAuth = isAuth => ({
  type: 'SET_IS_AUTH',
  isAuth
});

export const DEFAULT = () => ({
  type: 'DEFAULT'
});
