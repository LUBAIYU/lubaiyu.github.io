---
title: 自定义SDK下载
createTime: 2024/05/012 17:16:00
author: 路白榆
tags:
  - SDK
  - 下载
permalink: /article/8w1ev9gd/
---

### 实现自定义SDK下载

#### 前端

代码示例：

```ts
//下载SDK
const downloadSDK = async () => {
    try {
        const link = document.createElement('a');
        link.href = 'http://localhost:9000/api/user/download/jar';
        // 设置下载属性，让浏览器弹出下载对话框
        link.setAttribute('download', '');
        document.body.appendChild(link);
        // 触发点击事件，开始下载
        link.click();
        // 下载完成后移除元素
        document.body.removeChild(link);
        message.success('下载成功');
    } catch (error) {
        message.error('下载失败');
    }
}
```

<br>

#### 后端

代码示例：

```java
public void downloadJar(HttpServletResponse response) {
    try {
        //设置响应类型
        response.setContentType("application/java-archive");
        //设置响应头，指定下载的文件名
        response.setHeader("Content-Disposition", "attachment; filename=byapi-sdk.jar");
        //指定jar包路径
        String filePath = "D:/idea/project/byapi-backend/byapi-sdk/target/byapi-sdk-0.0.1-SNAPSHOT.jar";
        File jarFile = new File(filePath);
        try (InputStream inputStream = new FileInputStream(jarFile);
             OutputStream outputStream = response.getOutputStream()) {
            //将jar包写入响应体中
            IoUtil.copy(inputStream, outputStream);
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, CommonConsts.SDK_DOWNLOAD_ERROR);
        }
    } catch (Exception e) {
        throw new BusinessException(ErrorCode.PARAMS_ERROR, CommonConsts.SDK_DOWNLOAD_ERROR);
    }
}
```

