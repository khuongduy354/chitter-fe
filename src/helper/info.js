import { message } from "antd";

export const info = (data) => {
  message.info(data);
};

export const error = (data) => {
  message.error(data);
};

export const success = (data) => {
  message.success(data);
};
