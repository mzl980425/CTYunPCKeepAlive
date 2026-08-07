import { FC, Fragment, useState } from "react";
import { useRequest } from "ahooks";
import { Badge, Button, Drawer, Flex, Input, Tooltip } from "antd";
import { BugTwoTone, GithubOutlined } from "@ant-design/icons";
import useLog from "../../hooks/useLog";
import { appVersion, scriptVersion } from "../../utils/env";
import "./index.less";

const BottomBar: FC<{}> = ({}) => {
  const logs = useLog((state) => state.logs);
  const [logVisible, setLogVisible] = useState(false);
  const [hasUpdate, setHasUpdate] = useState(!appVersion);

  const { data } = useRequest(
    async () => {
      const res = await Promise.any(
        [
          "https://api.github.com/repos/4x25/CTYunPCKeepAlive/releases/latest",
        ].map((url) =>
          fetch(url, { mode: "cors", cache: "no-cache" }).then((res) =>
            res.json(),
          ),
        ),
      );
      return res as {
        tag_name: string;
        html_url: string;
      };
    },
    {
      ready: !hasUpdate,
      pollingInterval: hasUpdate ? undefined : 60 * 60 * 1000,
      onSuccess: (data) => {
        if (!appVersion) {
          setHasUpdate(true);
          return;
        }
        if (data.tag_name) {
          const [x, y, z] = appVersion
            .replace("v", "")
            .split(".")
            .map((i) => Number(i));
          const [newX, newY, newZ] = data.tag_name
            .replace("v", "")
            .split(".")
            .map((i) => Number(i));
          if (
            newX > x ||
            (newX === x && newY > y) ||
            (newX === x && newY === y && newZ > z)
          ) {
            setHasUpdate(true);
            return;
          }
        }
        setHasUpdate(false);
      },
    },
  );

  return (
    <Fragment>
      <Flex className="bottom-bar">
        <Button
          style={{ borderRadius: 0, flexGrow: 1 }}
          type="text"
          icon={<GithubOutlined />}
          target="_blank"
          href={
            hasUpdate
              ? data?.html_url ||
                "//github.com/4x25/CTYunPCKeepAlive/releases/tag/v1.1.0"
              : `//github.com/4x25/CTYunPCKeepAlive/releases/tag/@${scriptVersion}`
          }
        >
          {hasUpdate ? (
            <Badge count={`检测到新版本：${data?.tag_name || "v1.1.0"}`} />
          ) : (
            `UserScript@${scriptVersion}`
          )}
        </Button>

        <Tooltip title="运行日志">
          <Button
            style={{ borderRadius: 0 }}
            type="text"
            icon={<BugTwoTone />}
            onClick={() => setLogVisible(true)}
          />
        </Tooltip>
      </Flex>

      <Drawer
        title="运行日志（最新 1000 条）"
        size="80vh"
        placement="bottom"
        open={logVisible}
        onClose={() => setLogVisible(false)}
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        <Input.TextArea
          size="small"
          readOnly
          value={logs.join("\n")}
          styles={{
            root: {
              width: "100%",
              height: "100%",
              border: "none",
              outline: "none",
            },
          }}
        />
      </Drawer>
    </Fragment>
  );
};

export default BottomBar;
