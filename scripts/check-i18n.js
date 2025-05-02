import fs from 'fs'
import path from 'path'

const regex = /[\u4e00-\u9fa5]+/ // 定义正则表达式匹配所有汉字

const intlRegex = /intl\s*\([^)]*\)/g // 直接匹配 `intl(...)` 并删除

// 判断是否是注释行
function isCommentLine(line) {
  const trimmedLine = line.trim()
  return (
    trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || trimmedLine.startsWith('<!--')
  )
}

const excludeDirs = ['assets', 'locales', 'router', 'stores', 'views'] // 需要排除的文件夹

const excludeFiles = ['main.ts'] // 需要排除的文件

const directoryPath = 'src' // 假设脚本和 src 在同一项目目录下

// 允许遍历的文件扩展名列表
const allowedExtensions = ['.js', '.jsx', '.ts', '.tsx', '.vue']

function checkFiles(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file)

    // 检查是否是排除的文件夹或文件,是则删除
    if (excludeDirs.includes(file) || excludeFiles.includes(file)) {
      return
    }

    // 如果是目录，递归遍历
    if (fs.lstatSync(filePath).isDirectory()) {
      checkFiles(filePath)
    } else {
      // 检查文件扩展名
      const extname = path.extname(filePath)
      if (!allowedExtensions.includes(extname)) {
        return
      }

      // 读取文件内容
      let content = fs.readFileSync(filePath, 'utf-8')

      // 将每行按行拆分
      const lines = content.split('\n')

      // 过滤掉注释行
      let cleanedContent = lines.filter((line) => !isCommentLine(line)).join('\n')

      // 先移除所有 `intl({ id: 'xxx', def: 'xxx' })` 结构
      cleanedContent = cleanedContent.replace(intlRegex, '')

      // 只要文件**还包含**汉字，直接打印文件名并跳过
      if (cleanedContent.search(regex) !== -1) {
        console.log(`文件 ${filePath} 中包含未包裹 intl 的汉字`)
        return // 直接跳过，不打印具体汉字
      }
    }
  })
}

// 开始检查
checkFiles(directoryPath)
