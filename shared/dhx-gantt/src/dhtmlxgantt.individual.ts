import {gantt} from "./dhtmlxgantt.web.single";

import scope from "./utils/global";

(scope as any).gantt = gantt;

export default gantt;

export { gantt };