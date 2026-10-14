import { LatticeField } from "./LatticeField";

export { LatticeField };

export default function Global3DBackground() {
  return <LatticeField className="fixed inset-0 -z-10 pointer-events-none" />;
}
