import Guacamole from 'guacamole-common-js';
import { IHostEntity } from './Welcome.interface';

export function connect(host: IHostEntity) {
  const display = document.getElementById('display');
  const params = {...host};
  delete params.thumbnail;
  // Instantiate client, using an HTTP tunnel for communications.
  var guac = new Guacamole.Client(new Guacamole.HTTPTunnel('tunnel',false,params));

  // Add client to display div
  display?.childNodes.forEach(node => display?.removeChild(node));
  display!.appendChild(guac.getDisplay().getElement());

  // Error handler
  guac.onerror = function (error: any) {
    console.error("Guacamole client error is ...",error);
    guac.disconnect();
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

  guac.onclipboard = function (stream: any, mimetype: string) {
    console.log("onclipboard ...",stream, mimetype);
    stream.onblob = function (data: any) {
      const stringdata = atob(data);
      console.log("data blob ...",stringdata);
      navigator.clipboard.writeText(stringdata).catch(() => {
        console.error("clipboard write error ...");
      })
    }
  }
  
  return guac;
}
