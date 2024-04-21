---
title: Nginx
author: 路白榆
createTime: 2024/04/21 15:11:53
permalink: /center/uwnnt2ya/
---

### Nginx

#### 简介

Nginx是什么 => 高性能的、HTTP和反向代理的Web服务器

<br>

#### 核心概念

> 正向代理

在客户端配置代理服务器，通过代理服务器去访问因特网，这种行为称为正向代理

![](https://img2.imgtp.com/2024/04/21/3mN70Jxq.png)

<br>

#### 常用命令

前提：先进入目录/usr/sbin

1.查看版本号

```bash
./nginx -v
```

<br>

2.启动nginx

```bash
./nginx
```

<br>

3.关闭nginx

```bash
./nginx -s stop
```

<br>

4.重新加载nginx

```bash
./nginx -s reload
```

<br>

#### 配置文件

所在位置：/etc/nginx

名称：nginx.conf

<br>

nginx配置文件主要由三部分组成

> 全局块

从配置文件开始到events块之间的内容，主要设置一些影响Nginx服务器整体运行的配置指令

如：`worker_processes 1;` => 值越大，Nginx可以支持的并发处理量越大

<br>

> events块

events块涉及的指令主要影响Nginx服务器与用户的网络连接

如：`worker_connections 1024` => 表示支持的最大连接数

<br>

> http块

Nginx服务器中配置最频繁的部分

可再分为

1. http全局块
2. server块

<br>

#### 常见配置

1.配置反向代理

打开nginx.conf文件，在location中添加以下配置

```bash
location / {
    proxy_pass  IP地址;
}
```

<br>

2.配置包含指定路径的反向代理

```bash
location ~ /user/ {          # 路径包含user则进行转发
    proxy_pass  IP地址; 
}
```

<br>

3.配置负载均衡

```bash
upstream myserver {
    server   ip地址   # 可以是同个IP不同端口
    server   ip地址
}

location / {
    proxy_pass  http://myserver;    # 这里//后面的名称需与上面对应，可以任意取
}
```

<br>

#### 服务器分配策略

1.轮询（默认）

2.weight（权重，默认为1） => 根据每个服务器的权重来分配

配置

```bash
upstream myserver {
    server   ip地址  weight=1    # 可以是同个IP不同端口
    server   ip地址  weight=1
}
```

3.ip_hash =>  根据访问IP的hash结果来分配

配置

```bash
upstream myserver {
    ip_hash;
    server   ip地址   # 可以是同个IP不同端口
    server   ip地址  
}
```

4.fair（第三方）=> 根据后端服务器的响应时间来分配

配置

```bash
upstream myserver {
    server   ip地址   # 可以是同个IP不同端口
    server   ip地址  
    fair;
}
```

<br>

#### 原理

内部实现：master + worker

master：管理者，只有一个

worker：实际工作者，有多个

<br>

工作机制：

客户端请求首先到达master，然后master通知worker有请求到达，然后多个worker通过争抢的方式去抢夺请求，抢到的worker则接着执行请求的一系列流程。

<br>

> 设置多少个worker合适

worker的数量设置等于CPU数最好

<br>

> 一个master + 多个worker 的好处

1.可以使用`nginx -s reload`热部署，利于nginx进行热部署操作

2.每个worker是独立的进程，当一个worker出现问题时，其他worker可继续参与争抢，实现请求过程，不会造成服务中断

<br>

> worker支持的最大并发数有多少

1.如果每个请求都是静态请求，不需要访问数据库，则worker支持的最大并发数为 **worker的最大连接数/2**

2.如果每个请求需要访问数据库，则worker支持的最大并发数为 **worker的最大连接数/4**