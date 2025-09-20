# natours-study-nodejs

## 开发依赖 - eslint, prettier 安装

```shell
 npm i -D eslint eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react
```

## WebStorm macOS 快捷键键盘布局

### ⌘（Command）相关

| 键位             | 功能        |
|----------------|-----------|
| ⌘ + D          | 复制当前行到下一行 |
| ⌘ + ⌫          | 删除当前行     |
| ⌘ + /          | 注释/取消注释行  |
| ⌘ + O          | 查找类       |
| ⇧ + ⌘ + O      | 查找文件      |
| ⌥ + ⌘ + O      | 查找符号      |
| ⇧ + ⌘ + F      | 全局查找      |
| ⇧ + ⌘ + R      | 全局替换      |
| ⌥ + ⌘ + L      | 格式化代码     |
| ⌘ + B / ⌘ + 点击 | 跳转到定义     |

---

### ⌥（Option / Alt）相关

| 键位            | 功能        |
|---------------|-----------|
| ⌥ + ⇧ + ↑ / ↓ | 移动行上下     |
| ⌥ + ⌘ + /     | 块注释       |
| ⌥ + ⌘ + 鼠标拖动  | 矩形多选（列选择） |
| ⌘ + ⌥ + R     | 调试时继续运行   |

---

### ⌃（Control）相关

| 键位        | 功能        |
|-----------|-----------|
| ⌃ + G     | 选中下一个相同单词 |
| ⌃ + ⇧ + G | 取消上一个多选   |
| ⌃ + ⌘ + G | 选中所有相同单词  |
| ⌃ + ⇧ + J | 合并下一行到当前行 |
| ⌃ + R     | 运行        |
| ⌃ + D     | 调试        |

---

### 功能键（F 区域）

| 键位 | 功能            |
|----|---------------|
| F7 | 步入（Step Into） |
| F8 | 步过（Step Over） |

**## git commit 提交规范

[Commit message 和 Change log 编写指南](https://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)

### 提交类型

- feat：新功能（feature）
- fix：修补bug
- docs：文档（documentation）
- style： 格式（不影响代码运行的变动）
- refactor：重构（即不是新增功能，也不是修改bug的代码变动）
- test：增加测试
- chore：构建过程或辅助工具的变动**

### emoji 对照表

| emoji      | emoji 代码                      | commit 说明       |
|------------|-------------------------------|-----------------|
| 🎉 (庆祝)    | `:tada:`                      | 初次提交            |
| 🆕 (全新)    | `:new:`                       | 引入新功能           |
| 🔖 (书签)    | `:bookmark:`                  | 发行/版本标签         |
| 🐛 (bug)   | `:bug:`                       | 修复 bug          |
| 🚑 (急救车)   | `:ambulance:`                 | 重要补丁            |
| 🌐 (地球)    | `:globe_with_meridians:`      | 国际化与本地化         |
| 💄 (口红)    | `:lipstick:`                  | 更新 UI 和样式文件     |
| 🎬 (场记板)   | `:clapper:`                   | 更新演示/示例         |
| 🚨 (警车灯)   | `:rotating_light:`            | 移除 linter 警告    |
| 🔧 (扳手)    | `:wrench:`                    | 修改配置文件          |
| ➕ (加号)     | `:heavy_plus_sign:`           | 增加一个依赖          |
| ➖ (减号)     | `:heavy_minus_sign:`          | 减少一个依赖          |
| ⬆️ (上升箭头)  | `:arrow_up:`                  | 升级依赖            |
| ⬇️ (下降箭头)  | `:arrow_down:`                | 降级依赖            |
| ⚡ (闪电)     | `:zap:`                       | 提升性能            |
| 🐎 (赛马)    | `:racehorse:`                 | 提升性能            |
| 📈 (上升趋势图) | `:chart_with_upwards_trend:`  | 添加分析或跟踪代码       |
| 🚀 (火箭)    | `:rocket:`                    | 部署功能            |
| ✅ (白色复选框)  | `:white_check_mark:`          | 增加测试            |
| 📝 (备忘录)   | `:memo:`                      | 撰写文档            |
| 📖 (书)     | `:book:`                      | 撰写文档            |
| 🔨 (锤子)    | `:hammer:`                    | 重大重构            |
| 🎨 (调色板)   | `:art:`                       | 改进代码结构/代码格式     |
| 🔥 (火焰)    | `:fire:`                      | 移除代码或文件         |
| ✏️ (铅笔)    | `:pencil2:`                   | 修复 typo         |
| 🚧 (施工)    | `:construction:`              | 工作进行中           |
| 🗑️ (垃圾桶)  | `:wastebasket:`               | 废弃或删除           |
| ♿ (轮椅)     | `:wheelchair:`                | 可访问性            |
| 👷 (工人)    | `:construction_worker:`       | 添加 CI 构建系统      |
| 💚 (绿心)    | `:green_heart:`               | 修复 CI 构建问题      |
| 🔒 (锁)     | `:lock:`                      | 修复安全问题          |
| 🐳 (鲸鱼)    | `:whale:`                     | Docker 相关工作     |
| 🍎 (苹果)    | `:apple:`                     | 修复 macOS 下的问题   |
| 🐧 (企鹅)    | `:penguin:`                   | 修复 Linux 下的问题   |
| 🏁 (旗帜)    | `:checkered_flag:`            | 修复 Windows 下的问题 |
| 🔀 (交叉箭头)  | `:twisted_rightwards_arrows:` | 分支合并            |

#### 常用emoji 网站

[gitmoji](https://gitmoji.dev/)