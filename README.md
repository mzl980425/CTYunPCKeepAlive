# CTYunPCKeepAlive

天翼云电脑续命工具：自动保活「天翼云电脑」在线状态的非官方工具，并附带可选的积分任务自动化。

本项目由两部分组成，共用同一套核心逻辑：

| 模块 | 说明 | 详细文档 |
| --- | --- | --- |
| [`UserScript`](./UserScript) | 核心业务。运行在天翼云电脑网页中，可直接安装到 Tampermonkey / Violentmonkey 等用户脚本管理器 | [UserScript/README.md](./UserScript/README.md) |
| [`ElectronApp`](./ElectronApp) | Windows 桌面壳。加载天翼云电脑网页并注入用户脚本，无需浏览器拓展 | [ElectronApp/README.md](./ElectronApp/README.md) |

## 功能

- 读取当前账户可用的云电脑、云手机等桌面列表。
- 按设定间隔自动执行保活，默认每 19 分钟一次，也可手动立即保活。
- 可选积分任务：连接云电脑保持 1 小时、登录云智助手后触发 AI 对话。
- 在内存中保留最近 1000 条运行日志，可在页面内查看。
- 检查 GitHub Release 中是否存在更新的桌面客户端版本。

> 只做保活，不做远控。连接仅在内存中短暂建立（默认约 8 秒），不会长期占用你的云电脑。

<img width="245" alt="截图1" src="https://github.com/user-attachments/assets/95f9db70-32ee-40e2-985d-cdc58a05ced2" />
<img width="245" alt="截图2" src="https://github.com/user-attachments/assets/3a4adf1f-368a-469c-a7d2-00525c8e5c36" />

## 安装

### 方式一：用户脚本（浏览器）

1. 安装 Tampermonkey、Violentmonkey 或其他兼容的用户脚本管理器。
2. 打开以下地址并确认安装：

   <https://4x25.github.io/CTYunPCKeepAlive/user-script.user.js>

3. 访问 <https://pc.ctyun.cn/> 并完成登录。

### 方式二：Windows 桌面客户端（Electron）

从 [GitHub Releases](https://github.com/4x25/CTYunPCKeepAlive/releases) 下载对应版本安装包或便携版，双击运行即可。客户端同样保持最新用户脚本逻辑。

> 国内访问 GitHub 较慢时，可通过代理加速站下载，例如：
> <https://github.404.vin> · <https://gh.llkk.cc> · <https://gh-proxy.net> · <https://edgeone.gh-proxy.org> · <https://cdn.gh-proxy.org> · <https://hk.gh-proxy.org> · <https://gh-proxy.org>

## Release 说明

### 版本命名规则

- **`vX.Y.Z`**：正式应用版本，需手动下载并安装。
- **`@YYYY.MM.DD`**：续命脚本快照，每次刷新页面时自动更新，**无需手动操作**。

### 发布产物类型

| 文件后缀 | 类型说明 | 推荐场景 |
| --- | --- | --- |
| `-setup.exe` | 安装包版本 | 首次安装或长期使用 |
| `-portable.exe` | 单文件便携版 | 临时使用或免安装需求 |

> 💡 如无特殊需求，**建议使用 `-setup.exe` 后缀的安装包版本**。

## 开发与构建

环境要求：Node.js 22 或更新版本、npm。

用户脚本：

```bash
cd UserScript
npm install
npm run dev      # 开发模式，vite-plugin-monkey 提供 http://127.0.0.1:5173/__vite-plugin-monkey.install.user.js
npm run build    # 构建产物 dist/user-script.user.js
```

Electron 客户端：

```bash
cd ElectronApp
npm install
npm run dev
npm run build:win   # 生成 Windows 安装包和便携版
```

更详细的联调、构建与发布流程见各子模块 README。

## 目录结构

```text
CTYunPCKeepAlive/
├── UserScript/     # 核心业务：用户脚本（React + Ant Design + vite-plugin-monkey）
├── ElectronApp/    # Electron 桌面壳（主进程 + preload 注入）
└── LICENSE
```

## 问题反馈

如有问题或建议，欢迎在 [Issues](https://github.com/4x25/CTYunPCKeepAlive/issues) 中提交。

## 免责声明

本项目不是天翼云、天翼云电脑或中国电信的官方项目，与其无任何隶属关系。请仅在你有权使用的账号和资源上使用，并自行承担由使用本项目带来的兼容性、账号和服务风险。

## 许可证

[MIT](./LICENSE) © 4x25
