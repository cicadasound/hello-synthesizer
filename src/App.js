import './styles.css';
import './fonts/InputMono-Light.ttf';
import './fonts/InputMono-Regular.ttf';
import './fonts/InputMono-Medium.ttf';

import {Synth} from './components/Synth';
import {useScreenSize} from './hooks/use-screen-size';

export default function App() {
  const {width} = useScreenSize();

  const bannerContent = width < 960 && (
    <div className="browser-warning">
      HelloSynth works best on a desktop computer in Google Chrome.
    </div>
  );

  return (
    <div className="App">
      {bannerContent}
      <Synth />
      <div className="footer">
        HelloSynth is free and open source on{' '}
        <a href="https://github.com/cicadasound/hello-synthesizer">GitHub</a>
      </div>
    </div>
  );
}
