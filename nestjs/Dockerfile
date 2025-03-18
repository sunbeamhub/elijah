# 第一阶段：构建阶段
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /usr/elijah/nestjs

# 安装依赖
COPY package*.json .npmrc ./

RUN npm ci

# 复制应用程序代码
COPY . .

# 运行构建命令进行编译
RUN npm run build

# 运行打包命令
RUN tar -zcvf ./dist.tgz ./dist && \
    tar -zcvf ./node_modules.tgz ./node_modules

# 第二阶段：生产阶段
FROM node:18-alpine

# 定义生产阶段的环境变量
ARG PORT=3000
ENV PORT=${PORT}

# 设置工作目录
WORKDIR /usr/elijah/nestjs

# 复制构建产物
COPY --from=builder /usr/elijah/nestjs/dist.tgz .
COPY --from=builder /usr/elijah/nestjs/node_modules.tgz .
RUN tar -zxf dist.tgz -C . && \
    rm dist.tgz
RUN tar -zxf node_modules.tgz -C . && \
    rm node_modules.tgz

# 暴露应用程序运行的端口
EXPOSE ${PORT}

# 拷贝启动脚本
COPY docker-setup.sh /usr/local/bin
RUN chmod +x /usr/local/bin/docker-setup.sh

# 使用启动脚本
CMD ["sh", "/usr/local/bin/docker-setup.sh"]
