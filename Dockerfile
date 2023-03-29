FROM node:16-alpine
# 设置 maintai
LABEL maintainer "495060071@qq.com"

# 当前目录代码都拷贝到app下
COPY ./ /app

WORKDIR /app

# 安装npm
RUN npm config set registry https://registry.npmmirror.com/

# 安装pnpm
RUN npm install -g pnpm
RUN npm install -g pm2
RUN pnpm config set registry https://registry.npmmirror.com/
RUN pnpm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/

# 自动生成代码后端服务
RUN pnpm install

CMD ["pm2-runtime", "app.js"]

# 暴露端口
# EXPOSE 3000

