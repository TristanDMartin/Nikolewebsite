import React from 'react';

const HYPHENATED_WORD = /[A-Za-z]+(?:-[A-Za-z]+)+/g;

export function renderHyphenatedText(text) {
  if (!text) {
    return text;
  }
  const nodes = [];
  let lastIndex = 0;
  for (const match of text.matchAll(HYPHENATED_WORD)) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    nodes.push(
      <span key={match.index} className="hyphenated-word">
        {match[0].replace(/-/g, '\u2011')}
      </span>,
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  if (nodes.length === 0) {
    return text;
  }
  return nodes;
}
