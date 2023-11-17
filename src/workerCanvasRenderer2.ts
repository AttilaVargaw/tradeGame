//import { Renderer, DomUtil, DomEvent, Browser, Util, Bounds } from "leaflet";

/*
 * @class Canvas
 * @inherits Renderer
 * @aka L.Canvas
 *
 * Allows vector layers to be displayed with [`<canvas>`](https://developer.mozilla.org/docs/Web/API/Canvas_API).
 * Inherits `Renderer`.
 *
 * Due to [technical limitations](https://caniuse.com/canvas), Canvas is not
 * available in all web browsers, notably IE8, and overlapping geometries might
 * not display properly in some edge cases.
 *
 * @example
 *
 * Use Canvas by default for all paths in the map:
 *
 * ```js
 * let map = L.map('map', {
 * 	renderer: L.canvas()
 * });
 * ```
 *
 * Use a Canvas renderer with extra padding for specific vector geometries:
 *
 * ```js
 * let map = L.map('map');
 * let myRenderer = L.canvas({ padding: 0.5 });
 * let line = L.polyline( coordinates, { renderer: myRenderer } );
 * let circle = L.circle( center, { renderer: myRenderer } );
 * ```
 */

/*export const WorkerCanvasRenderer = Renderer.extend({
  // @section
  // @aka Canvas options
  options: {
    // @option tolerance: Number = 0
    // How much to extend the click tolerance around a path/object on the map.
    tolerance: 0,
  },

  worker: new Worker("./renderer2.js"),

  getEvents: function () {
    const events = Renderer.prototype.getEvents?.call(this);
    events.viewprereset = this._onViewPreReset;
    return events;
  },

  _onViewPreReset: function () {
    // Set a flag so that a viewprereset+moveend+viewreset only updates&redraws once
    this._postponeUpdatePaths = true;
  },

  onAdd: function () {
    Renderer.prototype.onAdd.call(this);

    // Redraw vectors since canvas is cleared upon removal,
    // in case of removing the renderer itself from the map.
    this._draw();
  },

  _initContainer: function () {
    const container = (this._container = document.createElement("canvas"));

    DomEvent.on(container, "mousemove", this._onMouseMove, this);
    DomEvent.on(
      container,
      "click dblclick mousedown mouseup contextmenu",
      this._onClick,
      this
    );
    DomEvent.on(container, "mouseout", this._handleMouseOut, this);
    // @ts-ignore
    container["_leaflet_disable_events"] = true;

    this.worker.postMessage({ args: {container}, type: "setCanvas" }, [
      container,
    ]);
  },

  _destroyContainer: function () {
    Util.cancelAnimFrame(this._redrawRequest);
    delete this._ctx;
    DomUtil.remove(this._container);
    DomEvent.off(this._container);
    delete this._container;
  },

  _updatePaths: function () {
    if (this._postponeUpdatePaths) {
      return;
    }

    let layer;
    this._redrawBounds = null;
    for (const id in this._layers) {
      layer = this._layers[id];
      layer._update();
    }
    this._redraw();
  },

  _update: function () {
    if (this._map._animatingZoom && this._bounds) {
      return;
    }
    // @ts-ignore
    Renderer.prototype._update.call(this);

    const b = this._bounds,
      container = this._container,
      size = b.getSize(),
      m = Browser.retina ? 2 : 1;

    DomUtil.setPosition(container, b.min);

    // set canvas size (also clearing it); use double size on retina
    container.width = m * size.x;
    container.height = m * size.y;
    container.style.width = size.x + "px";
    container.style.height = size.y + "px";

    if (Browser.retina) {
      this._ctx.scale(2, 2);
    }

    // translate so we use the same path coordinates after canvas element moves
    this._ctx.translate(-b.min.x, -b.min.y);

    // Tell paths to redraw themselves
    this.fire("update");
  },

  _reset: function () {
    // @ts-ignore
    Renderer.prototype._reset.call(this);

    if (this._postponeUpdatePaths) {
      this._postponeUpdatePaths = false;
      this._updatePaths();
    }
  },

  _initPath: function (layer: any) {
    this._updateDashArray(layer);
    this._layers[Util.stamp(layer)] = layer;

    const order = (layer._order = {
      layer: layer,
      prev: this._drawLast,
      next: null,
    });
    if (this._drawLast) {
      this._drawLast.next = order;
    }
    this._drawLast = order;
    this._drawFirst = this._drawFirst || this._drawLast;
  },

  _addPath: function (layer: any) {
    this._requestRedraw(layer);
  },

  _removePath: function (layer: any) {
    const order = layer._order;
    const next = order.next;
    const prev = order.prev;

    if (next) {
      next.prev = prev;
    } else {
      this._drawLast = prev;
    }
    if (prev) {
      prev.next = next;
    } else {
      this._drawFirst = next;
    }

    delete layer._order;

    delete this._layers[Util.stamp(layer)];

    this._requestRedraw(layer);
  },

  _updatePath: function (layer: any) {
    // Redraw the union of the layer's old pixel
    // bounds and the new pixel bounds.
    this._extendRedrawBounds(layer);
    layer._project();
    layer._update();
    // The redraw will extend the redraw bounds
    // with the new pixel bounds.
    this._requestRedraw(layer);
  },

  _updateStyle: function (layer: any) {
    this._updateDashArray(layer);
    this._requestRedraw(layer);
  },

  _updateDashArray: function (layer: any) {
    if (typeof layer.options.dashArray === "string") {
      const parts = layer.options.dashArray.split(/[, ]+/),
        dashArray = [];
      let dashValue, i;
      for (i = 0; i < parts.length; i++) {
        dashValue = Number(parts[i]);
        // Ignore dash array containing invalid lengths
        if (isNaN(dashValue)) {
          return;
        }
        dashArray.push(dashValue);
      }
      layer.options._dashArray = dashArray;
    } else {
      layer.options._dashArray = layer.options.dashArray;
    }
  },

  _requestRedraw: function (layer: any) {
    if (!this._map) {
      return;
    }

    this._extendRedrawBounds(layer);
    this._redrawRequest =
      this._redrawRequest || Util.requestAnimFrame(this._redraw, this);
  },

  _extendRedrawBounds: function (layer: any) {
    if (layer._pxBounds) {
      const padding = (layer.options.weight || 0) + 1;
      this._redrawBounds = this._redrawBounds || new Bounds();
      this._redrawBounds.extend(
        layer._pxBounds.min.subtract([padding, padding])
      );
      this._redrawBounds.extend(layer._pxBounds.max.add([padding, padding]));
    }
  },

  _redraw: function () {
    this._redrawRequest = null;

    if (this._redrawBounds) {
      this._redrawBounds.min._floor();
      this._redrawBounds.max._ceil();
    }

    this._clear(); // clear layers in redraw bounds
    this._draw(); // draw layers

    this._redrawBounds = null;
  },

  _clear: function () {
    this.worker.postMessage({ args: {bounds: this._redrawBounds}, type: "_clear" })
  },

  _draw: function () {
  
    this.worker.postMessage({ args: {bounds: this._redrawBounds}, type: "_draw" })

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
      if (!bounds || (layer._pxBounds && layer._pxBounds.intersects(bounds))) {
        layer._updatePath();
      }
    }

    this._drawing = false;

    this._ctx.restore(); // Restore state before clipping.
  },

  _updatePoly: function (layer: any, closed: any) {
    if (!this._drawing) {
      return;
    }

    let i, j, len2, p;
    const parts = layer._parts,
      len = parts.length,
      ctx = this._ctx;

    if (!len) {
      return;
    }

    ctx.beginPath();

    for (i = 0; i < len; i++) {
      for (j = 0, len2 = parts[i].length; j < len2; j++) {
        p = parts[i][j];
        ctx[j ? "lineTo" : "moveTo"](p.x, p.y);
      }
      if (closed) {
        ctx.closePath();
      }
    }

    this._fillStroke(ctx, layer);

    // TODO optimization: 1 fill/stroke for all features with equal style instead of 1 for each feature
  },

  _updateCircle: function (layer: any) {
    if (!this._drawing || layer._empty()) {
      return;
    }

    const p = layer._point,
      ctx = this._ctx,
      r = Math.max(Math.round(layer._radius), 1),
      s = (Math.max(Math.round(layer._radiusY), 1) || r) / r;

    if (s !== 1) {
      ctx.save();
      ctx.scale(1, s);
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y / s, r, 0, Math.PI * 2, false);

    if (s !== 1) {
      ctx.restore();
    }

    this._fillStroke(ctx, layer);
  },

  _fillStroke: function (ctx: any, layer: any) {
    const options = layer.options;

    if (options.fill) {
      ctx.globalAlpha = options.fillOpacity;
      ctx.fillStyle = options.fillColor || options.color;
      ctx.fill(options.fillRule || "evenodd");
    }

    if (options.stroke && options.weight !== 0) {
      if (ctx.setLineDash) {
        ctx.setLineDash((layer.options && layer.options._dashArray) || []);
      }
      ctx.globalAlpha = options.opacity;
      ctx.lineWidth = options.weight;
      ctx.strokeStyle = options.color;
      ctx.lineCap = options.lineCap;
      ctx.lineJoin = options.lineJoin;
      ctx.stroke();
    }
  },

  // Canvas obviously doesn't have mouse events for individual drawn objects,
  // so we emulate that by calculating what's under the mouse on mousemove/click manually

  _onClick: function (e: any) {
    const point = this._map.mouseEventToLayerPoint(e);
    let layer, clickedLayer;

    for (let order = this._drawFirst; order; order = order.next) {
      layer = order.layer;
      if (layer.options.interactive && layer._containsPoint(point)) {
        if (
          !(e.type === "click" || e.type === "preclick") ||
          !this._map._draggableMoved(layer)
        ) {
          clickedLayer = layer;
        }
      }
    }
    this._fireEvent(clickedLayer ? [clickedLayer] : false, e);
  },

  _onMouseMove: function (e: any) {
    if (!this._map || this._map.dragging.moving() || this._map._animatingZoom) {
      return;
    }

    const point = this._map.mouseEventToLayerPoint(e);
    this._handleMouseHover(e, point);
  },

  _handleMouseOut: function (e: any) {
    const layer = this._hoveredLayer;
    if (layer) {
      // if we're leaving the layer, fire mouseout
      DomUtil.removeClass(this._container, "leaflet-interactive");
      this._fireEvent([layer], e, "mouseout");
      this._hoveredLayer = null;
      this._mouseHoverThrottled = false;
    }
  },

  _handleMouseHover: function (e: any, point: any) {
    if (this._mouseHoverThrottled) {
      return;
    }

    let layer, candidateHoveredLayer;

    for (let order = this._drawFirst; order; order = order.next) {
      layer = order.layer;
      if (layer.options.interactive && layer._containsPoint(point)) {
        candidateHoveredLayer = layer;
      }
    }

    if (candidateHoveredLayer !== this._hoveredLayer) {
      this._handleMouseOut(e);

      if (candidateHoveredLayer) {
        DomUtil.addClass(this._container, "leaflet-interactive"); // change cursor
        this._fireEvent([candidateHoveredLayer], e, "mouseover");
        this._hoveredLayer = candidateHoveredLayer;
      }
    }

    this._fireEvent(this._hoveredLayer ? [this._hoveredLayer] : false, e);

    this._mouseHoverThrottled = true;
    setTimeout(
      Util.bind(() => {
        this._mouseHoverThrottled = false;
      }, this),
      32
    );
  },

  _fireEvent: function (layers: any, e: any, type: any) {
    this._map._fireDOMEvent(e, type || e.type, layers);
  },

  _bringToFront: function (layer: any) {
    const order = layer._order;

    if (!order) {
      return;
    }

    const next = order.next;
    const prev = order.prev;

    if (next) {
      next.prev = prev;
    } else {
      // Already last
      return;
    }
    if (prev) {
      prev.next = next;
    } else if (next) {
      // Update first entry unless this is the
      // single entry
      this._drawFirst = next;
    }

    order.prev = this._drawLast;
    this._drawLast.next = order;

    order.next = null;
    this._drawLast = order;

    this._requestRedraw(layer);
  },

  _bringToBack: function (layer: any) {
    const order = layer._order;

    if (!order) {
      return;
    }

    const next = order.next;
    const prev = order.prev;

    if (prev) {
      prev.next = next;
    } else {
      // Already first
      return;
    }
    if (next) {
      next.prev = prev;
    } else if (prev) {
      // Update last entry unless this is the
      // single entry
      this._drawLast = prev;
    }

    order.prev = null;

    order.next = this._drawFirst;
    this._drawFirst.prev = order;
    this._drawFirst = order;

    this._requestRedraw(layer);
  },
});

// @factory L.canvas(options?: Renderer options)
// Creates a Canvas renderer with the given options.
export function workerCanvasRenderer(options: any) {
  // @ts-ignore
  return Browser.canvas ? new WorkerCanvasRenderer(options) : null;
}
*/