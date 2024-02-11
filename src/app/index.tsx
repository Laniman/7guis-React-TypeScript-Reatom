import React from 'react';
import './reset.css';
import './css'
import { createRoot } from 'react-dom/client';
import { reatomContext } from '@reatom/npm-react'
import { createCtx } from '@reatom/framework'
import {observer} from 'mobx-react'
import MobxDevTools from 'mobx-react-devtools'
import {ThemeProvider} from 'emotion-theming'
import {Counter} from './guis/counter'
import {Flex2} from './basic'
import {TempConvAuto, TempConvManual} from './guis/tempconv'
import {FlightBooker} from './guis/flight'
import {Timer} from './guis/timer'
import {Crud} from './guis/crud'
import {CircleDrawerTraditional} from './guis/circles/drawer-traditional'
import {Cells} from './guis/cells/cells'
import {cx} from './utils'
import './css.css';

const theme = {
  fontSizes: [
    10, 12, 13, 16, 20, 24, 32, 48, 64
  ],
}

const ctx = createCtx()

function IconFileCode(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 384 512" fill="currentColor" height="1em" width="1em" {...props}>
      <path d="M384 121.941V128H256V0h6.059c6.365 0 12.47 2.529 16.971 7.029l97.941 97.941A24.005 24.005 0 0 1 384 121.941zM248 160c-13.2 0-24-10.8-24-24V0H24C10.745 0 0 10.745 0 24v464c0 13.255 10.745 24 24 24h336c13.255 0 24-10.745 24-24V160H248zM123.206 400.505a5.4 5.4 0 0 1-7.633.246l-64.866-60.812a5.4 5.4 0 0 1 0-7.879l64.866-60.812a5.4 5.4 0 0 1 7.633.246l19.579 20.885a5.4 5.4 0 0 1-.372 7.747L101.65 336l40.763 35.874a5.4 5.4 0 0 1 .372 7.747l-19.579 20.884zm51.295 50.479l-27.453-7.97a5.402 5.402 0 0 1-3.681-6.692l61.44-211.626a5.402 5.402 0 0 1 6.692-3.681l27.452 7.97a5.4 5.4 0 0 1 3.68 6.692l-61.44 211.626a5.397 5.397 0 0 1-6.69 3.681zm160.792-111.045l-64.866 60.812a5.4 5.4 0 0 1-7.633-.246l-19.58-20.885a5.4 5.4 0 0 1 .372-7.747L284.35 336l-40.763-35.874a5.4 5.4 0 0 1-.372-7.747l19.58-20.885a5.4 5.4 0 0 1 7.633-.246l64.866 60.812a5.4 5.4 0 0 1-.001 7.879z"></path>
    </svg>
  );
}

@observer
class App extends React.Component<{}> {
  renderGui(title: string, filename: string, comp: React.ReactNode) {
    return (
      <div className="mb-8">
        <Flex2 className={cx('window', 'flex-col', 'inline-flex', 'text-[13px]')}>
          <Flex2 className={cx('titlebar', 'p-1', 'text-center', 'items-center', 'relative', 'select-none', 'text-[13px]')}>
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              {title}
            </div>
            <div className="flex-auto"/>
            <a
              target='_blank'
              href={`https://github.com/Laniman/7guis-React-TypeScript-Reatom/blob/master/src/app/guis/${filename}`}
            >
              <IconFileCode color='#999' className="icon-file-code"/>
            </a>
          </Flex2>
          <div className="p-2">
            {comp}
          </div>
        </Flex2>
      </div>
    )
  }

  render() {
    return (
      <reatomContext.Provider value={ctx}>
      <ThemeProvider theme={theme}>
        <div className={cx('max-w-[40rem]', 'ml-auto', 'mr-auto', 'py-[1.5rem] px-[1.125rem]')}>
          <MobxDevTools position={{bottom: 0, right: 0}}/>
          <h1>7GUIs in React/TypeScript/Reatom</h1>
          <div className="mb-8"/>
          <div className="text-[16px]">
            This is a live version of an implementation
            {' '}(<a href='https://github.com/Laniman/7guis-React-TypeScript-Reatom'>source</a>){' '}
            of
            {' '}<a href='https://eugenkiss.github.io/7guis/'>7GUIs</a>{' '}
            with
            {' '}<a href='https://reactjs.org/'>React</a>,{' '}
            {' '}<a href='https://www.typescriptlang.org'>TypeScript</a> and{' '}
            {' '}<a href='https://www.reatom.dev/'>Reatom</a>.{' '}
          </div>
          <div className="mb-8"/>
          {this.renderGui('Counter', 'counter.tsx', <Counter/>)}
          {this.renderGui('TempConv Manual', 'tempconv.tsx', <TempConvManual/>)}
          {this.renderGui('TempConv Auto', 'tempconv.tsx', <TempConvAuto/>)}
          {this.renderGui('Flight Booker', 'flight.tsx', <FlightBooker/>)}
          {this.renderGui('Timer', 'timer.tsx', <Timer/>)}
          {this.renderGui('CRUD', 'crud.tsx', <Crud/>)}
          {this.renderGui('Circle Drawer Traditional', 'circles/drawer-traditional.tsx', <CircleDrawerTraditional/>)}
          {this.renderGui('Cells', 'cells/cells.tsx', <Cells/>)}
        </div>
      </ThemeProvider>
      </reatomContext.Provider>
    )
  }
}

const root = createRoot(document.getElementById('root'));

root.render(<App/>);
