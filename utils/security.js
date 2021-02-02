const crypto = require("crypto");
const CryptoJS = require("crypto-js");

const md5 = (data, inputEncoding, encoding) => {
  if (!data) {
    return "";
  }

  inputEncoding = inputEncoding || "utf-8";
  encoding = encoding || "hex";
  const hash = crypto.createHash("md5");
  return hash.update(data, inputEncoding).digest(encoding);
};

const sha1 = (data, inputEncoding, encoding) => {
  if (!data) {
    return "";
  }

  inputEncoding = inputEncoding || "utf-8";
  encoding = encoding || "hex";
  const hash = crypto.createHash("sha1");
  return hash.update(data, inputEncoding).digest(encoding);
};

const hmacSHA1 = (secret, data) => {
  return crypto
    .createHmac("sha1", secret)
    .update(data)
    .digest()
    .toString("base64");
};

const hmacSHA512 = (secret, data) => {
  return CryptoJS.HmacSHA512(data, secret);
};

const hmacSHA256 = (secret, data) => {
  return CryptoJS.HmacSHA256(data, secret);
};

const AES = (secret, data) => {
  const ciphertext = CryptoJS.AES.encrypt(data, secret);
  return ciphertext.toString();
};

const AESDecrypted = (encrypted, secret) => {
  const ciphertext = CryptoJS.AES.decrypt(encrypted, secret);
  return ciphertext.toString();
};

module.exports = {
  md5,
  sha1,
  hmacSHA1,
  hmacSHA512,
  hmacSHA256,
  AES,
  AESDecrypted,
};
