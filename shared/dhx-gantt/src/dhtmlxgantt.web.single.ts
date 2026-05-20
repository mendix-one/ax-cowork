import extensions from "./ext/extensions_all";
import factoryMethod from "./factory/make_instance_web";
import scope from "./utils/global";

const gantt = (scope as any).gantt = factoryMethod(extensions);

export { gantt };