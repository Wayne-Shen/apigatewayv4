const crypto = require('crypto');

const getDateTime = () => {
  return new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '');
};

const getDate = () => {
  return getDateTime().substr(0, 8);
};

const hmac = (key, string, encoding) => {
  return crypto
    .createHmac('sha256', key)
    .update(string, 'utf8')
    .digest(encoding);
};

const hash = (string, encoding) => {
  return crypto
    .createHash('sha256')
    .update(string, 'utf8')
    .digest(encoding);
};

const canonicalHeaders = headers => {
  function trimAll(header) {
    return header
      .toString()
      .trim()
      .replace(/\s+/g, ' ');
  }
  return Object.keys(headers)
    .sort((a, b) => {
      return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
    })
    .map(key => {
      return key.toLowerCase() + ':' + trimAll(headers[key]);
    })
    .join('\n');
};

const signedHeaders = headers => {
  return Object.keys(headers)
    .map(key => {
      return key.toLowerCase();
    })
    .sort()
    .join(';');
};

//Task 1
const createCanonicalRequest = request => {
  const canonicalRequest = [
    request.method,
    request.path,
    request.query,
    canonicalHeaders(request.headers) + '\n',
    signedHeaders(request.headers),
    hash(request.data, 'hex')
  ].join('\n');

  console.log('========Canonical Request============');
  console.log(canonicalRequest);
  console.log('========Canonical Request============\n');

  return canonicalRequest;
};

//Task 2
const createStringToSign = (options, request) => {
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    getDateTime(),
    getDate() + `/${options.region}/${options.service}/aws4_request`,
    hash(createCanonicalRequest(request), 'hex')
  ].join('\n');

  console.log('========String to sign============');
  console.log(stringToSign);
  console.log('========String to sign============\n');
  return stringToSign;
};

//Task 3
const calculateSignature = (options, request) => {
  const kSecret = options.secretAccessKey;
  const kDate = hmac('AWS4' + kSecret, getDate());
  const kRegion = hmac(kDate, options.region);
  const kService = hmac(kRegion, options.service);
  const kSigning = hmac(kService, 'aws4_request');
  const singature = hmac(kSigning, createStringToSign(options, request), 'hex');

  console.log('========Authorization============');
  console.log(singature);
  console.log('========Authorization============\n');
  return singature;
};

const calculateAuthorization = (options, request) => {
  return `AWS4-HMAC-SHA256 Credential=${options.accessKeyId}/${getDate()}/${
    options.region
  }/${options.service}/aws4_request, SignedHeaders=${signedHeaders(
    request.headers
  )}, Signature=${calculateSignature(options, request)}`;
};

module.exports = {
  calculateAuthorization: calculateAuthorization,
  getDate: getDate,
  getDateTime: getDateTime,
  hash: hash
};
