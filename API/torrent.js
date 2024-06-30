const axios = require('axios');
const getTorrentWithId = async (id) => {
  const { data } = await axios.get(
    `https://yts.mx/api/v2/list_movies.json?query_term=${id}`
  );

  if (data.data.movie_count === 0) {
    return false;
  } else {
    const torrents = data.data.movies[0].torrents;

    const compare = (a, b) => {
      const torrentA = a.seeds;
      const torrentB = b.seeds;
      let comparison = 0;
      if (torrentA < torrentB) {
        comparison = 1;
      } else if (torrentA > torrentB) {
        comparison = -1;
      }
      return comparison;
    };

    return torrents.sort(compare);
  }
};
module.exports = {
  getTorrentWithId,
};
