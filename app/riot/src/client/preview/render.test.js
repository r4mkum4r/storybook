import renderMain from './render'

describe('render a riot element', () => {

  it('should not work with nothing', () => {
    renderMain({story: () => null, selectedKind: 'test with null', selectedStory: 'empty story',
                showMain: () => {}, showError: () => {}})
  })

  it('can work with some text', () => {
    renderMain({story: () => '<div><p>some test</p></div>', selectedKind: 'test with null', selectedStory: 'empty story',
      showMain: () => {}, showError: () => {}})
  })

})