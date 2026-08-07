import { FC, Fragment, ReactNode, useState } from "react";
import { Modal } from "antd";
import "./index.less";

const AuthLayout: FC<{ children?: ReactNode }> = ({ children }) => {
  const [agreed, setAgreed] = useState(false);

  return children;

  return (
    <Fragment>
      <Modal
        open={!agreed}
        onOk={() => setAgreed(true)}
        onCancel={() => setAgreed(false)}
        title="天翼云电脑续命工具-免责声明"
      ></Modal>

      {agreed ? children : null}
    </Fragment>
  );
};

export default AuthLayout;
