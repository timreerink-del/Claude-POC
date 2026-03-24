/**
 * Shared filter state — lightweight module-level store
 * used to pass selections between search screens and filter UIs.
 */

type Listener = () => void;

let _selectedLocation: string | null = 'Amsterdam, Noord Holland';
let _selectedEmployer: string | null = null;
const _listeners: Set<Listener> = new Set();

function notify() {
  _listeners.forEach((fn) => fn());
}

export const filterState = {
  getLocation: () => _selectedLocation,
  setLocation: (v: string | null) => { _selectedLocation = v; notify(); },
  getEmployer: () => _selectedEmployer,
  setEmployer: (v: string | null) => { _selectedEmployer = v; notify(); },
  subscribe: (fn: Listener) => {
    _listeners.add(fn);
    return () => { _listeners.delete(fn); };
  },
};
