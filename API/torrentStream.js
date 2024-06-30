const axios = require('axios');

const apiDomain = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://www.my-cheap-ass-server.link';
  }
  return 'https://www.my-cheap-ass-server.link';
};

const getTorrentStream = async (magnet) => {
  const url = apiDomain();

  //change ? in magnet to #

  const link = encodeURIComponent(magnet.trim());

  const { data } = await axios.post(`${url}/api/torrents?torrent=${link}`);

  return data;
};
const getTorrentDetails = async () => {
  const url = apiDomain();
  const { data } = await axios.get(`${url}/api/torrents`);
  return data;
};
module.exports = {
  getTorrentStream,
  getTorrentDetails,
};
