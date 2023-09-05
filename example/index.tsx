import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Thing } from '../.';
import {Cropper} from "../src";

const App = () => {
    const [src, setSrc] = React.useState("")

    const handleToggleClick = () => {
        if (src === "https://live-production.wcms.abc-cdn.net.au/993fcd282fdce29e6f2f6f633966fb1c?impolicy=wcms_crop_resize&cropH=1688&cropW=3000&xPos=0&yPos=94&width=862&height=485") {
            setSrc("https://png.pngtree.com/thumb_back/fw800/background/20210316/pngtree-vertical-version-of-cherry-blossom-photography-romantic-pink-image_586839.jpg")
            return;
        }

        setSrc("https://live-production.wcms.abc-cdn.net.au/993fcd282fdce29e6f2f6f633966fb1c?impolicy=wcms_crop_resize&cropH=1688&cropW=3000&xPos=0&yPos=94&width=862&height=485")
    }

  return (
    <div style={{ margin: "100px", width: "400px"}}>
        <button onClick={() => handleToggleClick()}>Toggle src</button>
        <Cropper
            src={src}
            position={{ left: 0, top: 0 }}
            onChangeEnd={(position) => console.log(position)}
        />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
