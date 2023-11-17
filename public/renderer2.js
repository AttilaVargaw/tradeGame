self.onmessage = (event) => {
  const {
    data: { type, args },
  } = event;
  switch (type) {
    case "setCanvas":
      self.container = args.container;
      self.ctx = args.container.getContext("2d");
      break;

    case "_clear":
      if (args.bounds) {
        const size = args.bounds.getSize();
        self.ctx.clearRect(
          args.bounds.min.x,
          args.bounds.min.y,
          args.bounds.x,
          args.bounds.y
        );
      } else {
        self.ctx.save();
        self.ctx.setTransform(1, 0, 0, 1, 0, 0);
        self.ctx.clearRect(0, 0, this.container.width, this.container.height);
        self.ctx.restore();
      }
      break;

    case "_draw":
      this._ctx.save();
      if (bounds) {
        const size = bounds.getSize();
        this._ctx.beginPath();
        this._ctx.rect(bounds.min.x, bounds.min.y, size.x, size.y);
        this._ctx.clip();
      }

      this._drawing = true;

      for (let order = this._drawFirst; order; order = order.next) {
        layer = order.layer;
        if (
          !bounds ||
          (layer._pxBounds && layer._pxBounds.intersects(bounds))
        ) {
          layer._updatePath();
        }
      }

      this._drawing = false;

      this._ctx.restore(); // Restore state before clipping.
      break;

    default:
      console.log("not supported command", type);
  }
};
