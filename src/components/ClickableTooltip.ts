import L from "leaflet";

export const ClickableTooltip: (new (arg: L.TooltipOptions) => L.Tooltip) = L.Tooltip.extend({
  onAdd: function (map: L.Map) {
    L.Tooltip.prototype.onAdd.call(this, map);

    const el = this.getElement(),
      self = this;

    el.addEventListener("click", function () {
      self.fire("click");
    });
    el.style.pointerEvents = "auto";
  },
});
