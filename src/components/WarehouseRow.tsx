import { ID } from "@Services/GameState/utils/SimpleQueryBuider";

import { Input } from "./input";
import { Label } from "./label";

export function WarehouseRow({
  editable = false,
  label,
  number,
  onChange,
  id,
  direction = "row",
}: {
  editable?: boolean;
  label: string;
  number: number;
  id?: ID;
  onChange?: (id: ID, newValue: number) => void;
  direction?: "row" | "column";
}) {
  const onNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    id && onChange?.(id, Number.parseInt(event.target.value));
  };

  return editable && onChange && id ? (
    <div
      style={{
        display: "flex",
        flexDirection: direction,
      }}
    >
      <Label type="painted">{label}</Label>
      <Input min={0} value={number} type={"number"} onChange={onNumberChange} />
    </div>
  ) : (
    <div
      style={{
        display: "flex",
        flexDirection: direction,
      }}
    >
      <Label
        style={direction === "row" ? { width: "50%" } : undefined}
        type="painted"
      >
        {label}
      </Label>
      <Label
        style={
          direction === "row"
            ? { width: "50%", alignSelf: "center" }
            : undefined
        }
        type="led"
      >
        {number}
      </Label>
    </div>
  );
}
