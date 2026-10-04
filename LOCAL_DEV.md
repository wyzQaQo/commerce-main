# 本地开发（C 盘）

项目已迁移至：**C:\projects\commerce-main**

```powershell
cd C:\projects\commerce-main
npm run dev
```

浏览器打开：http://localhost:3000/en

## 部署 Cloudflare

```powershell
cd C:\projects\commerce-main
npm run deploy:cf
```

环境变量在 Cloudflare 控制台配置，参见 `.env.example`。

## 注意

- 请在 **C:\projects\commerce-main** 用 Cursor 打开项目，不要再用 NAS 上的 T: 盘路径
- NAS 旧目录可保留作备份，日常开发以 C 盘为准
