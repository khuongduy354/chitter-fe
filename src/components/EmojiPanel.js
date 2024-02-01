import { Button, Divider } from "antd";
import { useContext, useEffect, useState } from "react";
import { FileUploadComponent } from "./FileUpload";
import { RESTQuery } from "../helper/restQuery";
import { AppContext } from "../App";

export const EmojiPanel = () => {
  const { user, setPanelMode } = useContext(AppContext);
  const [emojis, setEmojis] = useState([]);
  async function getEmojis() {
    const emojis = await RESTQuery.getMyEmojis(user.accessToken);
    if (emojis) setEmojis(emojis);
  }
  useEffect(() => {
    getEmojis();
  }, []);
  const deleteEmoji = async (emo) => {
    const isOk = await RESTQuery.deleteEmoji(user.accessToken, emo.id);
    if (isOk) {
      getEmojis();
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
      getEmojis();
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
            {emojis.map((emoji, idx) => {
              console.log(emoji);
              return (
                <li key={idx}>
                  <img width="16" height="16" src={emoji.img_url} />
                  <span> </span>
                  <Button onClick={() => deleteEmoji(emoji)}>Delete</Button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <FileUploadComponent cb={fileUploadCb} />
      <Button onClick={() => setPanelMode("chat")}>Back To Chat</Button>
    </div>
  );
};
