---
title: Redis
author: 路白榆
createTime: 2024/04/21 14:47:02
permalink: /center/jjhvmocj/
---

### Redis

#### 启动Redis（Linux系统）

1、进入redis程序所在目录

```bash
cd /usr/local/bin
```

<br>

2、以指定配置文件运行redis

```bash
redis-server config/redis.conf
```

<br>

3、连接redis客户端并指定端口为6379

```bash
redis-cli -p 6379
```

<br>

#### 关闭Redis

输入以下命令

```bash
shutdown
exit
```

![](https://img2.imgtp.com/2024/04/18/lsyMd1Ds.png)

<br>

#### 基础命令

1、切换数据库命令

redis一共有16个数据库，默认使用第0个数据库

```bash
select index(数据库编号，从0开始)
```

如：select 3 => 切换到第4个数据库

<br>

2、查看所有的key

```bash
keys *
```

<br>

3、存值命令

```bash
set key value
```

如：set age 18 => 存储一个key为age，value为18的数据

<br>

4、取值命令

```bash
get key
```

如：get age => 取出key为age的数据的值

<br>

5、查看数据库大小

```bash
dbsize
```

<br>

6、清空当前库

```bash
flushdb
```

<br>

7、清空所有库

```bash
flushall
```

#### 五大数据类型

##### Redis-Key

基本命令

1、判断当前key是否存在，存在返回1，不存在返回0

```bash
exists key
```

如：exists name => 判断是否存在key为name的数据

<br>

2、移除指定数据库的key(index从1开始)

```bash
move key index
```

如：move name 1 => 从第一个数据库移除key为name的数据

<br>

3、设置key的过期时间(单位是秒)，过期后将找不到该数据

```bash
expire key seconds
```

如：expire name 10 => 设置name的过期时间是10秒

<br>

4、查看key的剩余时间，显示-2则表示已经过期

```bash 
ttl key
```

如：ttl name => 查看name的剩余时间还有多少

<br>

##### String（字符串）

常用命令

```bash
####################################################################################
127.0.0.1:6379> set data hello            # 设置值
OK
127.0.0.1:6379> get data                  # 获取值
"hello"
127.0.0.1:6379> append data ,world        # 追加字符串，若key不存在，则创建一个key
(integer) 11
127.0.0.1:6379> get data
"hello,world"
127.0.0.1:6379> strlen data               # 获取key对应的值的长度
(integer) 11

####################################################################################

127.0.0.1:6379> set views 0
OK
127.0.0.1:6379> get views   
"0"
127.0.0.1:6379> incr views               # 自增1，类似于i++
(integer) 1
127.0.0.1:6379> get views
"1"
127.0.0.1:6379> decr views               # 自减1，类似于i--
(integer) 0
127.0.0.1:6379> get views
"0"
127.0.0.1:6379> incrby views 10          # 可以设置步长，指定增量为10
(integer) 10
127.0.0.1:6379> get views
"10"
127.0.0.1:6379> decrby views 10          # 可以设置步长，指定减值为10
(integer) 0
127.0.0.1:6379> get views
"0"

####################################################################################
# 字符串范围 range

127.0.0.1:6379> set key1 hello,world
OK
127.0.0.1:6379> get key1
"hello,world"
127.0.0.1:6379> getrange key1 0 4       # 截取字符串，下标范围[0,4]
"hello"
127.0.0.1:6379> getrange key1 0 -1      # 截取所有字符串，-1表示反方向第一个下标
"hello,world"


# 替换字符串

127.0.0.1:6379> set data hello,world
OK
127.0.0.1:6379> get data
"hello,world"
127.0.0.1:6379> setrange data 6 zhangsan     # 替换字符串，从下标6开始替换
(integer) 14
127.0.0.1:6379> get data
"hello,zhangsan"

####################################################################################

127.0.0.1:6379> setex key1 30 hello         # 设置值并同时设置过期时间
OK
127.0.0.1:6379> get key1
"hello"
127.0.0.1:6379> ttl key1
(integer) 24
127.0.0.1:6379> setnx key2 world           # 如果key不存在则创建key并设置值
(integer) 1
127.0.0.1:6379> get key2
"world"
127.0.0.1:6379> setnx key2 hello           # 如果key存在则创建失败
(integer) 0
127.0.0.1:6379> get key2
"world"

####################################################################################
 
127.0.0.1:6379> mset k1 v1 k2 v2 k3 v3      # 批量设置多个值
OK
127.0.0.1:6379> keys *
1) "k3"
2) "k1"
3) "k2"
127.0.0.1:6379> mget k1 k2 k3               # 批量获取多个值
1) "v1"
2) "v2"
3) "v3"
127.0.0.1:6379> msetnx k1 v1 k4 v4          # 设置失败，msetnx是一个原子操作，要么同成功，要么同失败
(integer) 0

####################################################################################
 
127.0.0.1:6379> getset data hello          # 如果不存在值，返回nil
(nil)
127.0.0.1:6379> set data hello        
OK
127.0.0.1:6379> getset data world          # 如果存在值，先获取值再更新值
"hello"
127.0.0.1:6379> get data
"world"

####################################################################################
```

<br>

##### List（列表）

所有命令都以l开头

常用命令

```bash
####################################################################################
lpush  
rpush
lrange

127.0.0.1:6379> lpush list one      # 往列表头部中插入一个或多个值（左）
(integer) 1
127.0.0.1:6379> lpush list two
(integer) 2
127.0.0.1:6379> lpush list three
(integer) 3
127.0.0.1:6379> lrange list 0 -1     # 根据范围获取列表元素
1) "three"
2) "two"
3) "one"
127.0.0.1:6379> rpush list four     # 往列表尾部中插入一个或多个值（右）
(integer) 4
127.0.0.1:6379> lrange list 0 -1
1) "three"
2) "two"
3) "one"
4) "four"

####################################################################################
lpop
rpop

127.0.0.1:6379> lrange list 0 -1
1) "three"
2) "two"
3) "one"
4) "four"
127.0.0.1:6379> lpop list           # 移除列表的第一个元素（左）
"three"
127.0.0.1:6379> rpop list           # 移除列表的最后一个元素（右）
"four"
127.0.0.1:6379> lrange list 0 -1
1) "two"
2) "one"

####################################################################################
lindex 

127.0.0.1:6379> lrange list 0 -1
1) "two"
2) "one"
127.0.0.1:6379> lindex list 0       # 获取列表的指定下标的元素
"two"
127.0.0.1:6379> lindex list 1
"one"

####################################################################################
llen 

127.0.0.1:6379> lpush list three
(integer) 3
127.0.0.1:6379> lpush list four
(integer) 4
127.0.0.1:6379> llen list          # 获取列表的长度
(integer) 4

####################################################################################
lrem

127.0.0.1:6379> lrange list 0 -1
1) "four"
2) "three"
3) "two"
4) "one"
127.0.0.1:6379> lrem list 1 four       # 移除list中指定个数的值
(integer) 1
127.0.0.1:6379> lrange list 0 -1
1) "three"
2) "two"
3) "one"
127.0.0.1:6379> lpush list three
(integer) 4
127.0.0.1:6379> lrange list 0 -1
1) "three"
2) "three"
3) "two"
4) "one"
127.0.0.1:6379> lrem list 2 three     # 移除list中2个three
(integer) 2
127.0.0.1:6379> lrange list 0 -1
1) "two"
2) "one"

####################################################################################
ltrim

127.0.0.1:6379> rpush list hello
(integer) 1
127.0.0.1:6379> rpush list hello1
(integer) 2
127.0.0.1:6379> rpush list hello2
(integer) 3
127.0.0.1:6379> rpush list hello3
(integer) 4
127.0.0.1:6379> lrange list 0 -1
1) "hello"
2) "hello1"
3) "hello2"
4) "hello3"
127.0.0.1:6379> ltrim list 1 2      # 截取list中指定范围的元素，改变了list的数据
OK
127.0.0.1:6379> lrange list 0 -1
1) "hello1"
2) "hello2"

####################################################################################
rpoplpush

127.0.0.1:6379> lrange list 0 -1
1) "one"
2) "two"
3) "three"
4) "four"
127.0.0.1:6379> rpoplpush list list2     # 将list中最后一个元素移除，并将该元素插入到list2中
"four"
127.0.0.1:6379> lrange list 0 -1
1) "one"
2) "two"
3) "three"
127.0.0.1:6379> lrange list2 0 -1
1) "four"

####################################################################################
lset

127.0.0.1:6379> exists list             # 判断列表是否存在
(integer) 0
127.0.0.1:6379> lset list 0 hello       # 列表不存在，报错
(error) ERR no such key
127.0.0.1:6379> rpush list one
(integer) 1
127.0.0.1:6379> rpush list two
(integer) 2
127.0.0.1:6379> lrange list 0 -1
1) "one"
2) "two"
127.0.0.1:6379> lset list 0 three       # 将列表中指定下标的元素替换为指定的值
OK
127.0.0.1:6379> lrange list 0 -1
1) "three"
2) "two"
127.0.0.1:6379> lset list 2 four        # 如果指定下标不存在，报错
(error) ERR index out of range

####################################################################################
linsert

127.0.0.1:6379> lrange list 0 -1
1) "three"
2) "two"
127.0.0.1:6379> linsert list before three four     # 往列表指定元素的前面插入元素
(integer) 3
127.0.0.1:6379> lrange list 0 -1
1) "four"
2) "three"
3) "two"
127.0.0.1:6379> linsert list after two one         # 往列表指定元素的后面插入元素
(integer) 4
127.0.0.1:6379> lrange list 0 -1
1) "four"
2) "three"
3) "two"
4) "one"

####################################################################################
```

<br>

##### Set（集合）

set中的值是不能重复的！

常用命令

```bash
####################################################################################
sadd
smembers
sismember

127.0.0.1:6379> sadd myset hello         # 向集合中添加元素
(integer) 1
127.0.0.1:6379> sadd myset world
(integer) 1
127.0.0.1:6379> smembers myset           # 查看集合中的元素
1) "hello"
2) "world"
127.0.0.1:6379> sismember myset hello    # 查看集合中是否有指定元素，有返回1，没有返回0
(integer) 1
127.0.0.1:6379> sismember myset other
(integer) 0

####################################################################################
scard

127.0.0.1:6379> scard myset             # 获取集合中的元素个数
(integer) 2

####################################################################################
srem

127.0.0.1:6379> smembers myset
1) "hello"
2) "world"
3) "one"
4) "two"
127.0.0.1:6379> srem myset one         # 移除集合中的指定元素
(integer) 1
127.0.0.1:6379> smembers myset
1) "hello"
2) "world"
3) "two"

####################################################################################
srandmember 

127.0.0.1:6379> srandmember myset      # 随机从集合中抽出一个元素
"world"
127.0.0.1:6379> srandmember myset
"hello"
127.0.0.1:6379> srandmember myset 2    # 随机从集合中抽出指定个数的元素
1) "hello"
2) "world"

####################################################################################
spop 

127.0.0.1:6379> spop myset             # 从集合中随机移除元素
"hello"
127.0.0.1:6379> spop myset
"world"

####################################################################################
smove

127.0.0.1:6379> smembers myset
1) "two"
2) "one"
3) "three"
127.0.0.1:6379> smove myset myset2 one     # 将指定元素从第一个集合移动到第二个集合
(integer) 1
127.0.0.1:6379> smembers myset2
1) "one"
127.0.0.1:6379> smembers myset
1) "two"
2) "three"

####################################################################################
sdiff   
sinter
sunion

127.0.0.1:6379> smembers set1
1) "a"
2) "b"
3) "c"
127.0.0.1:6379> smembers set2
1) "c"
2) "d"
3) "e"
127.0.0.1:6379> sdiff set1 set2            # 差集，以第一个集合为准
1) "a"
2) "b"
127.0.0.1:6379> sinter set1 set2           # 交集
1) "c"
127.0.0.1:6379> sunion set1 set2           # 并集
1) "a"
2) "b"
3) "c"
4) "d"
5) "e"

####################################################################################
```

<br>

##### Hash（哈希）

存储的值是一个Map集合，key-Map的结构 =`>` key-`<`key-value`>`，适合于对象存储

常用命令

```bash
####################################################################################
hset
hmset
hdel

127.0.0.1:6379> hset myhash field1 hello      # 设置一个key-value
(integer) 1
127.0.0.1:6379> hset myhash field2 world
(integer) 1
127.0.0.1:6379> hgetall myhash                # 获取所有数据，以key-value顺序展示
1) "field1"
2) "hello"
3) "field2"
4) "world"
127.0.0.1:6379> hmset myhash field3 one field4 two   # 批量设值key-value
OK
127.0.0.1:6379> hgetall myhash
1) "field1"
2) "hello"
3) "field2"
4) "world"
5) "field3"
6) "one"
7) "field4"
8) "two"
127.0.0.1:6379> hdel myhash field4      # 删除指定的key，对应的value也自动删除
(integer) 1
127.0.0.1:6379> hgetall myhash
1) "field1"
2) "hello"
3) "field2"
4) "world"
5) "field3"
6) "one"

####################################################################################
hlen 

127.0.0.1:6379> hlen myhash     # 获取key-value的数目
(integer) 3

####################################################################################
hexists

127.0.0.1:6379> hexists myhash field1      # 判断指定字段是否存在，存在返回1，不存在返回0
(integer) 1
127.0.0.1:6379> hexists myhash field5
(integer) 0

####################################################################################
hkeys
hvals

127.0.0.1:6379> hkeys myhash           # 获得所有的字段
1) "field1"
2) "field2"
3) "field3"
127.0.0.1:6379> hvals myhash           # 获得所有的值
1) "hello"
2) "world"
3) "one"

####################################################################################
hsetnx         # 如果字段不存在则设置
hincrby

127.0.0.1:6379> hsetnx myhash field1 hello        # 字段存在，设置失败
(integer) 0
127.0.0.1:6379> hsetnx myhash field4 hello        # 字段不存在，设置成功
(integer) 1
127.0.0.1:6379> hset myhash field5 1
(integer) 1
127.0.0.1:6379> hincrby myhash field5 5          # 设置字段增量
(integer) 6

####################################################################################
```

<br>

##### Zset（有序集合）

在set的基础上，增加了一个值，set k1 v1 => zset k1 score1 v1（score1表示该元素的排位，用于排序元素）

常用命令

```bash
####################################################################################
zadd
zrange
zrevrange

127.0.0.1:6379> zadd myzset 1 one         # 增加一个值
(integer) 1
127.0.0.1:6379> zadd myzset 3 three
(integer) 1
127.0.0.1:6379> zadd myzset 2 two
(integer) 1
127.0.0.1:6379> zrange myzset 0 -1       # 根据范围获取集合中的元素，从小到大
1) "one"
2) "two"
3) "three"
127.0.0.1:6379> zrevrange myzset 0 -1    # 根据范围获取集合中的元素，从大到小
1) "three"
2) "two"
3) "one"

####################################################################################
zrangebyscore

127.0.0.1:6379> zadd salary 3000 zhangsan
(integer) 1
127.0.0.1:6379> zadd salary 1000 lisi
(integer) 1
127.0.0.1:6379> zadd salary 2000 wangwu
(integer) 1
127.0.0.1:6379> zrangebyscore salary -inf +inf     # 根据分数升序显示范围在负无穷到正无穷的数据
1) "lisi"
2) "wangwu"
3) "zhangsan"
127.0.0.1:6379> zrangebyscore salary -inf +inf withscores   
1) "lisi"                                # 根据分数升序显示范围在负无穷到正无穷的数据，同时显示分数
2) "1000"
3) "wangwu"
4) "2000"
5) "zhangsan"
6) "3000"
127.0.0.1:6379> zrangebyscore salary -inf 2000    # 显示分数小于等于2000的数据，升序显示
1) "lisi"                                 
2) "wangwu"

####################################################################################
zrem
zcard

127.0.0.1:6379> zrange salary 0 -1
1) "lisi"
2) "wangwu"
3) "zhangsan"
127.0.0.1:6379> zrem salary wangwu          # 从集合中移除指定元素
(integer) 1
127.0.0.1:6379> zrange salary 0 -1
1) "lisi"
2) "zhangsan"
127.0.0.1:6379> zcard salary                # 获取集合元素个数
(integer) 2

####################################################################################
zcount

127.0.0.1:6379> zadd myzset 1 one           # 增加一个值
(integer) 1
127.0.0.1:6379> zadd myzset 3 three
(integer) 1
127.0.0.1:6379> zadd myzset 2 two
(integer) 1
127.0.0.1:6379> zcount myzset 1 3           # 获取指定区间的元素数量
(integer) 3
127.0.0.1:6379> zcount myzset 1 2
(integer) 2

####################################################################################
```

<br>

#### 三种特殊数据类型

##### Geospatial（地理位置）

底层实现：Zset（有序集合）

应用场景：地图开发

常用命令：

```bash
####################################################################################
geoadd    # 添加地理位置（经度，纬度，城市名称），地球两极无法直接添加
          # 平常应用过程中一般会下载城市数据，通过Java程序一次性导入数据
          
> geoadd china:city 116 23 shantou
1
> geoadd china:city 113 23 guangzou 114 22 shenzhen
2

####################################################################################
geopos   # 查看指定城市的经度纬度

> geopos china:city shantou
116.00000113248825
23.000000233894397
> geopos china:city guangzou
112.99999862909317
23.000000233894397

####################################################################################
geodist       # 查看两个城市之间的距离，最后面是距离单位，默认是m
              # 一共有4个单位，m(米),km(千米),mi(英里),ft(英尺)

> geodist china:city guangzou shantou km
307.1479
> geodist china:city shenzhen shantou km
233.6820

####################################################################################
georadius    # 以指定经纬度为中心，寻找指定半径内的城市

> georadius china:city 116 23 500 km
shenzhen
guangzou
shantou
> georadius china:city 116 23 200 km
shantou
> georadius china:city 116 23  500 km withdist      # 输出找到的城市并同时输出距离
shenzhen
233.6819
guangzou
307.1478
shantou
0.0001
> georadius china:city 116 23  500 km withcoord     # 输出找到的城市并同时输出经纬度
shenzhen
114.00000125169754
21.999999507390832
guangzou
112.99999862909317
23.000000233894397
shantou
116.00000113248825
23.000000233894397
> georadius china:city 116 23  500 km count 1      # 输出找到的指定数量的城市
shantou
> georadius china:city 116 23  500 km count 2
shantou
shenzhen

####################################################################################
georadiusbymember        # 以指定城市为中心，寻找指定半径内的城市

> georadiusbymember china:city shantou 300 km
shenzhen
shantou

####################################################################################
geohash                 # 将指定城市的经纬度转化为11个字符的geohash字符串并返回

> geohash china:city shantou shenzhen
ws46zeh8ey0
wecj4hur290

####################################################################################
```

<br>

##### Hyperloglog（基数统计）

什么是基数？=> 一个集合中不重复的元素的个数

Hyperloglog的优点：无论统计多少个元素，占用的内存都是固定的（12KB）

应用场景：网站用户访问量的统计

常用命令：

```bash
pfadd
pfcount
pfmerge

> pfadd mykey a b c d e f g h i j           # 往mykey中添加元素
1
> pfadd mykey2 b d i j m n o p q
1
> pfcount mykey                             # 统计mykey中元素的个数（基数）
10
> pfcount mykey2
9
> pfmerge mykey3 mykey mykey2               # 合并mykey和mykey2为mykey3，取并集
OK
> pfcount mykey3
15
```

注意：Hyperloglog有0.81%的错误率

如果允许容错，则可以使用Hyperloglog！

如果不允许容错，则可以使用set或自己的数据类型即可！

<br>

##### Bitmap（位图）

原理：位存储，value只能是0或1，操作二进制数据来记录

应用场景：统计只有两种状态的数据，登录/未登录，打开/未打卡

常用命令：

```bash
setbit 
getbit
bitcount

> setbit sign 0 1                   # 设置状态    
0                                   # 0到6表示周一到周日，0/1表示未打卡/打卡
> setbit sign 1 0
0
> setbit sign 2 0
0
> setbit sign 3 0
0
> setbit sign 4 1
0
> setbit sign 5 0
0
> setbit sign 6 1
0
> getbit sign 0                     # 获取状态
1
> getbit sign 5
0
> bitcount sign                     # 统计状态为1的数据量
3
```

<br>

#### 事务

Redis事务本质：一组命令的集合！一个事务中的所有命令都会被序列化，在事务执行的过程中，会按照顺序执行！

一次性、顺序性、排他性！执行一系列的命令！

==Redis事务没有隔离级别的概念！==

所有的命令在事务中，并没有直接被执行！只有发起执行命令的时候才会执行！==Exec==

==Redis单条命令是保证原子性的，但是Redis事务不保证原子性（同成功，同失败）！==

redis的事务：

- 开启事务（multi）

- 命令入队（......）

- 执行事务（exec）

<br>

> 正常执行事务！

```bash
> multi                            # 开启事务
OK
> set k1 v1                        # 命令入队，此时命令只是入队，并没有执行
QUEUED
> set k2 v2
QUEUED
> get k2
QUEUED
> set k3 v3
QUEUED
> exec                             # 执行事务，此时队列中的命令会顺序执行
OK
OK
v2
OK
```

<br>

> 放弃事务！

```bash
> multi                           # 开启事务
OK
> set k1 v1
QUEUED
> set k2 v2
QUEUED
> set k3 v3
QUEUED
> discard                         # 放弃事务，当事务放弃后，事务中的命令将作废
OK
> get k3                        
null
```

<br>

> 编译型异常（代码有问题！命令有错！），事务中所有的命令都不会被执行！

```bash
> multi                          # 开启事务
OK
> set k1 v1
QUEUED
> set k2 v2
QUEUED
> set k3 v3
QUEUED
> getset k3                      # 语法错误的命令
QUEUED
> set k4 v4
QUEUED
> exec                           # 执行事务报错！所有的命令都不会被执行
ReplyError: EXECABORT Transaction discarded because of previous errors.
> get k4
null
```

<br>

> 运行时异常（1/0），如果事务队列中存在语法性错误，那么执行命令的时候，其他命令是可以正常执行的，错误命令抛出异常！

```bash
> set k1 v1
OK
> multi                         # 开启事务
OK
> incr k1                       # 语法正确的命令，但是运行会出问题，字符串不能做自增
QUEUED
> set k2 v2
QUEUED
> set k3 v3
QUEUED
> exec                          # 执行事务，第一条命令没有执行，其他命令都执行了
OK
OK
> get k3
v3
```

<br>

> 监控！Watch（面试常问）

**悲观锁：**

- 很悲观，认为什么时候都会出问题，无论做什么都会加锁！

**乐观锁：**

- 很乐观，认为什么时候都不会出问题，所以不会上锁！更新数据的时候去判断一下，在此期间是否有人修改过这个数据
- 获取version
- 更新的时候比较version

<br>

> Redis 监视测试

正常执行成功！

```bash
127.0.0.1:6379> set money 100
OK
127.0.0.1:6379> set out 0
OK
127.0.0.1:6379> watch money              # 监视 money
OK
127.0.0.1:6379> multi                    # 事务正常结束，在此期间，没有其他线程修改money，这个时候                                            事务正常执行成功
OK
127.0.0.1:6379(TX)> decrby money 10
QUEUED
127.0.0.1:6379(TX)> incrby out 10
QUEUED
127.0.0.1:6379(TX)> exec                
1) (integer) 90
2) (integer) 10
```

<br>

测试多线程修改money，使用watch可以当做redis的乐观锁操作（操作时再开一个窗口即可）！

```bash
127.0.0.1:6379> watch money            # 监视 money
OK
127.0.0.1:6379> multi
OK
127.0.0.1:6379(TX)> decrby money 20
QUEUED
127.0.0.1:6379(TX)> incrby out 20
QUEUED
127.0.0.1:6379(TX)> exec    # 执行事务之前，另外一个线程修改了money的值，这个时候，就会导致事务执行失                               败！  
(nil)
```

<br>

如果修改失败，获取最新的值就好

```bash
127.0.0.1:6379> unwatch               # 如果数据修改失败，先停止对money的监视
OK
127.0.0.1:6379> watch money           # 重新监视money,得到最新数据
OK
127.0.0.1:6379> multi
OK
127.0.0.1:6379(TX)> decrby money 20
QUEUED
127.0.0.1:6379(TX)> incrby out 20
QUEUED
127.0.0.1:6379(TX)> exec              # 比对监视的数据执行事务前是否有变化，如果没有变化则事务执行                                         成功，如果发生变化，则事务执行失败！
1) (integer) 180
2) (integer) 30
```

<br>

#### Jedis

> 什么是Jedis？Jedis是Redis官方推荐的Java连接开发工具！使用Jedis操作Redis中间件！

> 测试

1、导入对应的依赖

```java
 <!--导入Jedis的包-->
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>5.0.0-beta2</version>
</dependency>
```

<br>

2、编码测试

> 注意：Jedis中的所有方法均对应着redis中的所有命令，包括名称也基本一样，因此掌握redis中的命令即可

代码示例：

```java
public class JedisTest {

    public static void main(String[] args) {
        //连接redis
        Jedis jedis = new Jedis("127.0.0.1", 6379);
        //测试连通性
        System.out.println(jedis.ping());

        //测试字符串
        jedis.set("data", "hello");
        System.out.println(jedis.get("data"));
        System.out.println();

        //测试列表
        jedis.lpush("list", "one");
        System.out.println(jedis.lpop("list"));
        System.out.println();

        //测试集合
        jedis.sadd("set", "one", "two");
        System.out.println(Arrays.toString(jedis.smembers("set").toArray()));
        System.out.println();

        //测试哈希
        jedis.hset("hset", "field1", "one");
        System.out.println(jedis.hget("hset", "field1"));
        System.out.println();

        //测试有序集合
        jedis.zadd("mySet", 1, "one");
        jedis.zadd("mySet", 2, "two");
        System.out.println(jedis.zrange("mySet", 0, -1));
    }
}
```

<br>

> Jedis操作事务示例

```java
public class JedisTest2 {

    public static void main(String[] args) {
        //连接redis
        Jedis jedis = new Jedis("127.0.0.1", 6379);

        //清空数据库
        jedis.flushDB();

        //开启事务
        Transaction multi = jedis.multi();

        //添加命令
        try {
            multi.set("key1", "v1");
            multi.set("key2", "v2");
            multi.set("key3", "v3");
            //执行事务
            multi.exec();
        } catch (Exception e) {
            //放弃事务
            multi.discard();
        }

        //输出命令
        System.out.println(jedis.get("key1"));
        System.out.println(jedis.get("key2"));
        System.out.println(jedis.get("key3"));

        jedis.flushDB();

        //关闭连接
        jedis.close();
    }
}
```

<br>

#### SpringBoot整合

> 说明：在SpringBoot 2.x 之后，原来的Jedis被替换为了lettuce

Jedis：采用的直连，多个线程操作的话，是不安全的，如果想要避免不安全的话，使用Jedis pool连接池！更像BIO模式

lettuce：采用netty，实例可以在多个线程中进行共享，不存在线程不安全的情况！可以减少线程数据，更像NIO模式

<br>

> Redis自动配置类源码分析

```java
@Bean
@ConditionalOnMissingBean(name = "redisTemplate")
@ConditionalOnSingleCandidate(RedisConnectionFactory.class)
public RedisTemplate<Object, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
    // 默认的redisTemplate没有过多的配置，而redis对象都是需要序列化的！
    // 两个泛型都是<Object, Object>，使用时需要转成<String, Object>
    RedisTemplate<Object, Object> template = new RedisTemplate<>();
    template.setConnectionFactory(redisConnectionFactory);
    return template;
}

// 由于String类型是redis中常使用的类型，因此单独提出来了一个Bean
@Bean
@ConditionalOnMissingBean
@ConditionalOnSingleCandidate(RedisConnectionFactory.class)
public StringRedisTemplate stringRedisTemplate(RedisConnectionFactory redisConnectionFactory) {
    return new StringRedisTemplate(redisConnectionFactory);
}
```

<br>

> 整合测试

1、导入依赖

```java
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

<br>

2、配置application.yml

```java
spring:  
    redis:
        host: localhost
        port: 6379
```

<br>

3、编码测试

```java
@Autowired
private RedisTemplate redisTemplate;

@Test
public void testRedis() {
    //opsForValue   操作字符串
    //opsForList    操作列表
    //opsForSet     操作集合
    //opsForHash    操作哈希
    //opsForZSet    操作有序集合

    redisTemplate.opsForValue().set("k1", "v1");
    System.out.println(redisTemplate.opsForValue().get("k1"));

    //其他同理
    //redisTemplate.opsForList();
    //redisTemplate.opsForSet();
    //redisTemplate.opsForHash();
    //redisTemplate.opsForZSet();

    //获取连接对象，可以进行数据库数据删除操作
    RedisConnection connection = redisTemplate.getConnectionFactory().getConnection();
    connection.flushDb();
    //connection.flushAll();
}
```

<br>

> 自定义RedisTemplate配置类

配置RedisTemplate序列化方式（默认采用jdk提供的序列化方式，key和value通常会出现乱码）

```java
@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, Object> redisTemplateBySelf(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(redisConnectionFactory);

        //配置redis序列化方式
        Jackson2JsonRedisSerializer jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer(Object.class);
        ObjectMapper om = new ObjectMapper();
        om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        om.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
        jackson2JsonRedisSerializer.setObjectMapper(om);
        StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();

        // key采用String的序列化方式
        template.setKeySerializer(stringRedisSerializer);
        // hash的key也采用String的序列化方式
        template.setHashKeySerializer(stringRedisSerializer);
        // value序列化方式采用jackson
        template.setValueSerializer(jackson2JsonRedisSerializer);
        // hash的value序列化方式采用jackson
        template.setHashValueSerializer(jackson2JsonRedisSerializer);
        template.afterPropertiesSet();

        return template;
    }
}
```

<br>

> RedisTemplate工具类

企业开发中一般不会使用原生的RedisTemplate，而会使用再封装的工具类

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@Component
public final class RedisUtil {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    // =============================common============================
    /**
     * 指定缓存失效时间
     * @param key  键
     * @param time 时间(秒)
     */
    public boolean expire(String key, long time) {
        try {
            if (time > 0) {
                redisTemplate.expire(key, time, TimeUnit.SECONDS);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 根据key 获取过期时间
     * @param key 键 不能为null
     * @return 时间(秒) 返回0代表为永久有效
     */
    public long getExpire(String key) {
        return redisTemplate.getExpire(key, TimeUnit.SECONDS);
    }


    /**
     * 判断key是否存在
     * @param key 键
     * @return true 存在 false不存在
     */
    public boolean hasKey(String key) {
        try {
            return redisTemplate.hasKey(key);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    /**
     * 删除缓存
     * @param key 可以传一个值 或多个
     */
    @SuppressWarnings("unchecked")
    public void del(String... key) {
        if (key != null && key.length > 0) {
            if (key.length == 1) {
                redisTemplate.delete(key[0]);
            } else {
                redisTemplate.delete((Collection<String>) CollectionUtils.arrayToList(key));
            }
        }
    }


    // ============================String=============================

    /**
     * 普通缓存获取
     * @param key 键
     * @return 值
     */
    public Object get(String key) {
        return key == null ? null : redisTemplate.opsForValue().get(key);
    }

    /**
     * 普通缓存放入
     * @param key   键
     * @param value 值
     * @return true成功 false失败
     */

    public boolean set(String key, Object value) {
        try {
            redisTemplate.opsForValue().set(key, value);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    /**
     * 普通缓存放入并设置时间
     * @param key   键
     * @param value 值
     * @param time  时间(秒) time要大于0 如果time小于等于0 将设置无限期
     * @return true成功 false 失败
     */

    public boolean set(String key, Object value, long time) {
        try {
            if (time > 0) {
                redisTemplate.opsForValue().set(key, value, time, TimeUnit.SECONDS);
            } else {
                set(key, value);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    /**
     * 递增
     * @param key   键
     * @param delta 要增加几(大于0)
     */
    public long incr(String key, long delta) {
        if (delta < 0) {
            throw new RuntimeException("递增因子必须大于0");
        }
        return redisTemplate.opsForValue().increment(key, delta);
    }


    /**
     * 递减
     * @param key   键
     * @param delta 要减少几(小于0)
     */
    public long decr(String key, long delta) {
        if (delta < 0) {
            throw new RuntimeException("递减因子必须大于0");
        }
        return redisTemplate.opsForValue().increment(key, -delta);
    }


    // ================================Map=================================

    /**
     * HashGet
     * @param key  键 不能为null
     * @param item 项 不能为null
     */
    public Object hget(String key, String item) {
        return redisTemplate.opsForHash().get(key, item);
    }

    /**
     * 获取hashKey对应的所有键值
     * @param key 键
     * @return 对应的多个键值
     */
    public Map<Object, Object> hmget(String key) {
        return redisTemplate.opsForHash().entries(key);
    }

    /**
     * HashSet
     * @param key 键
     * @param map 对应多个键值
     */
    public boolean hmset(String key, Map<String, Object> map) {
        try {
            redisTemplate.opsForHash().putAll(key, map);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    /**
     * HashSet 并设置时间
     * @param key  键
     * @param map  对应多个键值
     * @param time 时间(秒)
     * @return true成功 false失败
     */
    public boolean hmset(String key, Map<String, Object> map, long time) {
        try {
            redisTemplate.opsForHash().putAll(key, map);
            if (time > 0) {
                expire(key, time);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    /**
     * 向一张hash表中放入数据,如果不存在将创建
     *
     * @param key   键
     * @param item  项
     * @param value 值
     * @return true 成功 false失败
     */
    public boolean hset(String key, String item, Object value) {
        try {
            redisTemplate.opsForHash().put(key, item, value);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 向一张hash表中放入数据,如果不存在将创建
     *
     * @param key   键
     * @param item  项
     * @param value 值
     * @param time  时间(秒) 注意:如果已存在的hash表有时间,这里将会替换原有的时间
     * @return true 成功 false失败
     */
    public boolean hset(String key, String item, Object value, long time) {
        try {
            redisTemplate.opsForHash().put(key, item, value);
            if (time > 0) {
                expire(key, time);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    /**
     * 删除hash表中的值
     *
     * @param key  键 不能为null
     * @param item 项 可以使多个 不能为null
     */
    public void hdel(String key, Object... item) {
        redisTemplate.opsForHash().delete(key, item);
    }


    /**
     * 判断hash表中是否有该项的值
     *
     * @param key  键 不能为null
     * @param item 项 不能为null
     * @return true 存在 false不存在
     */
    public boolean hHasKey(String key, String item) {
        return redisTemplate.opsForHash().hasKey(key, item);
    }


    /**
     * hash递增 如果不存在,就会创建一个 并把新增后的值返回
     *
     * @param key  键
     * @param item 项
     * @param by   要增加几(大于0)
     */
    public double hincr(String key, String item, double by) {
        return redisTemplate.opsForHash().increment(key, item, by);
    }


    /**
     * hash递减
     *
     * @param key  键
     * @param item 项
     * @param by   要减少记(小于0)
     */
    public double hdecr(String key, String item, double by) {
        return redisTemplate.opsForHash().increment(key, item, -by);
    }


    // ============================set=============================

    /**
     * 根据key获取Set中的所有值
     * @param key 键
     */
    public Set<Object> sGet(String key) {
        try {
            return redisTemplate.opsForSet().members(key);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }


    /**
     * 根据value从一个set中查询,是否存在
     *
     * @param key   键
     * @param value 值
     * @return true 存在 false不存在
     */
    public boolean sHasKey(String key, Object value) {
        try {
            return redisTemplate.opsForSet().isMember(key, value);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    /**
     * 将数据放入set缓存
     *
     * @param key    键
     * @param values 值 可以是多个
     * @return 成功个数
     */
    public long sSet(String key, Object... values) {
        try {
            return redisTemplate.opsForSet().add(key, values);
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }


    /**
     * 将set数据放入缓存
     *
     * @param key    键
     * @param time   时间(秒)
     * @param values 值 可以是多个
     * @return 成功个数
     */
    public long sSetAndTime(String key, long time, Object... values) {
        try {
            Long count = redisTemplate.opsForSet().add(key, values);
            if (time > 0)
                expire(key, time);
            return count;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }


    /**
     * 获取set缓存的长度
     *
     * @param key 键
     */
    public long sGetSetSize(String key) {
        try {
            return redisTemplate.opsForSet().size(key);
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }


    /**
     * 移除值为value的
     *
     * @param key    键
     * @param values 值 可以是多个
     * @return 移除的个数
     */

    public long setRemove(String key, Object... values) {
        try {
            Long count = redisTemplate.opsForSet().remove(key, values);
            return count;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    // ===============================list=================================

    /**
     * 获取list缓存的内容
     *
     * @param key   键
     * @param start 开始
     * @param end   结束 0 到 -1代表所有值
     */
    public List<Object> lGet(String key, long start, long end) {
        try {
            return redisTemplate.opsForList().range(key, start, end);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }


    /**
     * 获取list缓存的长度
     *
     * @param key 键
     */
    public long lGetListSize(String key) {
        try {
            return redisTemplate.opsForList().size(key);
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }


    /**
     * 通过索引 获取list中的值
     *
     * @param key   键
     * @param index 索引 index>=0时， 0 表头，1 第二个元素，依次类推；index<0时，-1，表尾，-2倒数第二个元素，依次类推
     */
    public Object lGetIndex(String key, long index) {
        try {
            return redisTemplate.opsForList().index(key, index);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }


    /**
     * 将list放入缓存
     *
     * @param key   键
     * @param value 值
     */
    public boolean lSet(String key, Object value) {
        try {
            redisTemplate.opsForList().rightPush(key, value);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    /**
     * 将list放入缓存
     * @param key   键
     * @param value 值
     * @param time  时间(秒)
     */
    public boolean lSet(String key, Object value, long time) {
        try {
            redisTemplate.opsForList().rightPush(key, value);
            if (time > 0)
                expire(key, time);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }

    }


    /**
     * 将list放入缓存
     *
     * @param key   键
     * @param value 值
     * @return
     */
    public boolean lSet(String key, List<Object> value) {
        try {
            redisTemplate.opsForList().rightPushAll(key, value);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }

    }


    /**
     * 将list放入缓存
     *
     * @param key   键
     * @param value 值
     * @param time  时间(秒)
     * @return
     */
    public boolean lSet(String key, List<Object> value, long time) {
        try {
            redisTemplate.opsForList().rightPushAll(key, value);
            if (time > 0)
                expire(key, time);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    /**
     * 根据索引修改list中的某条数据
     *
     * @param key   键
     * @param index 索引
     * @param value 值
     * @return
     */

    public boolean lUpdateIndex(String key, long index, Object value) {
        try {
            redisTemplate.opsForList().set(key, index, value);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    /**
     * 移除N个值为value
     *
     * @param key   键
     * @param count 移除多少个
     * @param value 值
     * @return 移除的个数
     */

    public long lRemove(String key, long count, Object value) {
        try {
            Long remove = redisTemplate.opsForList().remove(key, count, value);
            return remove;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }

    }
}
```

<br>

> 使用RedisUtil工具类测试

```java
@SpringBootTest
public class RedisTest {
    
    @Autowired
    private RedisUtil redisUtil;
    
    @Test
    public void test() {
        redisUtil.set("k1", "狂神");
        System.out.println(redisUtil.get("k1"));
    }
}
```



























