import { CreatureWindow } from "@/components/archive/creature";
import { IdentityWindow } from "@/components/archive/identity";

/** The two "find" windows, side by side. */
export function FindWindows() {
  return (
    <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
      <IdentityWindow />
      <CreatureWindow />
    </div>
  );
}
