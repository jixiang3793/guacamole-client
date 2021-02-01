import Guacamole from 'guacamole-common-js';
import { IHostEntity } from './Welcome.interface';

export function connect(params: IHostEntity) {
  const display = document.getElementById('display');

  // Instantiate client, using an HTTP tunnel for communications.
  var guac = new Guacamole.Client(new Guacamole.HTTPTunnel('tunnel',false,params));

  // Add client to display div
  display!.appendChild(guac.getDisplay().getElement());

  // Error handler
  guac.onerror = function (error: any) {
    alert(error);
  };

  // Connect
  guac.connect();

  // Disconnect on close
  window.onunload = function () {
    guac.disconnect();
  };

  // Mouse
  var mouse = new Guacamole.Mouse(guac.getDisplay().getElement());

  mouse.onmousedown = mouse.onmouseup = mouse.onmousemove = function (mouseState: any) {
    guac.sendMouseState(mouseState);
  };

  // Keyboard
  var keyboard = new Guacamole.Keyboard(document);

  keyboard.onkeydown = function (keysym: any) {
    guac.sendKeyEvent(1, keysym);
  };

  keyboard.onkeyup = function (keysym: any) {
    guac.sendKeyEvent(0, keysym);
  };
}
