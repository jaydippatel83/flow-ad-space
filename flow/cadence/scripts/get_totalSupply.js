export const getTotalTokenSupply = `
import Fans from 0x50a0fed12f57c962

pub fun main(): UInt64 {
  return Fans.totalSupply
}
`