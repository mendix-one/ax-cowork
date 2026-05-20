const portals = new Map<string, React.ReactElement>();
const listeners = new Set<(entries: [string, React.ReactElement][]) => void>();

export const PortalRegistry = {
  addListener(fn: (entries: [string, React.ReactElement][]) => void) {
    listeners.add(fn);

    fn([...portals.entries()]);
  },
  removeListener(fn: (entries: [string, React.ReactElement][]) => void) {
    listeners.delete(fn);
  },

  registerPortal(id: string, reactElement: React.ReactElement) {
    portals.set(id, reactElement);
    listeners.forEach(fn => fn([...portals.entries()]));
  },

  unregisterPortal(id: string) {
    portals.delete(id);
    listeners.forEach(fn => fn([...portals.entries()]));
  },

  getAllPortals() {
    return [...portals.entries()];
  },

  has(id: string) {
    return portals.has(id);
  }
};