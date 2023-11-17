import { Renderer } from "leaflet";

interface WorkerCanvasRenderer extends Renderer {}

export declare namespace L {
  function workerCanvasRenderer(options: any): WorkerCanvasRenderer;
  function WorkerCanvasRenderer(): new (options: any) => WorkerCanvasRenderer;
}
