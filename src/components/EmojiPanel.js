import { Button, Divider } from "antd";
import { useEffect, useState } from "react";
import { FileUploadComponent } from "./FileUpload";
import { RESTQuery } from "../helper/restQuery";

export const EmojiPanel = ({ user, setPanelMode }) => {
  const [emojis, setEmojis] = useState([]);
  useEffect(() => {
    async function getEmojis() {
      const emojis = await RESTQuery.getMyEmojis(user.accessToken);
      if (emojis) setEmojis(emojis);
    }
    getEmojis();
  }, []);
  const deleteEmoji = async (emo) => {
    const isOk = await RESTQuery.deleteEmoji(user.accessToken, emo.id);
    if (isOk) {
      setEmojis(emojis.filter((e) => e.id !== emo.id));
      alert("Delete success");
    } else {
      alert("Delete failed");
    }
  };

  const fileUploadCb = async (files) => {
    const formdata = new FormData();
    [...files].forEach((file, idx) =>
      formdata.append("emoji", file, file.name)
    );
    const isOk = await RESTQuery.uploadEmoji(user.accessToken, formdata);
    if (isOk) {
      alert("Upload success");
    } else {
      alert("Upload failed");
    }
  };
  return (
    <div>
      <Divider>Emoji Panel</Divider>
      {emojis.length > 0 && (
        <div>
          <Divider>My Emojis</Divider>
          <ul>
            {emojis.map((emoji, idx) => (
              <li key={idx}>
                {emoji.name}
                <span> </span>
                <Button onClick={() => deleteEmoji(emoji)}>Delete</Button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <FileUploadComponent cb={fileUploadCb} />
      <Button onClick={() => setPanelMode("chat")}>Back To Chat</Button>
    </div>
  );
};
