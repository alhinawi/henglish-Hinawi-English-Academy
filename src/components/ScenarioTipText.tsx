import React from 'react';

// Keep original wording while isolating English examples inside RTL guidance.
export function ScenarioTipText({text}:{text:string}) {
 if(!/[\u0600-\u06ff]/.test(text)) return <span data-scenario-tip-text>{text}</span>;
 return <span data-scenario-tip-text>{text.split(/("[^"]+"|[A-Za-z][A-Za-z0-9\s.,!?'’():-]*)/g).map((part,index)=>/[A-Za-z]/.test(part)?<bdi key={index} lang="en" dir="ltr" className="mx-1 inline-block max-w-full rounded border border-amber-200/20 bg-amber-200/5 px-1 align-top text-left [overflow-wrap:anywhere]">{part}</bdi>:<React.Fragment key={index}>{part}</React.Fragment>)}</span>;
}
