import { storiesOf } from '@storybook/riot';
import { linkTo } from '@storybook/addon-links';
import ButtonRaw from 'raw-loader!./Button.tag';

storiesOf('Addon|Links', module).add('Go to welcome', () => ({
  tags:[{boundAs: 'my-button', content: ButtonRaw}],
  scenario:
    '<my-button rounded={true} handleClick={linkTo(\'Welcome\')} >This buttons links to Welcome</my-button>'
}));
