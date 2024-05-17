import{_ as a,o as l,c as h,a as i,b as s}from"./app-BYU0ldrB.js";const n={},e=i("p",null,"面向切面编程",-1),t=i("p",null,"相关术语：",-1),k=i("p",null,"切入点（PointCut）：被标识为需要增强处理的连接点",-1),r=i("p",null,"连接点（JoinPoint）：指程序运行中的一些时间点（如方法调用或异常抛出）",-1),d=i("p",null,"切面（Aspect）：封装用于横向插入系统的功能（如事务、日志等）的类",-1),p=i("p",null,"通知/增强处理（Advice）：指在切入点执行的增强处理代码，可以理解为切面类中的方法，是切面的具体实现",-1),c=i("br",null,null,-1),g=i("h4",{id:"_1-引入依赖",tabindex:"-1"},[i("a",{class:"header-anchor",href:"#_1-引入依赖"},[i("span",null,"1.引入依赖")])],-1),o=i("div",{class:"language-java line-numbers-mode","data-ext":"java","data-title":"java"},[i("pre",{class:"shiki shiki-themes vitesse-light vitesse-dark vp-code","v-pre":""},[i("code",null,[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#AB5959","--shiki-dark":"#CB7676"}},"<"),i("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"dependency"),i("span",{style:{"--shiki-light":"#AB5959","--shiki-dark":"#CB7676"}},">")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#AB5959","--shiki-dark":"#CB7676"}},"    <"),i("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"groupId"),i("span",{style:{"--shiki-light":"#AB5959","--shiki-dark":"#CB7676"}},">"),i("span",{style:{"--shiki-light":"#B07D48","--shiki-dark":"#BD976A"}},"org"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"."),i("span",{style:{"--shiki-light":"#B07D48","--shiki-dark":"#BD976A"}},"springframework"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"."),i("span",{style:{"--shiki-light":"#B07D48","--shiki-dark":"#BD976A"}},"boot"),i("span",{style:{"--shiki-light":"#AB5959","--shiki-dark":"#CB7676"}},"</"),i("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"groupId"),i("span",{style:{"--shiki-light":"#AB5959","--shiki-dark":"#CB7676"}},">")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#AB5959","--shiki-dark":"#CB7676"}},"    <"),i("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"artifactId"),i("span",{style:{"--shiki-light":"#AB5959","--shiki-dark":"#CB7676"}},">"),i("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"spring"),i("span",{style:{"--shiki-light":"#AB5959","--shiki-dark":"#CB7676"}},"-"),i("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"boot"),i("span",{style:{"--shiki-light":"#AB5959","--shiki-dark":"#CB7676"}},"-"),i("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"starter"),i("span",{style:{"--shiki-light":"#AB5959","--shiki-dark":"#CB7676"}},"-"),i("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"aop"),i("span",{style:{"--shiki-light":"#AB5959","--shiki-dark":"#CB7676"}},"</"),i("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"artifactId"),i("span",{style:{"--shiki-light":"#AB5959","--shiki-dark":"#CB7676"}},">")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#AB5959","--shiki-dark":"#CB7676"}},"</"),i("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"dependency"),i("span",{style:{"--shiki-light":"#AB5959","--shiki-dark":"#CB7676"}},">")])])]),i("div",{class:"line-numbers","aria-hidden":"true"},[i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"})])],-1),A=i("br",null,null,-1),y=i("h4",{id:"_2-编写切面类",tabindex:"-1"},[i("a",{class:"header-anchor",href:"#_2-编写切面类"},[i("span",null,"2.编写切面类")])],-1),B=i("div",{class:"language-java line-numbers-mode","data-ext":"java","data-title":"java"},[i("pre",{class:"shiki shiki-themes vitesse-light vitesse-dark vp-code","v-pre":""},[i("code",null,[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#A0ADA0","--shiki-dark":"#758575DD"}},"/**")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#A0ADA0","--shiki-dark":"#758575DD"}}," * 切面类")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#A0ADA0","--shiki-dark":"#758575DD"}}," */")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"@"),i("span",{style:{"--shiki-light":"#AB5959","--shiki-dark":"#CB7676"}},"Aspect")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"@"),i("span",{style:{"--shiki-light":"#AB5959","--shiki-dark":"#CB7676"}},"Component")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#AB5959","--shiki-dark":"#CB7676"}},"public"),i("span",{style:{"--shiki-light":"#AB5959","--shiki-dark":"#CB7676"}}," class"),i("span",{style:{"--shiki-light":"#2E8F82","--shiki-dark":"#5DA994"}}," MyAspect"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}}," {")]),s(`
`),i("span",{class:"line"}),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#A0ADA0","--shiki-dark":"#758575DD"}},"    //切入点表达式")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"    @"),i("span",{style:{"--shiki-light":"#AB5959","--shiki-dark":"#CB7676"}},"Pointcut"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"("),i("span",{style:{"--shiki-light":"#B5695999","--shiki-dark":"#C98A7D99"}},'"'),i("span",{style:{"--shiki-light":"#B56959","--shiki-dark":"#C98A7D"}},"execution(void com.example.service.UserService.save())"),i("span",{style:{"--shiki-light":"#B5695999","--shiki-dark":"#C98A7D99"}},'"'),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},")")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#AB5959","--shiki-dark":"#CB7676"}},"    public"),i("span",{style:{"--shiki-light":"#AB5959","--shiki-dark":"#CB7676"}}," void"),i("span",{style:{"--shiki-light":"#59873A","--shiki-dark":"#80A665"}}," pointcut"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"()"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}}," {")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"    }")]),s(`
`),i("span",{class:"line"}),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#A0ADA0","--shiki-dark":"#758575DD"}},"    //环绕通知")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"    @"),i("span",{style:{"--shiki-light":"#AB5959","--shiki-dark":"#CB7676"}},"Around"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"("),i("span",{style:{"--shiki-light":"#B5695999","--shiki-dark":"#C98A7D99"}},'"'),i("span",{style:{"--shiki-light":"#B56959","--shiki-dark":"#C98A7D"}},"pointcut()"),i("span",{style:{"--shiki-light":"#B5695999","--shiki-dark":"#C98A7D99"}},'"'),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},")")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#AB5959","--shiki-dark":"#CB7676"}},"    public"),i("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}}," Object "),i("span",{style:{"--shiki-light":"#59873A","--shiki-dark":"#80A665"}},"strengthen"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"("),i("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"ProceedingJoinPoint "),i("span",{style:{"--shiki-light":"#B07D48","--shiki-dark":"#BD976A"}},"joinPoint"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},")"),i("span",{style:{"--shiki-light":"#AB5959","--shiki-dark":"#CB7676"}}," throws"),i("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}}," Throwable "),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"{")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#A0ADA0","--shiki-dark":"#758575DD"}},"        //输出当前系统时间")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#B07D48","--shiki-dark":"#BD976A"}},"        System"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"."),i("span",{style:{"--shiki-light":"#B07D48","--shiki-dark":"#BD976A"}},"out"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"."),i("span",{style:{"--shiki-light":"#59873A","--shiki-dark":"#80A665"}},"println"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"("),i("span",{style:{"--shiki-light":"#B07D48","--shiki-dark":"#BD976A"}},"LocalDateTime"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"."),i("span",{style:{"--shiki-light":"#59873A","--shiki-dark":"#80A665"}},"now"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"());")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#A0ADA0","--shiki-dark":"#758575DD"}},"        //执行原始方法")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"        Object"),i("span",{style:{"--shiki-light":"#B07D48","--shiki-dark":"#BD976A"}}," obj"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}}," ="),i("span",{style:{"--shiki-light":"#B07D48","--shiki-dark":"#BD976A"}}," joinPoint"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"."),i("span",{style:{"--shiki-light":"#59873A","--shiki-dark":"#80A665"}},"proceed"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"();")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#A0ADA0","--shiki-dark":"#758575DD"}},"        //输出当前系统时间")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#B07D48","--shiki-dark":"#BD976A"}},"        System"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"."),i("span",{style:{"--shiki-light":"#B07D48","--shiki-dark":"#BD976A"}},"out"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"."),i("span",{style:{"--shiki-light":"#59873A","--shiki-dark":"#80A665"}},"println"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"("),i("span",{style:{"--shiki-light":"#B07D48","--shiki-dark":"#BD976A"}},"LocalDateTime"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"."),i("span",{style:{"--shiki-light":"#59873A","--shiki-dark":"#80A665"}},"now"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"());")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#1E754F","--shiki-dark":"#4D9375"}},"        return"),i("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}}," obj"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},";")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"    }")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"}")])])]),i("div",{class:"line-numbers","aria-hidden":"true"},[i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"})])],-1),u=i("br",null,null,-1),D=i("h4",{id:"_3-开启aop功能支持",tabindex:"-1"},[i("a",{class:"header-anchor",href:"#_3-开启aop功能支持"},[i("span",null,"3.开启AOP功能支持")])],-1),m=i("p",null,"由于spring-boot-starter-aop依赖已经默认开启AOP支持，所以以下注解可加可不加",-1),v=i("div",{class:"language-java line-numbers-mode","data-ext":"java","data-title":"java"},[i("pre",{class:"shiki shiki-themes vitesse-light vitesse-dark vp-code","v-pre":""},[i("code",null,[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"@"),i("span",{style:{"--shiki-light":"#AB5959","--shiki-dark":"#CB7676"}},"SpringBootApplication")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"@"),i("span",{style:{"--shiki-light":"#AB5959","--shiki-dark":"#CB7676"}},"EnableAspectJAutoProxy")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#AB5959","--shiki-dark":"#CB7676"}},"public"),i("span",{style:{"--shiki-light":"#AB5959","--shiki-dark":"#CB7676"}}," class"),i("span",{style:{"--shiki-light":"#2E8F82","--shiki-dark":"#5DA994"}}," DemoApplication"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}}," {")]),s(`
`),i("span",{class:"line"}),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#AB5959","--shiki-dark":"#CB7676"}},"    public"),i("span",{style:{"--shiki-light":"#AB5959","--shiki-dark":"#CB7676"}}," static"),i("span",{style:{"--shiki-light":"#AB5959","--shiki-dark":"#CB7676"}}," void"),i("span",{style:{"--shiki-light":"#59873A","--shiki-dark":"#80A665"}}," main"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"("),i("span",{style:{"--shiki-light":"#AB5959","--shiki-dark":"#CB7676"}},"String"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"[]"),i("span",{style:{"--shiki-light":"#B07D48","--shiki-dark":"#BD976A"}}," args"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},")"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}}," {")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#B07D48","--shiki-dark":"#BD976A"}},"        SpringApplication"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"."),i("span",{style:{"--shiki-light":"#59873A","--shiki-dark":"#80A665"}},"run"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"("),i("span",{style:{"--shiki-light":"#B07D48","--shiki-dark":"#BD976A"}},"DemoApplication"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"."),i("span",{style:{"--shiki-light":"#B07D48","--shiki-dark":"#BD976A"}},"class"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},","),i("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}}," args"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},");")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"    }")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"}")])])]),i("div",{class:"line-numbers","aria-hidden":"true"},[i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"})])],-1),b=[e,t,k,r,d,p,c,g,o,A,y,B,u,D,m,v];function C(_,E){return l(),h("div",null,b)}const P=a(n,[["render",C],["__file","index.html.vue"]]),j=JSON.parse(`{"path":"/spring/ds7h8ebp/","title":"AOP","lang":"zh-CN","frontmatter":{"title":"AOP","author":"路白榆","tags":["面向切面编程","spring特性"],"createTime":"2024/04/20 13:13:03","permalink":"/spring/ds7h8ebp/","head":[["script",{"id":"check-dark-mode"},";(function () {const um= localStorage.getItem('vuepress-theme-appearance') || 'auto';const sm = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;if (um === 'dark' || (um !== 'light' && sm)) {document.documentElement.classList.add('dark');}})();"],["script",{"id":"check-mac-os"},"document.documentElement.classList.toggle('mac', /Mac|iPhone|iPod|iPad/i.test(navigator.platform))"]]},"headers":[],"readingTime":{"minutes":0.98,"words":293},"git":{"updatedTime":1715238164000,"contributors":[{"name":"user","email":"1296800094@qq.com","commits":2}]},"filePathRelative":"notes/spring/aop.md"}`);export{P as comp,j as data};
