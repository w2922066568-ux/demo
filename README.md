# Demo 作品集

此目录是 Demo 的 GitHub Pages 发布副本。网站入口为 `site/index.html`。原项目、Windows 程序和本地联机资料位于各自目录。

|项目|网页路径|内容|
|---|---|---|
|Pop-up Atlas|`/pop-up-atlas/`|WebGL 纸艺漫游|
|风岬岛|`/cape-meridian/`|海岛漫游|
|深渊回声|`/abyssal/`|深海勘探|
|Cinderline|`/cinderline/`|单人射击游戏|
|Forma Index|`/forma-index/`|交互动效展厅|
|花朝牌会|`/huazhao/`|本地电脑牌友练习，含好友联机入口|
|山谷礼拜堂|`/valley-chapel/`|Godot 网页导出和巡览视频|
|无日钟庭|`/sunless-belfry/`|Godot 网页导出和开场视频|
|潮汐秘契|`/tidebound/`|作品介绍和现有联机服务入口|
|经典斗地主、中世纪教堂|`/concepts/`|概念原画图册|

以上路径相对于 Pages 站点。GitHub Pages 提供静态页面和资源。两款牌类作品的好友房继续由各自的现有站点提供。

## 预览

在此目录运行 `node tools/preview.mjs`，再打开 `http://127.0.0.1:4194/demo/`。`/demo/` 模拟项目站点的子路径。

Godot 网页使用 Compatibility 渲染器、无多线程的 WebAssembly 导出，需要 WebGL 2。两款游戏的网页构建与 Windows 版在灯光和雾效方面可能有所不同。使用桌面键鼠游玩。

## 发布

将本目录作为单独的 GitHub 仓库，推送到 `main`。在仓库的 **Settings → Pages → Source** 选择 **GitHub Actions**。运行 **Publish Demo to GitHub Pages**，由 Actions 的部署结果提供站点 URL。仓库名可用 `demo`，网站路径随账户与仓库名确定。

工作流从 `packs/` 重组无日钟庭的资源包，校验 SHA-256 后才上传 `site/`。分片均小于 GitHub 单文件上传限制；浏览器按 Godot 原格式载入重组后的单个资源包。仓库工作目录中保留了用于本机预览的完整资源包。重新克隆后，可在 Git Bash 运行以下命令恢复本机预览用的资源包。

```sh
cat packs/sunless-belfry.pck.part-* > site/sunless-belfry/index.pck
sha256sum --check packs/sunless-belfry.sha256
```

## 更新

首页与图册展示 WebP 预览图，点图仍打开原尺寸 PNG。更新封面或概念原图时，在发布目录执行 `python tools/optimize-web-art.py`（需要 Pillow）。重新生成 Godot 网页时，在准备好两份 Web 专用工程后，先运行 `python tools/slim-godot.py`（需要 fontTools），再由 Godot 导入并导出。此步骤会从工程文本提取字形、保留基本拉丁字符，并将钟庭的天空纹理导入上限设为 2048。若以后增加外部对白文件，须将对应文本加入字体子集。两款游戏导出的 Wasm 完全一致时，钟庭复用礼拜堂的引擎地址。

在 `Demo` 下运行 `node Demo-Pages/tools/stage.mjs`，更新已构建的静态项目、图册和演示录像。更新 Godot 作品时使用 4.7.2 的无多线程 Web 导出。重新导出无日钟庭后，运行 `node Demo-Pages/tools/finish-belfry-web.mjs`，在玩家点击或按键后捕获鼠标。若 `index.pck` 更新，运行 `node Demo-Pages/tools/pack-godot.mjs` 重新分片。若输出尺寸明显变化，核对 `packs/` 中的分片清单后再提交。
