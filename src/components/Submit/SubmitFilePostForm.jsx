import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPLOAD_FILE } from "../../graphql/mutations";

function SubmitFilePostForm(props) {
  const [file, setFile] = useState();

  const [uploadFile] = useMutation(UPLOAD_FILE);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    console.log(file);

    uploadFile({
      variables: {
        file: file,
      },
    });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default SubmitFilePostForm;
