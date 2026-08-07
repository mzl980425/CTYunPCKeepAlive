import { FC, ReactNode } from "react";
import { App, ConfigProvider } from "antd";
import zh_CN from "antd/locale/zh_CN";
import { HappyProvider } from "@ant-design/happy-work-theme";
import "./index.less";

const AntLayout: FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <ConfigProvider locale={zh_CN} modal={{ centered: true }}>
      <HappyProvider>
        <App>{children}</App>
      </HappyProvider>
    </ConfigProvider>
  );
};

export default AntLayout;
