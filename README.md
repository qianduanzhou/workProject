# 工作计划管理系统（React + Antd + Nest + MySQL + Redis）

## 功能
- 用户注册/登录（JWT）
- 工作计划增删查改
- Antd Table 展示计划
- 按分类筛选
- 按日期范围筛选
- 前后端分离架构

## 目录
- `frontend`: React + Antd 前端
- `backend`: Nest 后端 API
- `docker-compose.yml`: MySQL 与 Redis

## 快速启动
1. 启动 MySQL/Redis
```bash
docker compose up -d
```

2. 启动后端
```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```

3. 启动前端
```bash
cd frontend
npm install
npm run dev
```

前端访问：`http://localhost:5173`  
后端接口：`http://localhost:3000`
