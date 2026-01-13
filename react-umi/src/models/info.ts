// 全局共享数据示例
import { DEFAULT_NAME } from '@/constants'
import { useState } from 'react'

const useUser = () => {
  const [name, setName] = useState<string>('111111111')
  return {
    name,
    setName
  }
}

export default useUser
