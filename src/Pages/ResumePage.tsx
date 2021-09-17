import React from "react";

interface Props {}

const ResumePage = (props: Props) => {
  return (
    <>
      <iframe
        src="resume.pdf"
        title="Embedded PDF"
        width="100%"
        height="100%"
      />
    </>
  );
};

export default ResumePage;
