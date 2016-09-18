import Piece from '../piece';
import Renderer from '../renderer';

export default function FabricRenderer(canvasElement, {zoom = 1, debug = false} = {}) {

  const sceneSize = 1000;

  const canvas = new fabric.StaticCanvas(canvasElement);
  canvas.renderOnAddRemove = false;

  const view = new fabric.Group([], {
    height: sceneSize,
    width: sceneSize,
    originX: 'center',
    originY: 'center',
    clipTo: function(ctx) {
      ctx.rect(-1, -1, sceneSize + 2, sceneSize + 2);
    }
  });

  canvas.add(view);

  const renderer = {
    isFabricRenderer: true,
    id: 'FabricRenderer('+(canvasElement.id || 'canvas')+')',
    view,
    render: () => {
      //console.log(renderer.id+'.render()', view);

      const maxSize = Math.min(
        canvasElement.parentElement.clientWidth,
        canvasElement.parentElement.clientHeight
      );

      canvas.setWidth(maxSize);
      canvas.setHeight(maxSize);

      view.set({
        scaleY: (canvas.height / view.height),
        scaleX: (canvas.width / view.width)
      });

      canvas.zoomToPoint(new fabric.Point(canvas.width/2, canvas.height/2), zoom);

      canvas.renderAll();
    }
  };

  Piece(renderer);

  const prepare = parent => {
    parent.renderers.forEach(child => {

      if (parent.view instanceof fabric.Group) {

        if (!parent.view.contains(child.view))
          parent.view.add(child.view);
      }

      prepare(child);
    });
  };

  const _add = renderer.add;
  renderer.add = (key, piece) => {
    _add(key, piece);

    if (piece.isRenderer) {
      console.log('addRenderer:', renderer.id, renderer.renderers.length, renderer);
      prepare(renderer);
    }

    return renderer;
  };

  return renderer;
};