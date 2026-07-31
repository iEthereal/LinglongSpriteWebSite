# 玲珑 MAS 官网

高端产品发布页，使用 Vite + React 构建，部署到 GitHub Pages。

- Pages: https://iethereal.github.io/LinglongSpriteWebSite/

当前下载包为 Android 正式版 APK，可用于正式安装与使用。
# Linglong Sprite Website

## GitHub Pages

在仓库 Settings → Pages 中将 Source 设为 **GitHub Actions**，并在 Settings → Secrets and variables → Actions → Variables 中设置：

```text
VITE_SHARE_API_URL=https://zjmprvpmzxlxtotroixt.supabase.co/functions/v1/share-api
```

这是公开作品读取地址，不需要且不得添加 Supabase key。Supabase `share-api` 的 CORS 必须允许 `https://iEthereal.github.io`。
