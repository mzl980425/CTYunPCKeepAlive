import { FC, Fragment, useState } from "react";
import { SendOutlined, WarningOutlined } from "@ant-design/icons";
import { App, Button, Flex, Space, Tag } from "antd";
import dayjs from "dayjs";
import { unsafeWindow } from "$";
import { IDesktopListItem, UseStatus } from "../../types/ctyun";
import { keepalive, wait } from "../../utils";
import useSettings from "../../hooks/useSettings";
import "./index.less";

interface IDesktopListItemProps {
  /** 倒计时，单位：分钟 */
  data: IDesktopListItem;
}

const DesktopListItem: FC<IDesktopListItemProps> = ({ data }) => {
  const { notification, message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const autoMission3 = useSettings((store) => store.autoMission3);

  const onClick = async (
    delay = ((unsafeWindow || window).forceMission3 || autoMission3 && new Date().getHours() === 3)
      ? 60 * 60 * 1000
      : 8 * 1000,
  ) => {
    const app = (unsafeWindow || window).__APP__;
    try {
      setLoading(true);
      await app.desktop.deleteDesktopConnection(data.id);
      await app.desktop.createDesktopConnection(data);
      const res = await app.desktop.connectDesktop(data.id);

      // 关机状态需要唤醒，等 10s 执行
      if (data.useStatus === UseStatus.SHUTDOWN) {
        await wait(10 * 1000);
        return onClick();
      }

      await keepalive(res.connectionInfo.desktopInfo, { delay });
      message.success(`【${data.objName}】续命成功`);
    } catch (err) {
      notification.error({
        title: `【${data.objName}】续命失败`,
        description: `时间：${dayjs().format("YYYY-MM-DD HH:mm:ss")}\n信息：${(err as Error).message}`,
        duration: 0,
        styles: {
          description: {
            whiteSpace: "pre-wrap",
          },
        },
      });
    } finally {
      setLoading(false);
      await app.desktop.deleteDesktopConnection(data.id);
    }
  };

  return (
    <Fragment>
      <div className="desktop" data-id={data.id}>
        <Flex vertical>
          <Space className="desktop-name">
            <span>{data.objName}</span>
            <Tag color={data.useStatusColor}>
              {data.useStatus}-{data.useStatusText}
            </Tag>
          </Space>
          <div className="desktop-code">
            ID: {data.desktopCode}
          </div>
        </Flex>

        {data.useStatus === UseStatus.RUNNING ||
        data.useStatusText === "运行中" ? (
          <Button
            type="primary"
            icon={<SendOutlined />}
            loading={loading}
            onClick={() => onClick()}
          >
            续命
          </Button>
        ) : (
          <Button disabled type="primary" icon={<WarningOutlined />}>
            当前状态不能续命
          </Button>
        )}
      </div>

    </Fragment>
  );
};

export default DesktopListItem;
