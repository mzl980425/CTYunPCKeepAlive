import { FC, Fragment, useEffect, useState } from "react";
import {
  App,
  Button,
  Divider,
  Flex,
  InputNumber,
  Popover,
  Space,
  Spin,
  Switch,
  Tooltip,
} from "antd";
import {
  GiftOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useInterval, useRequest } from "ahooks";
import { unsafeWindow } from "$";
import useLog from "../../hooks/useLog";
import DesktopListItem from "../../components/DesktopListItem";
import CountdownProgress from "../../components/CountdownProgress";
import LoginDrawer from "../../components/LoginDrawer";
import useSettings from "../../hooks/useSettings";
import { doMission4, wait } from "../../utils";
import { appVersion } from "../../utils/env";
import "./index.less";

const DesktopList: FC<{}> = ({}) => {
  const { message } = App.useApp();
  const addLog = useLog((state) => state.addLog);
  const {
    interval,
    setInterval,
    autoMission3,
    setAutoMission3,
    autoMission4,
    setAutoMission4,
  } = useSettings();
  const [loginPad, setLoginPad] = useState(false);
  const { loading: loadingMission3, run: runMission3 } = useRequest(
    async () => {
      (unsafeWindow || window).forceMission3 = true;
      onCountdownEnd();
      await wait(60 * 60 * 1000);
      (unsafeWindow || window).forceMission3 = false;
    },
    {
      manual: true,
    },
  );
  const { loading: loadingMission4, run: runMission4 } = useRequest(() => doMission4(), {
    manual: true,
  });

  const { loading, data } = useRequest(
    () =>
      (unsafeWindow || window).__APP__.desktop.getDesktopPageList({
        getCnt: 20,
        desktopTypes: ["1", "2001", "2002"],
        desktopStateFilter: "",
      }),
    {
      pollingInterval: 60 * 60 * 1000,
      pollingWhenHidden: false,
      refreshOnWindowFocus: true,
    },
  );

  useInterval(
    () => {
      if (new Date().getHours() === 3) {
        runMission4();
      }
    },
    autoMission4 ? 50 * 60 * 1000 : undefined,
  );

  const onCountdownEnd = () => {
    const buttons = document.querySelectorAll<HTMLButtonElement>(
      ".desktop[data-id] button.ant-btn-primary:not(.ant-btn-loading):not([disabled])",
    );
    if (buttons.length) {
      addLog("计时结束，即将对", buttons.length, "个云电脑进行续命");
      buttons.forEach((el) => el.click());
    } else {
      addLog("没有需要续命的云电脑");
    }
  };

  useEffect(() => {
    const app = document.getElementById("app");
    if (app) {
      app.style.display = "none";

      return () => {
        app.style.display = "block";
      };
    }
  }, []);

  return (
    <Fragment>
      <div className="desktop-list">
        <CountdownProgress interval={interval} onEnd={onCountdownEnd} />

        <Flex vertical gap={12}>
          <Flex align="center" justify="flex-end" gap={12}>
            {typeof document.getElementById("app")?.__vue_app__?.config
              .globalProperties.$dialog.open === "function" && (
              <Button
                type="primary"
                icon={<GiftOutlined />}
                onClick={() =>
                  document
                    .getElementById("app")!
                    .__vue_app__.config.globalProperties.$dialog.open("point")
                }
              >
                积分中心
              </Button>
            )}

            <Button type="primary" icon={<SyncOutlined />} onClick={() => location.reload()}>
              刷新
            </Button>

            <Popover
              trigger="click"
              placement="bottomRight"
              content={
                <Flex orientation="vertical" gap={12}>
                  <Flex align="center" justify="space-between">
                    <span>续命间隔：</span>

                    <Space.Compact
                      size="small"
                      style={{ width: 120, flex: 1, whiteSpace: "nowrap" }}
                    >
                      <InputNumber
                        mode="spinner"
                        min={1}
                        max={59}
                        value={interval}
                        onChange={(value) => value && setInterval(value)}
                      />
                      <Space.Addon>分钟</Space.Addon>
                    </Space.Compact>
                  </Flex>
                  <Flex align="center" justify="space-between">
                    <span>快捷选择：</span>
                    <Space.Compact size="small">
                      {[9, 19, 29].map((item) => (
                        <Button key={item} onClick={() => setInterval(item)}>
                          {item}分钟
                        </Button>
                      ))}
                    </Space.Compact>
                  </Flex>
                  {Number(appVersion.replaceAll(".", "")) >= 120 && (
                    <Fragment>
                      <Divider style={{ margin: 0 }} />
                      <Flex align="center">
                        <span style={{ fontWeight: "bolder" }}>
                          自动积分任务（测试功能）&nbsp;
                          <Tooltip title="为避免影响白天使用云电脑功能，自动积分任务会在每天凌晨（3:00 ~ 4:00）期间执行">
                            <QuestionCircleOutlined />
                          </Tooltip>
                        </span>
                      </Flex>
                      <Flex vertical gap={6}>
                        <Flex align="center">
                          <span>使用1小时：</span>
                          <Switch
                            size="small"
                            checked={autoMission3}
                            onChange={(value) => setAutoMission3(value)}
                          />
                          {autoMission3 && (
                            <Button
                              type="link"
                              size="small"
                              loading={loadingMission3}
                              onClick={runMission3}
                            >
                              立即执行
                            </Button>
                          )}
                        </Flex>
                        <Flex align="center">
                          <span>与AI对话1次：</span>
                          <Switch
                            size="small"
                            checked={autoMission4}
                            onChange={(value) => {
                              if (value) {
                                message.info({
                                  content: "该功能需要登录云智助手",
                                  styles: {
                                    root: {
                                      zIndex: 1080,
                                    },
                                  },
                                });
                                setLoginPad(true);
                              } else {
                                setAutoMission4(value);
                              }
                            }}
                          />
                          {autoMission4 && (
                            <Button
                              type="link"
                              size="small"
                              loading={loadingMission4}
                              onClick={runMission4}
                            >
                              立即执行
                            </Button>
                          )}
                        </Flex>
                      </Flex>
                    </Fragment>
                  )}
                </Flex>
              }
            >
              <Button type="primary" icon={<SettingOutlined />} />
            </Popover>
          </Flex>

          <Spin spinning={loading && !data?.length}>
            {data?.map((item) => (
              <DesktopListItem key={item.id} data={item} />
            ))}
          </Spin>
        </Flex>
      </div>

      <LoginDrawer
        open={loginPad}
        onClose={() => setLoginPad(false)}
        onLogin={() => {
          setLoginPad(false);
          setAutoMission4(true);
        }}
      />
    </Fragment>
  );
};

export default DesktopList;
