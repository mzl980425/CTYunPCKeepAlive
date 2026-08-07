# UserScript

CTYunPCKeepAlive 的核心业务模块。脚本运行在天翼云电脑网页中，复用官方页面 SDK 获取桌面列表、建立短暂连接完成保活，并提供可选的积分任务自动化。

同一份构建产物既可以安装到 Tampermonkey、Violentmonkey 等用户脚本管理器，也会被 Windows Electron 客户端加载。

## 安装

1. 安装 Tampermonkey、Violentmonkey 或其他兼容的用户脚本管理器。
2. 打开以下地址并确认安装：

   https://4x25.github.io/CTYunPCKeepAlive/user-script.user.js

3. 访问 https://pc.ctyun.cn/ 并完成登录。

脚本匹配天翼云电脑首页，并根据官方页面的 hash 路由展示登录页或桌面列表功能。

## 功能

- 读取当前账户可用的云电脑、云手机等桌面列表。
- 按设定间隔自动执行保活，默认 19 分钟。
- 手动立即保活。
- 在内存中保留最近 1000 条运行日志。
- 可选的积分任务：
  - 连接云电脑并保持 1 小时；
  - 登录云智助手后触发一次 AI 对话任务。
- 检查 GitHub Release 中是否存在新的 Electron 版本。

## 开发环境

建议使用 Node.js 22 或更新版本和 npm。

安装依赖：

    npm install

启动开发服务：

    npm run dev

vite-plugin-monkey 会提供开发版用户脚本：

    http://127.0.0.1:5173/__vite-plugin-monkey.install.user.js

浏览器开发时，可以把这个地址安装到用户脚本管理器；Electron 联调时，Electron preload 会自动尝试读取该地址。

预览构建结果：

    npm run preview

## 构建

    npm run build

构建包含 TypeScript 检查和 Vite 打包。产物位于 dist 目录，主要文件为：

    dist/user-script.user.js

package.json 中的 version 会写入用户脚本版本信息；pageUrl 用于生成 updateURL 和 downloadURL。

## SDK 注入机制

旧版本需要手工下载并修改天翼云网页 main.js，当前版本已经不再采用该流程。

现有流程为：

1. 脚本在 document-body 阶段启动。
2. 从当前页面查找 src 包含 main. 的官方脚本标签。
3. 获取对应官方 JavaScript bundle。
4. 定点替换应用挂载逻辑，并把官方内部应用实例暴露为 window.**APP**。
5. 通过 Blob URL 加载修改后的 bundle。
6. React 界面通过 window.**APP** 调用官方桌面和连接能力。

相关实现：

- src/layouts/ExternalLayout/useCTYunSDK.ts：动态加载和改写官方 SDK。
- src/utils/index.ts：页面钩子、保活连接和 AI 任务。
- src/pages/DesktopList/index.tsx：桌面列表、倒计时和任务设置。
- src/components/DesktopListItem/index.tsx：单个桌面的连接流程。

这套实现依赖天翼云网页内部 bundle 和 DOM 结构。官方页面改版后，字符串匹配、接口名称或页面选择器可能需要同步调整。

## 保活流程

1. 删除同一桌面的旧连接记录。
2. 调用官方接口创建并连接桌面。
3. 获取本次连接的证书、密钥、token 和节点信息。
4. 调用官方 clink 连接逻辑建立连接。
5. 默认保持约 8 秒；积分任务可保持 1 小时。
6. 停止连接并删除当前连接记录。

运行中的同一桌面会通过 memoize 避免重复并发保活。

## 设置和本地数据

设置通过 Zustand persist 保存在页面 localStorage 中，键名为：

    CTYunPCKeepAlive_SETTINGS

当前设置包括：

| 设置         | 默认值 | 说明                          |
| ------------ | ------ | ----------------------------- |
| interval     | 19     | 保活间隔，单位为分钟          |
| autoMission3 | false  | 凌晨执行使用云电脑 1 小时任务 |
| autoMission4 | false  | 凌晨执行云智助手 AI 对话任务  |

此外，脚本会：

- 设置 currentDirection，使官方桌面列表使用纵向布局；
- 设置 ctct.disabled 并替换官方页面遥测接口；
- 恢复并锁定原生 timer 函数，降低宿主脚本对计时任务的影响；
- 包装 history.pushState 和 history.replaceState，以响应 hash 页面切换。

这些操作只发生在当前天翼云电脑页面上下文中。

## 数据与隐私

- 项目没有自建后端，也不发送项目遥测。
- 云电脑证书、密钥和 token 只在运行时内存中用于官方连接。
- 项目日志不会主动输出连接证书、密钥或 token。
- 设置保存在 localStorage；日志只保存在当前页面内存，刷新后清空。
- 云智助手登录和跳转由 eaichat.ctyun.cn 官方页面完成。

## 网络访问

- pc.ctyun.cn：官方登录、桌面列表和连接接口。
- deskcdn.ctyun.cn：官方网页 SDK 和背景资源。
- eaichat.ctyun.cn：云智助手登录和 AI 积分任务。
- api.github.com：检查最新 GitHub Release。
- 4x25.github.io：用户脚本安装和更新。

## 发布

1. 更新 UserScript/package.json 中的 version。
2. 执行 npm run build。
3. 检查 dist/user-script.user.js 的元数据和功能。
4. 将构建产物发布到仓库 dist 分支。
5. 确认 GitHub Pages 安装地址可访问。
6. 再构建或发布 Electron 客户端，确保其加载到最新脚本。

## 常见问题

### 一直停留在“启动中”

通常表示官方 main bundle 获取失败、定点替换没有匹配，或 window.**APP** 未成功暴露。先检查浏览器控制台和网络请求，再确认天翼云页面是否刚刚改版。

### AI 积分任务提示未登录

先在设置中打开对应选项，并在弹出的云智助手页面完成登录。任务执行依赖官方登录状态和页面结构。

### 修改间隔后计时从头开始

这是预期行为。interval 变化时，倒计时进度会重置为 0。

项目整体说明和许可证状态见 [根 README](../README.md)。
