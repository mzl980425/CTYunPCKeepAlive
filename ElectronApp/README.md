# CTYunPCKeepAlive Electron

这是 CTYunPCKeepAlive 的 Electron 桌面壳。它负责打开 `https://pc.ctyun.cn/`，并在页面加载后注入用户脚本，使用户脚本可以在桌面窗口中运行。

Electron 目录不包含核心续命逻辑，核心逻辑位于仓库根目录的 `UserScript`。

## 工作方式

- 主进程创建一个固定宽度窗口并加载天翼云电脑 Web 页面。
- 开发状态下，preload 脚本会优先尝试加载本地用户脚本开发服务：

```text
http://127.0.0.1:5173/__vite-plugin-monkey.install.user.js
```

- 如果本地开发服务不可用，会通过预设的 GitHub 代理地址加载远程发布版本：

```text
https://github.com/4x25/CTYunPCKeepAlive/raw/refs/heads/dist/user-script.user.js
```

- 注入前会显示加载遮罩；用户脚本挂载成功后遮罩自动消失。

## 开发

```bash
npm install
npm run dev
```

如果需要联调最新的 `UserScript` 源码，请先在仓库根目录启动用户脚本开发服务：

```bash
cd UserScript
npm install
npm run dev
```

随后在另一个终端启动 Electron：

```bash
cd ElectronApp
npm install
npm run dev
```

此时 Electron 会优先加载本地 `UserScript` 开发服务。

## 构建

本项目仅维护 Windows 发布产物。

```bash
npm run build
npm run build:win
```

- `npm run build`：执行 TypeScript 检查并生成 Electron 主进程与 preload 产物。
- `npm run build:win`：在构建完成后调用 electron-builder 生成 Windows 安装包和便携版（CI 中额外附加 `-- --x64` 显式指定 x64 架构）。
- `npm run build:unpack`：生成未打包目录，适合本地检查构建内容。

构建产物默认输出到 `dist/`，中间产物输出到 `out/`。这些目录不应提交到仓库。

## 目录说明

```text
ElectronApp/
├── src/main/       # Electron 主进程
├── src/preload/    # 页面注入逻辑
├── resources/      # Windows 图标资源
├── package.json
├── electron-builder.yml
├── electron.vite.config.ts
└── tsconfig.node.json
```

## 维护说明

- Windows 图标由 `resources/icon.ico` 提供，并在 `electron-builder.yml` 中显式配置。
- 版本发布由仓库根目录的 GitHub Actions 自动化完成：推送 `vX.Y.Z` 标签后，CI 会先更新 `dist` 分支的用户脚本，再构建 Windows x64 产物（安装包 + 便携版）并上传到 GitHub Release。
- 如果远程脚本地址、仓库名或发布分支变化，需要同步修改 `src/preload/index.ts`。

## 免责声明

本应用不是天翼云、天翼云电脑或中国电信的官方客户端。请仅在你有权使用的账号和资源上使用，并自行承担由使用本项目带来的兼容性、账号和服务风险。
