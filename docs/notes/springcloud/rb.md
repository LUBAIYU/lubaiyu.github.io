---
title: Ribbon
author: 路白榆
article: true
createTime: 2024/04/21 14:03:01
permalink: /cloud/bs7h8ebp/
---

### Ribbon负载均衡

默认采用懒加载：即第一次访问时才会去创建LoadBalanceClient，请求时间会很长
饥饿加载：在项目启动时创建LoadBalanceClient，降低第一次访问的耗时

<br>

#### 饥饿加载配置

在调用者服务的application.yml进行以下配置

```java
ribbon:
  eager-load:
    enabled: true   #开启饥饿加载
    clients:
      - userservice    #指定进行饥饿加载的服务名称，可以填多个
```

