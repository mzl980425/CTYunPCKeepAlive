import { FC, useRef, useState } from "react";
import { App, Button, Drawer } from "antd";
import { useEventListener } from "ahooks";
import "./index.less";

interface ILoginDrawerProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const LoginDrawer: FC<ILoginDrawerProps> = ({ open, onClose, onLogin }) => {
  const { message } = App.useApp();
  const [iframeKey, setIframeKey] = useState(Math.random());
  const [iframeUrl, setIframeUrl] = useState("https://eaichat.ctyun.cn/chat/#/setting");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEventListener("message", (event) => {
    if (event.data.eventType === "login-success") {
      setIframeKey(Math.random());
      setIframeUrl(event.data.payload.returnUrl);
    }
  });

  const checkLogin = (silent = false) => {
    const location = iframeRef.current?.contentWindow?.location;
    if (
      !location ||
      location.origin !== "https://eaichat.ctyun.cn" ||
      location.hash.startsWith("#/login")
    ) {
      if (!silent) {
        message.error({
          content: "未检测到登录信息",
          styles: {
            root: {
              zIndex: 1080,
            },
          },
        });
      }
      return;
    }

    message.success({
      content: "登录成功",
      styles: {
        root: {
          zIndex: 1080,
        },
      },
    });
    onLogin();
  };

  const injectCss = () => {
    const document = iframeRef.current?.contentDocument;
    if (!document) return;

    const style = document.createElement('style');
    style.textContent = `
.lo-form {
  position: fixed  !important;
  inset: 0  !important;
}
.lgm-main-ct, .lgm-footer {
  flex-direction: column  !important;
}
.lgm-form {
  border-left: unset  !important;
  padding-left: unset  !important;
}
.lgm-title3 {
  text-align: center  !important;
}
.lgm-protocol, .lgm-ssos {
  margin: unset  !important;
  position: unset  !important;
}
    `;
    document.head.appendChild(style);
  }

  return (
    <Drawer
      destroyOnHidden
      zIndex={1070}
      open={open}
      onClose={onClose}
      title="登录到云智助手"
      size="100vw"
      styles={{
        body: {
          padding: 0,
        },
      }}
      extra={
        <Button size="small" type="primary" onClick={() => checkLogin(false)}>
          我已登录
        </Button>
      }
    >
      <iframe
        ref={iframeRef}
        key={iframeKey}
        src={iframeUrl}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
        onLoad={() => {
          injectCss();
          setTimeout(() => {
            checkLogin(true);
          }, 1000);
        }}
      />
    </Drawer>
  );
};

export default LoginDrawer;
