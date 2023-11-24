import { Renderer } from "leaflet";

interface WorkerCanvasRenderer extends Renderer {}

export declare namespace L {
  function workerCanvasRenderer(options: unknown): WorkerCanvasRenderer;
  function WorkerCanvasRenderer(): new (
    options: unknown
  ) => WorkerCanvasRenderer;
}
