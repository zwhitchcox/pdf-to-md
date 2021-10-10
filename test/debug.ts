import { debuglog } from "util";
import pkg from '../package.json'
export const debug = debuglog(pkg.name + '-debug');
