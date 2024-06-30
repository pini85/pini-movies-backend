const sign = require('jsonwebtoken').sign;
function signJwtToken(data) {
  return sign(data, key);
}
function getSteamUrl(torrent, file, encodeToken, output) {
  if (encodeToken) {
    return getRouteUrl(
      'getStream',
      {
        torrent: signJwtToken(
          {
            torrent,
            file,
            output,
          },
          encodeToken
        ),
      },
      {}
    );
  }
}
//export function
module.exports = getSteamUrl;
