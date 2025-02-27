import fs from 'fs'
import path from 'path'

// 定义正则表达式匹配所有汉字
const regex = /[\u4e00-\u9fa5]+/g

// 匹配 JavaScript 单行和多行注释的正则
const commentRegex = /\/\/.*|\/\*[^]*?\*\//g

// 需要排除的文件夹和文件（可以根据需要修改）
const excludeDirs = ['node_modules', '.git'] // 排除的文件夹
const excludeFiles = ['example.js', 'test.js'] // 排除的文件

const directoryPath = 'src' // 假设脚本和 src 在同一项目目录下

// 允许遍历的文件扩展名列表
const allowedExtensions = ['.js', '.jsx', '.ts', '.tsx', '.vue']

function checkFiles(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file)

    // 检查是否是排除的文件夹或文件
    if (excludeDirs.includes(file) || excludeFiles.includes(file)) {
      console.log(`跳过文件或文件夹：${filePath}`)
      return
    }

    // 如果是目录，递归遍历
    if (fs.lstatSync(filePath).isDirectory()) {
      checkFiles(filePath)
    } else {
      // 检查文件扩展名，如果不在允许的扩展名列表中，跳过
      const extname = path.extname(filePath)
      if (!allowedExtensions.includes(extname)) {
        return
      }

      // 只处理 .js, .jsx, .ts, .tsx, .vue 文件
      let content = fs.readFileSync(filePath, 'utf-8')

      // 移除注释内容
      const cleanedContent = content.replace(commentRegex, '')

      const matches = cleanedContent.match(regex) // 匹配所有汉字

      if (matches) {
        matches.forEach((match) => {
          //   console.log(match, isDefaultUsage(content, match), 100)

          // 检查当前汉字是否在 default: [汉字] 结构中
          if (!isDefaultUsage(content, match)) {
            console.log(`未使用 default 方法的中文字符串：${match} 在文件 ${filePath}`)
          } else {
            // 已经找到的，通过replace，删除掉，防止下次重复匹配
            const defaultMatch = new RegExp(`default\\s*:\\s*${match}`)
            content = content.replace(defaultMatch, 'isUse')
          }
        })
      }
    }
  })
}

// 检查当前汉字是否符合 default: 汉字 结构
function isDefaultUsage(content, match) {
  // 动态生成匹配 default: <汉字> 结构
  const defaultMatch = new RegExp(`default\\s*:\\s*${match}`, 'g')
  // 如果匹配到 default: <汉字>，则返回 true，不打印
  return defaultMatch.test(content)
}

// 开始检查
checkFiles(directoryPath)
