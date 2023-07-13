export const getTotalTokenSupply = `
import Fans2 from 0x03c1bff76b994e92

pub fun main(): UInt64 {
  return Fans2.totalSupply
}
`