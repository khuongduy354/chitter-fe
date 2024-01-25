import { Button, Form, Input } from "antd";
import { useState } from "react";

export const FileUploadComponent = ({ cb = null }) => {
  const [files, setFiles] = useState([]);
  const onFileUploaded = (e) => {
    setFiles(e.target.files);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (cb) await cb(files);

    // const formdata = new FormData();
    // formdata.append("file", file);
    // const isOk = await RESTQuery.uploadEmoji(formdata);
    // if (isOk) {
    //   alert("Upload success");
    // } else {
    //   alert("Upload failed");
    // }
  };
  return (
    <div>
      <Input type="file" onChange={onFileUploaded} multiple />
      <Button onClick={(e) => onSubmit(e)}>Submit</Button>
    </div>
  );
};
