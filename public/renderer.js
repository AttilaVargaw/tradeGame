self._fillStroke = function (options) {
  if (options.fill) {
    self.ctx.globalAlpha = options.fillOpacity;
    self.ctx.fillStyle = options.fillColor || options.color;
    self.ctx.fill(options.fillRule || "evenodd");
  }

  if (options.stroke && options.weight !== 0) {
    if (self.ctx.setLineDash) {
      self.ctx.setLineDash((options && options._dashArray) || []);
    }
    self.ctx.globalAlpha = options.opacity;
    self.ctx.lineWidth = options.weight;
    self.ctx.strokeStyle = options.color;
    self.ctx.lineCap = options.lineCap;
    self.ctx.lineJoin = options.lineJoin;
    self.ctx.stroke();
  }
};

self.onmessage = (event) => {
  const { data } = event;
  data.commands.forEach(({ args, type }, i, arr) => {
    switch (type) {
      case "setCanvas":
        self.container = args[0];
        self.ctx = args[0].getContext("2d");
        break;

      case "width":
      case "height":
        self.container[type] = args[0];
        break;
      case "scale":
      case "translate":
      case "clip":
      case "rect":
      case "beginPath":
      case "save":
      case "restore":
      case "clearRect":
      case "stroke":
      case "arc":
      case "fill":
      case "setTransform":
      case "lineTo":
      case "moveTo":
      case "setLineDash":
        self.ctx[type](...(args ?? []));
        break;

      case "globalAlpha":
      case "lineWidth":
      case "strokeStyle":
      case "lineCap":
      case "lineJoin":
      case "fillStyle":
        self.ctx[type] = args[0];
        break;

      case "_udpateCircle":
        var p = args[0],
          r = Math.max(Math.round(args[1]), 1),
          s = (Math.max(Math.round(args[2]), 1) || r) / r;

        if (s !== 1) {
          self.ctx.save();
          self.ctx.scale(1, s);
        }

        self.ctx.beginPath();
        self.ctx.arc(p.x, p.y / s, r, 0, Math.PI * 2, false);

        if (s !== 1) {
          self.ctx.restore();
        }

        this._fillStroke(args[3]);
        break;

      default:
        console.log("not supported command", type);
    }
    arr.length - 1 === i && self.postMessage("done");
  });
};
