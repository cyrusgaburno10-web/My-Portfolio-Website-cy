import { Fragment, type ReactNode } from 'react';
import { CopyableContact } from '@/components/CopyableContact';

const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/g;
const PHONE_RE = /\+?\d[\d\s().-]{7,}\d/g;

interface Match {
  index: number;
  length: number;
  value: string;
}

function findMatches(text: string): Match[] {
  const matches: Match[] = [];
  for (const m of text.matchAll(EMAIL_RE)) {
    matches.push({ index: m.index ?? 0, length: m[0].length, value: m[0] });
  }
  for (const m of text.matchAll(PHONE_RE)) {
    matches.push({ index: m.index ?? 0, length: m[0].length, value: m[0] });
  }
  return matches.sort((a, b) => a.index - b.index);
}

function linkifyString(text: string, keyPrefix: string): ReactNode[] {
  const matches = findMatches(text);
  if (matches.length === 0) return [text];

  const nodes: ReactNode[] = [];
  let cursor = 0;
  matches.forEach((m, i) => {
    if (m.index < cursor) return;
    if (m.index > cursor) nodes.push(<Fragment key={`${keyPrefix}-t-${i}`}>{text.slice(cursor, m.index)}</Fragment>);
    nodes.push(<CopyableContact key={`${keyPrefix}-c-${i}`} value={m.value} />);
    cursor = m.index + m.length;
  });
  if (cursor < text.length) {
    nodes.push(<Fragment key={`${keyPrefix}-tail`}>{text.slice(cursor)}</Fragment>);
  }
  return nodes;
}

export function linkifyContacts(children: ReactNode, keyPrefix: string): ReactNode {
  if (typeof children === 'string') {
    return linkifyString(children, keyPrefix);
  }
  if (Array.isArray(children)) {
    return children.map((child, i) => (
      <Fragment key={`${keyPrefix}-${i}`}>{linkifyContacts(child, `${keyPrefix}-${i}`)}</Fragment>
    ));
  }
  return children;
}
