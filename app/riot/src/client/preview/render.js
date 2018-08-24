import { document } from 'global';
import { stripIndents } from 'common-tags';
import { unregister, mount } from 'riot';
import compiler from 'riot-compiler';

const rootElement = document.getElementById('root');

function guessRootName(stringified) {
  return stringified.trim().match(/^<[^ >]+\/>$/) ? stringified.trim().replace(/[<>/]/g, '') :
    stringified.substring(stringified.indexOf('<') + 1,
      Math.min(stringified.indexOf(' ', stringified.indexOf('<') + 1), stringified.indexOf('>')));
}

function renderStringified({ tags, scenario = `<${(tags[0]||[]).boundAs || guessRootName(tags[0]||'')}/>` }) {
  unregister('root')
  unregister('div')
  unregister('p')
  unregister('span')
  const toMount = tags.map(({ boundAs }) => `_riot.mount('${boundAs}', opts)`).join(';');
  tags.forEach(oneTag => oneTag.boundAs ? unregister(oneTag.boundAs) : unregister(guessRootName(oneTag)))
  tags.forEach(oneTag => {
    const { boundAs = guessRootName(oneTag), content } = oneTag || {}
    const sourceCode = (content||oneTag)
      .replace(`</${boundAs}>`, `<script>${toMount}</script></${boundAs}>`)
      .replace("var riot = require('riot')", '')
      .trim();
    eval(`_${compiler.compile(sourceCode, {})}`); // eslint-disable-line no-eval
  });
  const rootName =guessRootName(scenario)
  const sourceCode = `<root>${scenario.replace(
    `</${rootName}>`,
    `<script>${toMount}</script></${rootName}>`
  )}</root>`;
  eval(`_${compiler.compile(sourceCode, {})}`); // eslint-disable-line no-eval
  mount('*');
}

function renderRaw(sourceCode) {
  unregister('root')
  eval(`_${compiler.compile(
    sourceCode.replace("var riot = require('riot')", '').trim(), {})}`);// eslint-disable-line no-eval
  mount('root', /riot\.tag2\s*\(\s*'([^']+)'/.exec(sourceCode)[1], {});
}

function renderCompiledObject(component) {
  rootElement.appendChild(
    (!component.length ? story() : component)[0].__.root); // eslint-disable-line no-underscore-dangle
}

export default function renderMain({ story, selectedKind, selectedStory, showMain, showError }) {
  showMain();
  rootElement.innerHTML = '<root></root>';
  const component = story();
  const { tags } = component || {};
  if (typeof component === 'string'){
    renderRaw(component);
  } else if (Array.isArray(tags)) {
    renderStringified(component);
  } else if (typeof component === 'object') {
    renderCompiledObject(component)
  } else {
    showError({
      title: `Expecting a riot snippet or a riot component from the story: "${selectedStory}" of "${selectedKind}".`,
      description: stripIndents`
        Did you forget to return the component snippet from the story?
        Use "() => <your snippet or node>" or when defining the story.
      `,
    });
  }
}
