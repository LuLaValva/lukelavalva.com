import React from "react";

const ALBUMS = [
  { name: "Graceland", artist: "Paul Simon" },
  { name: "Hawaii: Part II", artist: "Miracle Musical" },
  { name: "Bookends", artist: "Simon & Garfunkel" },
  { name: "In Between Dreams", artist: "Jack Johnson" },
  { name: "Comfort Eagle", artist: "Cake" },
  {
    name: "Lola vs. Powerman and the Money-Go-Round, Pt. 1",
    artist: "The Kinks",
  },
  { name: "Magical Mystery Tour", artist: "The Beatles" },
  { name: "Out of the Blue", artist: "Electric Light Orchestra" },
  { name: "Marvin's Marvelous Mechanical Museum", artist: "Tally Hall" },
];

const AlbumRatingPage = () => {
  return (
    <>
      <p>
        One day I plan to hook this up with some kind of database and have an
        advanced album rating system, but for now here are some of my favorite
        albums in no particular order:
      </p>
      <ul>
        {ALBUMS.map((album, key) => (
          <li key={key}>
            {album.name} ({album.artist})
          </li>
        ))}
      </ul>
    </>
  );
};

export default AlbumRatingPage;
