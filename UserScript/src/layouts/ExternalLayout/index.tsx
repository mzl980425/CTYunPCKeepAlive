import { FC, Fragment, ReactNode } from "react";
import { useDebounce } from "ahooks";
import { Flex, Modal } from "antd";
import { CheckCircleTwoTone, CloseCircleTwoTone, LoadingOutlined } from "@ant-design/icons";
import useCTYunSDK from "./useCTYunSDK";
import "./index.less";

const ExternalLayout: FC<{ children?: ReactNode }> = ({ children }) => {
  const ctYunSDKStatus = useCTYunSDK();

  const allReady = useDebounce(ctYunSDKStatus === "ready");

  const renderStatus = (status: "unset" | "loading" | "ready" | "error") => {
    if (status === "error") {
      return <CloseCircleTwoTone twoToneColor="#ff4d4f" />;
    } else if (status === "ready") {
      return <CheckCircleTwoTone twoToneColor="#52c41a" />;
    } else if (status === "loading") {
      return <LoadingOutlined spin style={{ color: "#1677ff" }} />;
    } else {
      return null;
    }
  };

  return (
    <Fragment>
      <Modal open={!allReady} title="天翼云电脑续命工具-启动中..." footer={null} closable={false}>
        <Flex orientation="vertical" gap={4}>
          <Flex gap={6} align="center">
            云电脑SDK
            {renderStatus(ctYunSDKStatus)}
          </Flex>
        </Flex>
      </Modal>

      {allReady ? children : null}
    </Fragment>
  );
};

export default ExternalLayout;
