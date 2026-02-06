# 关于基础样式base.css的说明 #

- 本样式旨在简化开发页面时的css编写时间，通过基础类名累加来快速布局（目前只提供了很基础的样式，后期每个项目会根据UI的图，再提炼一下单个项目中复用度高的布局样式）

----

一系列关键字的说明

| 关键名词  | 说明                   | 常用组合                      |
| --------- | ---------------------- | ----------------------------- |
| full      | 针对容器宽高           | full、full-width、full-height |
| scroll    | 滚动条相关             | scroll-x、scroll-y            |
| layout    | display布局相关        | layout-flex、layout-inline    |
| container | 容器                   | layout-block-container        |
| custom    | 自定义                 | custom-box、custom-list       |
| text      | 文本                   | text-center、text-left        |
| bg        | 背景：background的缩写 | bg-color                      |
| bd        | 边框：border的缩写     | bd-color                      |
| radius    | 圆角                   | radius                        |

- 所有元素都已设置`box-sizing:border-box;`

----

## full

设置容器宽高

| 样式名       | 描述                   | 示例                              |
| ------------ | ---------------------- | --------------------------------- |
| .full        | 设置容器宽度和高度100% | `<div class="full"></div>`        |
| .full-width  | 设置容器宽度100%       | `<div class="full-width"></div>`  |
| .full-height | 设置容器高度100%       | `<div class="full-height"></div>` |

- 此样式使用很简单，就不提供其他示例了

## scroll

设置滚动条显隐

| 样式名           | 描述                  | 示例                                  |
| ---------------- | --------------------- | ------------------------------------- |
| .scroll          | 滚动条设置为auto      | `<div class="scroll"></div>`          |
| .scroll-hidden   | 滚动条设置为hidden    | `<div class="scroll-hidden"></div>`   |
| .scroll-x        | 滚动条x轴设置为auto   | `<div class="scroll-x"></div>`        |
| .scroll-x-hidden | 滚动条x轴设置为hidden | `<div class="scroll-x-hidden"></div>` |
| .scroll-y        | 滚动条y轴设置为auto   | `<div class="scroll-y"></div>`        |
| .scroll-y-hidden | 滚动条y轴设置为hidden | `<div class="scroll-y-hidden"></div>` |

- 此样式使用很简单，就不提供其他示例了

## layout

- 所有layout布局的样式，都是基于主样式名之下的（即没有主样式名，后面的次样式名，子级样式名都不会生效）

此项布局提供了几个大类，如下：

