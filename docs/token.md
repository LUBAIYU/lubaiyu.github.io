---
title: 令牌桶算法简介及代码实现
createTime: 2024/05/17 11:12:00
author: 路白榆
tags:
  - 令牌桶
  - 限流
permalink: /article/nmquktxh/
---

### 令牌桶算法

#### 适用场景

令牌桶算法常用于系统请求限流，当在某个时间段大量的请求到达服务器，超过了服务器的承受能力，那么这时候就需要用到限流。意思是大量的请求到达时，放行一部分请求，其他的请求进行等待排队，以保证服务器能够正常的处理一部分请求，不至于崩溃。

实现限流的方法有很多，如计数器算法、漏桶算法、令牌桶算法等等。这里重点介绍令牌桶算法，其他的方法各位读者就自行去学习了，各有各的好处，也有缺点。

<br>

#### 介绍

令牌桶算法的原理：

1. 首先需要有一个固定容量的令牌桶，然后系统以一个恒定的速率生成令牌，然后放入桶中。
2. 当请求到达时需要从桶中获取令牌，如果获取到令牌，则将桶里的令牌数减一，然后放行请求，如果桶里没有令牌则拒绝该请求。
3. 令牌的数量与时间和生成速率强相关，时间流逝越长，生成的令牌数越多，如果生成令牌的速率快于获取令牌的速率，则很快会放满令牌桶，当桶里的令牌数到达容量时，则不再增加

<br>

令牌桶限流：

1. 系统按照某个速度往桶中放入令牌
2. 令牌的容量是固定的，但是放行的速度不是固定的，只要桶中还有令牌，一旦请求过来后能获取到令牌，请求就会被放行
3. 当获取令牌的速率快于系统生成令牌的速率，这样会导致桶中令牌被取完，此时桶中无令牌，请求被拒绝

<br>

优点：

令牌的生成速率可以设置，可以有效应对突发的巨大流量，只需要调大令牌生成速率和调大桶容量即可。

<br>

#### 代码实现

```java
package com.example.common.utils;

import org.springframework.stereotype.Component;

import java.util.concurrent.atomic.AtomicInteger;

/**
 * 令牌桶算法实现类
 *
 * @author by
 */
@Component
public class TokenBucketLimiter {
    /**
     * 上一次获取令牌的时间
     */
    public long lastTime = System.currentTimeMillis();
    /**
     * 令牌桶的容量
     */
    public int capacity = 4;
    /**
     * 生成令牌的速率（每秒2个）
     */
    public int rate = 2;
    /**
     * 当前桶里的令牌数量
     */
    public AtomicInteger tokens = new AtomicInteger(0);

    /**
     * 令牌桶算法实现限流，默认每次请求消耗一个令牌
     *
     * @return 是否限流
     */

    public synchronized boolean isLimited() {
        //获取当前时间
        long currentTime = System.currentTimeMillis();
        //计算时间间隔（单位为ms）
        long gap = currentTime - lastTime;
        //计算在这段时间内生成的令牌
        int generateCount = (int) (gap / 1000 * rate);
        //计算可能的令牌总数
        int allTokensCount = tokens.get() + generateCount;
        //设置令牌桶里的令牌数量，这里要取总数量与桶容量之间的最小值
        tokens.set(Math.min(capacity, allTokensCount));
        //开始获取令牌
        if (tokens.get() < 1) {
            //当前桶里令牌数量小于1个，进行限流
            return true;
        }
        //令牌数量足够，领取令牌，重新计算上一次获取令牌的时间
        tokens.decrementAndGet();
        lastTime = currentTime;
        return false;
    }
}
```

