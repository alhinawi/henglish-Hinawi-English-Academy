import React from 'react';

// Keep English grammar formulas and their parentheses together in Arabic notes.
export function GrammarFocusText({text}:{text:string}) {
 const runs=text.split(/(\([^()\u0600-\u06ff]*[A-Za-z][^()\u0600-\u06ff]*\)|[A-Za-z][A-Za-z0-9\s+.,:;!?"'()-]*)/g);
 return <>{runs.map((run,index)=>/[A-Za-z]/.test(run)?<bdi key={index} lang="en" dir="ltr" className="inline-block max-w-full align-top text-left [overflow-wrap:anywhere]">{run}</bdi>:<React.Fragment key={index}>{run}</React.Fragment>)}</>;
}
