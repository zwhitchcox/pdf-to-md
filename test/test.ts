import chalk from 'chalk'
import _expect from 'expect'
type AnyFn = (...args: any) => any | void
export const test = process.env.NODE_ENV === 'test' ? async (name: string, fn: AnyFn) => {
  try {
    await fn()
    console.log(chalk.green('✓'), name)
  } catch (error) {
    console.error(chalk.red('☓'), name)
    console.error(chalk.red(error))
    console.error(error.stack)
  }
} : (() => {})

export const expect = process.env.NODE_ENV === "test" ? _expect
  : (() => {}) as unknown as typeof _expect