| 样式名                         | 描述                                                   | 详细说明                                                             |
| ------------------------------ | ------------------------------------------------------ | -------------------------------------------------------------------- |
| .layout-flex                   | 设置display:flex                                       | [flex示例](#mark1)                                                   |
| .layout-inline                 | 设置display:inline                                     | [inline示例](#mark2)                                                 |
| .layout-inline-container       | 提供一个容器，内部所有子级元素均自动设置为inline       | [inline-container示例](#mark3)                                       |
| .layout-inline-block           | 设置display:inline-block                               | [inline-block示例](#mark4)                                           |
| .layout-inline-block-container | 提供一个容器，内部所有子级元素均自动设置为inline-block | [inline-block-container示例](#mark5)                                 |
| .layout-block                  | 设置display:block                                      | [block示例](#mark6)                                                  |
| .layout-block-container        | 提供一个容器，内部所有子级元素均自动设置为block        | [block-container示例](#mark7)                                        |
| .layout-table                  | 设置display:table                                      | [table示例](#mark8)                                                  |
| .layout-grid                   | 设置display:grid                                       | grid布局太灵活了，不满足封装的必要，所有后续的grid布局得自己实现细节 |

### <span id="mark1">layout-flex</span>

设置`display:flex`，并提供额外样式，用来进行后续布局排列

| 主样式名     | 次样式名       | 子级样式名      | 类别 | 说明                               |
| ------------ | -------------- | --------------- | ---- | ---------------------------------- |
| .layout-flex | .row           |                 |      | 容器flex布局，横向排列             |
|              | .column        |                 |      | 容器flex布局，纵向排列             |
|              | .center        |                 |      | 容器flex布局，内容居中             |
|              | .center-row    |                 |      | 容器flex布局，横向居中             |
|              | .center-colnum |                 |      | 容器flex布局，纵向居中             |
|              | .between       |                 |      | 容器flex布局，两侧布局             |
|              | -              | .flex           |      | 容器flex布局，子元素占位(`flex:1`) |
|              | -              | .flex1 ~ .flex9 |      | 容器flex布局，子元素占位(`flex:*`) |

代码示例：
```html
<!--元素flex定位，横向排列，内容居中-->
<div class="layout-flex row center">
    <!--固定宽度的子元素-->
    <div style="width:300px"></div>
    <!--子元素占据剩余区域1份额-->
    <div class="flex"></div>
    <!--子元素占据剩余区域2份额-->
    <div class="flex2"></div>
</div>
```

### <span id="mark2">layout-inline</span>

设置`display:inline`

| 主样式名       | 次样式名 | 子级样式名 | 类别 | 说明               |
| -------------- | -------- | ---------- | ---- | ------------------ |
| .layout-inline |          |            |      | 元素display:inline |

示例：
```html
<!--以下三个元素会横向排列，不会一个占整行-->
<div class="layout-inline">1</div>
<div class="layout-inline">2</div>
<div class="layout-inline">3</div>
```

### <span id="mark3">layout-inline-container</span>

提供一个容器，内部子元素自动设置`display:inline`

| 主样式名                 | 次样式名 | 子级样式名 | 类别 | 说明                                              |
| ------------------------ | -------- | ---------- | ---- | ------------------------------------------------- |
| .layout-inline-container |          |            |      | 容器display:inline-block,内部子元素display:inline |
|                          | -        | .right     |      | 子元素右浮动                                      |
|                          | -        | .left      |      | 子元素左浮动                                      |
|                          | .clear   |            |      | 当有子元素设置right或者left时，建议父级增加此样式 |

示例:
```html
<!--内容元素虽是div，但是已被修改为inline；子元素添加了浮动样式right和left，父级添加了full-width设置宽度100%，这样能看出左右浮动效果-->
<div class="layout-inline-container clear full-width">
    <div>第一子元素</div>
    <div class="right">第二子元素</div>
    <div>第三子元素</div>
    <div class="left">第四子元素</div>
</div>
```

### <span id="mark4">layout-inline-block</span>

设置`display:inline-block`

| 主样式名             | 次样式名 | 子级样式名 | 类别 | 说明                   |
| -------------------- | -------- | ---------- | ---- | ---------------------- |
| .layout-inline-block |          |            |      | 设置元素为inline-block |

示例：
```html
<div class="layout-inline-block">
    我是文本内容
</div>
```


### <span id="mark5">layout-inline-block-container</span>

提供容器，容器和内部子元素都自动设置`display:inline-block`

| 主样式名                       | 次样式名 | 子级样式名 | 类别 | 说明                                              |
| ------------------------------ | -------- | ---------- | ---- | ------------------------------------------------- |
| .layout-inline-block-container |          |            |      |                                                   |
|                                | -        | .right     |      | 子元素右浮动                                      |
|                                | -        | .left      |      | 子元素左浮动                                      |
|                                | .clear   |            |      | 当有子元素设置right或者left时，建议父级增加此样式 |

示例：
```html
<!--内容元素虽是div，但是已被修改为inline；子元素添加了浮动样式right和left，父级添加了full-width设置宽度100%，这样能看出左右浮动效果-->
<div class="layout-inline-block-container clear full-width">
    <div>第一子元素</div>
    <div class="right">第二子元素</div>
    <div>第三子元素</div>
    <div class="left">第四子元素</div>
</div>
```

### <span id="mark6">layout-block</span>

设置`display:block`

| 主样式名      | 次样式名 | 子级样式名 | 类别 | 说明 |
| ------------- | -------- | ---------- | ---- | ---- |
| .layout-block |          |            |      |      |

示例：
```html
<span class="layout-block">我是一个块元素</span>
```

### <span id="mark7">layout-block-container</span>

提供一个容器，其本身和内部子元素，自动设置`display:block`

| 主样式名                | 次样式名 | 子级样式名 | 类别 | 说明 |
| ----------------------- | -------- | ---------- | ---- | ---- |
| .layout-block-container |          |            |      |      |

示例：
```html
<span class="layout-block-container">
    <span>我是块元素</span>
    <span>我也是</span>
    <span>我也一样</span>
</span>
```

### <span id="mark8">layout-table</span>

设置`display:table`，并增加子级样式，提供table-cell、table-row之类的一整套对应样式名
PS：这套样式，其实用原生table就实现一样的布局了，这里只是放这儿，万一有用得上的地方就用

| 主样式名      | 次样式名 | 子级样式名      | 类别 | 说明                                           |
| ------------- | -------- | --------------- | ---- | ---------------------------------------------- |
| .layout-table |          |                 |      | 容器table布局                                  |
|               | .center  |                 |      | 容器左右居中                                   |
|               | -        | .caption        |      | table中的标题                                  |
|               | -        | .caption.bottom |      | table中的标题放在底部                          |
|               | -        | .caption.title1 |      | table中的标题对应的文本大小                    |
|               | -        | .caption.title2 |      | table中的标题对应的文本大小                    |
|               | -        | .caption.title3 |      | table中的标题对应的文本大小                    |
|               | -        | .colgroup       |      | table中的colgroup标签                          |
|               | -        | .header         |      | table中的thead                                 |
|               | -        | .header > .tr   |      | table中的thead下的tr                           |
|               | -        | .body           |      | table中的tbody                                 |
|               | -        | .body > .tr     |      | table中的tbody下的tr                           |
|               | -        | .footer         |      | table中的tfoot                                 |
|               | -        | .footer > .tr   |      | table中的tfoot下的tr                           |
|               | -        | .tr             |      | table中的tr（未放到thead、tbody、tfoot下的tr） |

示例：
```html
<span class="layout-table center" style="width: 800px">
    <span class="caption">我是标题</span>
    <span class="caption title2">我是标题</span>
    <span class="caption title3">我是标题</span>
    <span class="colgroup">
        <span style="width: 45px"></span>
        <span></span>
        <span></span>
    </span>
    <span class="header">
        <span class="tr">
            <span class="text-center">序号</span>
            <span>姓名</span>
            <span>备注</span>
        </span>
    </span>
    <span class="body">
        <span class="tr">
            <span class="text-center">1</span>
            <span>赵谦孙俪</span>
            <span>垃圾</span>
        </span>
        <span class="tr">
            <span class="text-center">2</span>
            <span>赵谦孙俪</span>
            <span>垃圾</span>
        </span>
        <span class="tr">
            <span class="text-center">3</span>
            <span>赵谦孙俪</span>
            <span>垃圾</span>
        </span>
    </span>
    <span class="footer">
        <span class="tr">
            <span class="text-center">合计</span>
            <span>footer-tr-td2</span>
            <span>footer-tr-td3</span>
        </span>
    </span>
    <span class="caption bottom">
        <span class="layout-flex row">
            <span class="flex text-left">填表人：里斯</span>
            <span class="flex text-center">局长：收到</span>
            <span class="flex text-right">填表日期：2023-12-25</span>
        </span>
    </span>
</span>
```

## custom

- 所有custom布局的样式，都是基于主样式名之下的（即没有主样式名，后面的次样式名，子级样式名都不会生效）

此项布局（基于UI设计提炼而来）提供了几个大类，如下：

| 样式名       | 描述                                                                                 | 详细说明        |
| ------------ | ------------------------------------------------------------------------------------ | --------------- |
| .custom-box  | 提供了一个带head和foot的容器（就是常见的：顶部标题栏，底部按钮操作区，中间主体部分） | [示例](#mark9)  |
| .custom-list | 提供一个类似ul下li的布局（li内部支持：标题和描述两行区分）                           | [示例](#mark10) |

### <span id="mark9">custom-box</span>

提供一个容器样式：带头部标题，底部按钮区，中间主体内容区

| 主样式名    | 次样式名 | 子级样式名       | 类别 | 说明                           |
| ----------- | -------- | ---------------- | ---- | ------------------------------ |
| .custom-box |          |                  |      |                                |
|             | .shadow  |                  |      | 启动阴影模式                   |
|             | -        | .header          |      | 头部区域                       |
|             | -        | .header > .right |      | 顶部区域内，某个子元素靠右排列 |
|             | -        | .header.center   |      | 顶部区域内所有子元素居中       |
|             | -        | .body            |      | 中间主体区域                   |
|             | -        | .footer          |      | 底部操作区域                   |
|             | -        | .footer > .right |      | 底部区域内，某个子元素靠右排列 |
|             | -        | .footer.center   |      | 底部区域内所有子元素居中       |

示例：
```html
<!--自定义box布局，添加阴影，添加圆角-->
<div
    class="custom-box shadow radius"
    style="width: 500px; height: 400px; margin: 20px 0 0 20px"
>
    <!--头部区域，内容居中-->
    <div class="header center">
        <span>我是标题</span>
        <!--父容器添加了center，right就会无效-->
        <el-button class="right" size="mini" type="text">关闭</el-button>
    </div>
    <!--中间内容区域，内容凹陷-->
    <div class="body box-shadow-inside">我是内容</div>
    <!--底部区域-->
    <div class="footer">
        <el-button size="mini" type="success">保存</el-button>
        <!--按钮靠右-->
        <el-button class="right" size="mini" type="danger">取消</el-button>
    </div>
</div>
```

### <span id="mark10">custom-list</span>

提供一个容器，类似ul下的li布局，每个小项提供标题和内容区分

| 主样式名     | 次样式名 | 子级样式名     | 类别 | 说明         |
| ------------ | -------- | -------------- | ---- | ------------ |
| .custom-list |          |                |      | 列表布局容器 |
|              | -        | .item          |      | 单个小项     |
|              | -        | .item > .title |      | 小项内标题行 |
|              | -        | .item > .desc  |      | 小项内描述行 |

示例：
```html
<!--列表布局，添加默认阴影，圆角-->
<div
    class="custom-list box-shadow-default radius"
    style="width: 500px; height: 350px; margin-top: 20px; margin-left: 20px"
>
    <!--单项-->
    <div class="item">元素one</div>
    <div class="item">元素two</div>
    <div class="item">
        <!--标题行-->
        <div class="title">元素three</div>
        <!--描述行-->
        <div class="desc box-shadow-inside padding-4px radius">
            lsjdlfjdl极力反抗撒旦解放了但是lsjdlfjdl极力反抗撒旦解放了但是lsjdlfjdl极力反抗撒旦解放了但是lsjdlfjdl极力反抗撒旦解放了但是lsjdlfjdl极力反抗撒旦解放了但是
        </div>
    </div>
</div>
```

## text

针对文本的基础样式

| 样式名         | 描述                                      | 示例                                                                                 |
| -------------- | ----------------------------------------- | ------------------------------------------------------------------------------------ |
| .text-center   | 文本居中展示                              | `<div class="text-center" style="width:80px;">我是文本,会居中</div>`                 |
| .text-right    | 文本靠右展示                              | `<div class="text-right" style="width:80px;">我是文本,会靠右</div>`                  |
| .text-left     | 文本靠左展示                              | `<div class="text-left" style="width:80px;">我是文本,会靠左</div>`                   |
| .text-ellipsis | 文本超出部分省略(使用时需要提供width设置) | `<div class="text-ellipsis" style="width:80px;">我是文本,超出容器会显示省略号</div>` |

## 其他基础样式

常用的基础样式

| 样式名              | 描述                                                                    | 示例                                                                 |
| ------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------- |
| .font-size-*px      | 字体大小(px为单位)(`*`表示12~24的偶数)                                  | `<span class="font-size-18px">我的字体大小是18px</span>`             |
| .font-size-*rem     | 字体大小(rem[`注1`](#marka2)为单位)(`*`的可用值见[附录1](#marka1))      | `<span class="font-size-0875rem">我是字体，大小是0.875rem</span>`    |
| .line-height-*rem   | 行高(rem为单位)(`*`的可用值见[附录1](#marka1))                          | `<span class="line-height-0875rem">我是字体，行高是0.875rem</span>`  |
| .font-size-*em      | 字体大小(em[`注2`](#marka3)为单位)(`*`的可用值见[附录1](#marka1))       | `<span class="font-size-0875em">我是字体，大小是0.875em</span>`      |
| .line-height-*em    | 行高(em为单位)(`*`的可用值见[附录1](#marka1))                           | `<span class="line-height-0875em">我是字体，行高是0.875em</span>`    |
| .position-*         | 定位模式(`*`范围：relative,absolute,fixed,static,inherit,initial,unset) | `<div class="position-absolute">绝对定位</div>`                      |
| .float-*            | 浮动(`*`范围：right,left,unset)                                         | `<div class="float-left"></div>`                                     |
| .padding-*px        | 内间距(`*`范围：0~24的偶数)                                             | `<div class="padding-24px"></div>`                                   |
| .margin-*px         | 外间距(`*`范围：0~24的偶数)                                             | `<div class="margin-0px"></div>`                                     |
| .color-*            | 字体颜色(`* `范围：success,warning,danger,info,default)                 | `<span class="color-success">文本颜色</span>`                        |
| .bg-color-*         | 背景颜色(`* `范围：success,warning,danger,info,default)                 | `<div class="bg-color-danger">背景色</div>`                          |
| .bd-color-*         | 边框颜色(`* `范围：success,warning,danger,info,default)                 | `<div class="bd-color-info" style="border:1px solid">边框颜色</div>` |
| .radius             | 圆角度（默认4px）                                                       | `<div class="radius">圆角4px</div>`                                  |
| .box-shadow         | 阴影样式(自带圆角，和padding-4px)                                       | `<div class="box-shadow">阴影模式，圆角，padding默认4px</div>`       |
| .box-shadow-default | 阴影样式(只有阴影)                                                      | `<div class="box-shadow-default">阴影模式</div>`                     |
| .box-shadow-inside  | 内陷阴影样式(自带overflow:hidden)                                       | `<div class="box-shadow-inside">阴影内嵌</div>`                      |
| .link               | 可点击链接样式(自带hover,active,visited伪类样式)【a标签不适用】         | `<span class="link">我是链接</span>`                                 |

<span id="marka1" style="color:blue">附录1：</span>
`*` 可取值：075、0875、1、1125、125、15、175、1875、2、2125、225、25 
- 上列值，其实都是0.75，0.875，1.25之类的缩写，因为小数点`.`不能成为样式名

<span id="marka2" style="color:red">注1</span>
rem是针对网页根节点的font-size，比如html根节点fong-size设置为20px，那么`<div class="font-size-1rem">`的字体就是20px，根节点font-size变了，用到rem的地方都会变

<span id="marka3" style="color:red">注2</span>
em是针对父节点的font-size，比如`<div style="font-size:15px"><span class="font-size-1em"></span></div>`:父节点的font-size为15px，则span的1em就是15px，父节点变了，内部用到em的都会变
