import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Thing } from '../.';
import {Cropper} from "../src";

const App = () => {
  return (
    <div style={{ margin: "100px", width: "400px"}}>
        <Cropper
            src={"https://live-production.wcms.abc-cdn.net.au/993fcd282fdce29e6f2f6f633966fb1c?impolicy=wcms_crop_resize&cropH=1688&cropW=3000&xPos=0&yPos=94&width=862&height=485"}
            position={{ left: 0, top: 0 }}
            onChangeEnd={(position) => console.log(position)}
        />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
