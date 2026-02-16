import zlib from 'zlib';

export const decodeRequest = (req: string) => {
  const decoded = Buffer.from(decodeURIComponent(req), 'base64');
  return zlib.inflateRawSync(decoded).toString();
};

export const decodeResponse = (res: string) => {
  const xml = Buffer.from(res, 'base64').toString('utf-8');
  return xml;
};
