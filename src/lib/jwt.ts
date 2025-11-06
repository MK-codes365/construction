import CryptoJS from 'crypto-js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

function base64UrlEncode(str: string) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string) {
  // pad
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return Buffer.from(str, 'base64').toString();
}

export function signJwt(payload: Record<string, any>, expiresInSeconds = 3600) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + expiresInSeconds;
  const body = { ...payload, iat, exp };

  const headerB = base64UrlEncode(JSON.stringify(header));
  const bodyB = base64UrlEncode(JSON.stringify(body));
  const toSign = `${headerB}.${bodyB}`;
  const signature = CryptoJS.HmacSHA256(toSign, JWT_SECRET).toString(CryptoJS.enc.Base64);
  const signatureB = signature.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  return `${toSign}.${signatureB}`;
}

export function verifyJwt(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [headerB, bodyB, sig] = parts;
    const toSign = `${headerB}.${bodyB}`;
    const expectedSig = CryptoJS.HmacSHA256(toSign, JWT_SECRET).toString(CryptoJS.enc.Base64).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    if (sig !== expectedSig) return null;
    const bodyJson = base64UrlDecode(bodyB);
    const payload = JSON.parse(bodyJson);
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

export default { signJwt, verifyJwt };
