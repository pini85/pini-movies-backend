const TorrentSearchApi = require('torrent-search-api');
const { getTmdbWithId } = require('../API/tmdb');
const { getTorrentWithId } = require('../API/torrent');
const magnet = require('../utils/createMagnet');
const { getTorrentStream, getTorrentDetails } = require('../API/torrentStream');
const parseTorrent = require('parse-torrent');

module.exports = (app) => {
  app.get('/api/torrents/:name', async (req, res) => {
    const { name } = req.params;

    try {
      TorrentSearchApi.enablePublicProviders();
      const torrents = await TorrentSearchApi.search(
        [
          'ThePirateBay',
          'KickassTorrents',
          'Yts',
          '1337x',
          // 'Torrentz2',
          // 'Rarbg',
          // 'Eztv',
          // 'LimeTorrents',
          // 'TorrentProject',
          // 'IsoHunt',
          // 'TorrentDownloads',
          // 'Torrentz2',
          // 'TorrentApi',
          // 'TorrentDownloads',
          // 'TorrentGalaxy',
          // 'TorrentHound',
          // 'Torrentz2',
          // 'Yts',
          // 'Zooqle',
          // 'Torrent9',
        ],
        name,
        'Movies',
        20
      );
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
      const sortedTorrents = torrents.sort(compare);

      const top5Torrents = sortedTorrents.slice(0, 5);

      const compareSize = (a, b) => {
        const torrentA = a.size;
        const torrentB = b.size;
        let comparison = 0;
        if (torrentA < torrentB) {
          comparison = -1;
        } else if (torrentA > torrentB) {
          comparison = 1;
        }
        return comparison;
      };
      const sortedSize = top5Torrents.sort(compareSize);

      const torrentsWithMagnets = await Promise.all(
        top5Torrents.map(async (torrent) => {
          const magnet = await TorrentSearchApi.getMagnet(torrent);
          return { ...torrent, magnet };
        })
      );
      res.send(torrentsWithMagnets);
    } catch (e) {
      res.status(400).send(e);
    }
  });
  app.get('/api/watch', async (req, res) => {
    try {
      const { torrent } = req.query;
      const data = await getTorrentStream(torrent);
      res.send(data);
    } catch (e) {
      res.status(400).send(e);
    }
  });
  app.get('/api/watch/torrentDetails', async (req, res) => {
    try {
      const data = await getTorrentDetails();
      res.send(data);
    } catch (e) {
      res.status(400).send(e);
    }
  });
};
