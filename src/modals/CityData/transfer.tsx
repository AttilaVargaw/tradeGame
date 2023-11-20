import { Button } from "@Components/button";
import { Label } from "@Components/label";

export function Transfer() {
  return (
    <div style={{ display: "flex", flexDirection: "row"}}>
      <Button style={{ aspectRatio: 1, alignSelf: "center" }} $size="small">
        &lt;
      </Button>
      <Label style={{ width: "100%" }} type="led">
        {1}
      </Label>
      <Button $size="small" style={{ aspectRatio: 1, alignSelf: "center" }}>
        &gt;
      </Button>
    </div>
  );
}
