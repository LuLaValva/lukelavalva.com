import React from "react";
import styles from "../../styles/AcademicPaper.module.css";

export type Citation = {
  title: string;
  authors?: string[];
  year?: number;
  url?: string;
};

type Props = {
  citations: { [key: string]: Citation };
};

const formatLastNameFirst = (name: string) => {
  const lastSpace = name.lastIndexOf(" ");
  return `${name.substring(lastSpace + 1)}, ${name.substring(0, lastSpace)}`;
};

const MAX_AUTHORS_ET_ALL = 5;

const stringifyAuthors = (authors?: string[]) => {
  if (!authors || authors.length === 0) return "";
  else if (authors.length <= MAX_AUTHORS_ET_ALL)
    return (
      formatLastNameFirst(authors[0]) +
      authors
        .slice(1)
        .reduce((fullString, nextName) => fullString + " and " + nextName, "") +
      "."
    );
  else return `${formatLastNameFirst(authors[0])} et. al.`;
};

const Bibliography = (props: Props) => {
  return (
    <>
      <h2>Bibliography</h2>
      {Object.values(props.citations)
        .sort((a, b) =>
          stringifyAuthors(a.authors) + a.title <
          stringifyAuthors(b.authors) + b.title
            ? -1
            : 1
        )
        .map((citation, index) => (
          <div className={styles.citation} key={index}>
            {stringifyAuthors(citation.authors)} <i>{citation.title}</i>{" "}
            {citation.year && `(${citation.year})`}{" "}
            {citation.url && <a href={citation.url}>{citation.url}</a>}
          </div>
        ))}
    </>
  );
};

export default Bibliography;
