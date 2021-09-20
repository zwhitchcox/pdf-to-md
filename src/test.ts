import _expect from 'expect'
type AnyFn = (...args: any) => any | void
export const test = process.env.NODE_ENV === 'test' ? async (fn: AnyFn) => {
  await fn()
} : (() => {})

export const expect = process.env.NODE_ENV === "test" ? _expect
  : (() => {}) as unknown as typeof _expect