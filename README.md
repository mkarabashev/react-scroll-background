## React Scroll Background

This module provides an easy way to transition the background color when you scroll through a specified element within the page. An example can be found [here](https://mkarabashev.github.io/react-scroll-background/)

### Install
```js
$ npm install scroll-background
```

### Run
```js
$ npm install
$ npm test
$ npm run build
```
### Usage
```js

import React from 'react';
import { render } from 'react-dom';
import { AnimatedBg, Transition } from 'scroll-background';

const Example = () => (
  <AnimatedBg>
    <div style={{ height: '900px' }} />
    <Transition height="400px" from="#0D47A1" to="#388E3C" />
    <div style={{ height: '900px' }} />
    <Transition height="400px" from="#388E3C" to="#FFA000" position={0.75}>
      <h1>Content that appears within the transition</h1>
    </Transition>
    <div style={{ height: '900px' }} />
  </AnimatedBg>
)

render(
  <Example />,
  document.getElementById('root')
);

```

### Transition Props/Options

> height - scroll space of the transition; optional, default is 0

> from - starting color

> to - target color

> position - determines the part of the screen the transition element would have to pass through before the transition begins; optional, default is 0.5 or the middle of the screen (min: 0, max: 1)
