import React, { useEffect, useState } from "react";

import { API } from "aws-amplify";

import { ApiConstants } from "../consts";

type AlbumRatingPageProps = {};

type Album = { name: String; artist: String };

const AlbumRatingPage: React.FC<AlbumRatingPageProps> = () => {
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    API.get(ApiConstants.ALBUMS_NAME, ApiConstants.ALBUMS_PATH, {}).then(
      (res: { albums: Album[] }) => setAlbums(res.albums)
    );
  }, []);

  return (
    <>
      <p>
        One day I plan to hook this up with some kind of database and have an
        advanced album rating system, but for now here are some of my favorite
        albums in no particular order:
      </p>
      <ul>
        {albums.map((album, key) => (
          <li key={key}>
            {album.name} ({album.artist})
          </li>
        ))}
      </ul>
    </>
  );
};

export default AlbumRatingPage;
