import { useState } from "react";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

export default function ShowHidePassword({ name }) {
  const [isVisible, setVisible] = useState(false);

  const toggle = () => {
    setVisible(!isVisible);
  };

  return (
    <div className="form-group">
      <input type={!isVisible ? "password" : "text"} name={name} required />
      <span className="icon" onClick={toggle}>
        {isVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
      </span>
    </div>
  );
}
