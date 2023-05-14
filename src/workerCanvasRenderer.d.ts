import { Renderer } from "leaflet";

interface WorkerCanvasRenderer extends Renderer {}

export declare namespace L {
  function workerCanvasRenderer(): WorkerCanvasRenderer;
  function WorkerCanvasRenderer(): new (options: any) => WorkerCanvasRenderer;
}
