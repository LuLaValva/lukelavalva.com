import React from "react";

type AlbumRatingPageProps = {};

const AlbumRatingPage: React.FC<AlbumRatingPageProps> = () => {
  return (
    <>
      <p>
        One day I plan to hook this up with some kind of database and have an
        advanced album rating system, but for now here are some of my favorite
        albums in no particular order:
      </p>
      <ul>
        <li>Graceland (Paul Simon)</li>
        <li>Hawaii: Part II (Miracle Musical)</li>
        <li>Bookends (Simon & Garfunkel)</li>
        <li>In Between Dreams (Jack Johnson)</li>
        <li>Comfort Eagle (Cake)</li>
        <li>Lola vs. Powerman and the Money-Go-Round, Pt. 1 (The Kinks)</li>
        <li>Magical Mystery Tour (The Beatles)</li>
        <li>Out of the Blue (Electric Light Orchestra)</li>
        <li>Marvin's Marvelous Mechanical Museum (Tally Hall)</li>
      </ul>
    </>
  );
};

export default AlbumRatingPage;
