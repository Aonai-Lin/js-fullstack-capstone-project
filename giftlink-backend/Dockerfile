# 指定基础镜像，确保container中预装了 Node.js 环境
FROM node:18.12.1-bullseye-slim     
# WORKDIR 指令将容器内的 /usr/src/app 目录设置为工作目录，后续的 COPY、RUN 等命令都会在这个目录下执行
WORKDIR /usr/src/app
# 将主机上的 package.json 和 package-lock.json 文件复制到容器的当前工作目录（/usr/src/app）
COPY package*.json ./
# 在container内安装依赖，
RUN npm install
# 将应用程序的源代码、配置文件等复制到容器中，以便运行应用程序
COPY . .
# 声明容器内的应用程序会监听 3060 端口，这只是声明，并不会自动将端口映射到主机。实际映射需要在运行容器时通过 -p 参数指定，例如 -p 3060:3060
EXPOSE 3060
# 指定容器启动时执行 node app.js 命令
CMD ["node", "app.js"]


# 构造image，即container的模版，使用container的时候在这个模板上实例化
# 模板保存在IBM Cloud Image Registry (ICR)上，k8s可以直接拉取这个模板来实例化container
# docker build . -t us.icr.io/$MY_NAMESPACE/giftapp（image名字）
# docker push us.icr.io/$MY_NAMESPACE/giftapp
# 先用ibmcloud target查明地域，再把us换成对应地域代码