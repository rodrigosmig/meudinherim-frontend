import { ITokenContext } from './../types/auth';
import { destroyCookie, parseCookies, setCookie } from 'nookies';

export const ACCESS_TOKEN_KEY = 'meudinherim.token';

const ONE_SECOND = 1;
const ONE_MINUTE = ONE_SECOND * 60;
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;

export const tokenService = {
  save: (accessToken: string, context: ITokenContext) => {
    setCookie(context, ACCESS_TOKEN_KEY, accessToken, {
      maxAge: ONE_HOUR,
      path: '/'
    });
  },
  get: (context: ITokenContext) => {
    const cookies = parseCookies(context);

    return {
      token: cookies[ACCESS_TOKEN_KEY] || ''
    }
  },
  delete: (context: ITokenContext) => {
    destroyCookie(context, ACCESS_TOKEN_KEY);
  }
}
