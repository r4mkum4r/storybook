import { storiesOf, addParameters } from '@storybook/riot';
import riot from 'riot'

const globalParameter = 'globalParameter';
const chapterParameter = 'chapterParameter';
const storyParameter = 'storyParameter';

riot.tag2('parameters', '<div>Parameters are {JSON.stringify (this.opts)}</div>', '', '', function(opts) {});

addParameters({ globalParameter });

storiesOf('Core|Parameters', module)
  .addParameters({ chapterParameter })
  .add(
    'passed to story',
    ({ parameters: { fileName, ...parameters } }) => riot.mount('root', 'parameters', {...parameters, storyParameter}));
