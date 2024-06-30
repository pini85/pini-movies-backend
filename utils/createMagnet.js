const magnet = (name, hash, url) => {
  return `magnet:?xt=urn:btih:${hash}&dn=${url}+Encoded+Movie+${name}&tr=https://track.one:1234/announce&tr=udp://track.two:80`;
};
module.exports = magnet;
