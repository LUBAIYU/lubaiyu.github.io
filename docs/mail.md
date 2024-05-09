---
title: 实现邮箱发送功能
createTime: 2024/05/09 14:49:00
author: 路白榆
tags:
  - Java
  - 验证码
permalink: /article/t78u23la/
---

### 实现发送邮箱获取验证码

1、引入依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

<br>

2、在application.yml进行配置

```yaml
spring:
  mail:
  username: 1296800094@qq.com
  # 授权码
  password: qiwtdnsvasachebc
  host: smtp.qq.com
  default-encoding: utf-8
  # 开启加密验证
  properties:
    mail:
      smtp:
        ssl:
          enabled: true
```

<br>

> 如何获取授权码？

1、点击QQ邮箱上方的设置

![](https://img2.imgtp.com/2024/05/08/VdXgwRu4.png)

<br>

2、点击账号然后划到POP3服务这里

![](https://img2.imgtp.com/2024/05/08/S1as8eUQ.png)

3、服务状态默认是已关闭，点击开启服务然后跟着指示操作即可获取授权码

<br>

发送邮件代码示例：

```java
/**
 * 邮件发送类
 */
@Resource
private JavaMailSenderImpl javaMailSender;

/**
 * 创建线程池
 */
private final ScheduledExecutorService scheduledExecutorService = new ScheduledThreadPoolExecutor(10, new ThreadPoolExecutor.AbortPolicy());

@Override
public void sendEmail(String email, HttpServletRequest request) {
    HttpSession session = request.getSession();
    //随机生成验证码
    String verCode = RandomUtil.randomNumbers(6);
    //发送时间
    String time = DateUtil.formatDateTime(new Date());
    //保存验证码的map
    Map<String, String> map = new HashMap<>(2);
    map.put(UserConsts.CODE, verCode);
    map.put(UserConsts.EMAIL, email);
    //验证码和邮箱一起放入session
    session.setAttribute(UserConsts.VER_CODE, map);
    Object object = session.getAttribute(UserConsts.VER_CODE);
    Map<String, String> codeMap = (Map<String, String>) object;
    //创建计时线程池
    try {
        //5分钟后移除验证码
        scheduledExecutorService.schedule(() -> {
            if (email.equals(codeMap.get(UserConsts.EMAIL))) {
                session.removeAttribute(UserConsts.VER_CODE);
            }
        }, 5, TimeUnit.MINUTES);
    } catch (Exception e) {
        throw new BusinessException(ErrorCode.PARAMS_ERROR, UserConsts.DELAY_TASK_ERROR);
    }
    //发送邮件
    MimeMessage mimeMessage;
    MimeMessageHelper helper;
    try {
        // 解决本地DNS未配置 ip->域名场景下，邮件发送太慢的问题
        System.getProperties().setProperty("mail.mime.address.usecanonicalhostname", "false");
        //发送复杂的邮件
        mimeMessage = javaMailSender.createMimeMessage();
        Session messageSession = mimeMessage.getSession();
        //解决本地DNS未配置 ip->域名场景下，邮件发送太慢的问题
        messageSession.getProperties().setProperty("mail.smtp.localhost", "myComputer");
        //组装
        helper = new MimeMessageHelper(mimeMessage, true);
        //邮件标题
        helper.setSubject("【By API】 验证码");
        //ture为支持识别html标签
        helper.setText("<h3>\n" +
                "\t<span style=\"font-size:16px;\">亲爱的用户：</span> \n" +
                "</h3>\n" +
                "<p>\n" +
                "\t<span style=\"font-size:14px;\">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style=\"font-size:14px;\">&nbsp; <span style=\"font-size:16px;\">&nbsp;&nbsp;您好！您正在进行邮箱验证，本次请求的验证码为：<span style=\"font-size:24px;color:#FFE500;\"> " + verCode + "</span>，本验证码5分钟内有效，请勿泄露和转发。如非本人操作，请忽略该邮件。</span></span>\n" +
                "</p>\n" +
                "<p style=\"text-align:right;\">\n" +
                "\t<span style=\"background-color:#FFFFFF;font-size:16px;color:#000000;\"><span style=\"color:#000000;font-size:16px;background-color:#FFFFFF;\"><span class=\"token string\" style=\"font-family:&quot;font-size:16px;color:#000000;line-height:normal !important;background-color:#FFFFFF;\">By API</span></span></span> \n" +
                "</p>\n" +
                "<p style=\"text-align:right;\">\n" +
                "\t<span style=\"background-color:#FFFFFF;font-size:14px;\"><span style=\"color:#FF9900;font-size:18px;\"><span class=\"token string\" style=\"font-family:&quot;font-size:16px;color:#000000;line-height:normal !important;\"><span style=\"font-size:16px;color:#000000;background-color:#FFFFFF;\">" + time + "</span><span style=\"font-size:18px;color:#000000;background-color:#FFFFFF;\"></span></span></span></span> \n" +
                "</p>", true);
        //收件人
        helper.setTo(email);
        //发送方
        helper.setFrom("1296800094@qq.com");
        //异步发送邮件
        scheduledExecutorService.execute(() -> javaMailSender.send(mimeMessage));
    } catch (Exception e) {
        //邮箱是无效的，或者发送失败
        throw new BusinessException(ErrorCode.PARAMS_ERROR, UserConsts.SEND_MAIL_ERROR);
    }
}
```

