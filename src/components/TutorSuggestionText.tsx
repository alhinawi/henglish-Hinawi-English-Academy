import React from 'react';

export function TutorSuggestionText({text}:{text:string}) {
 if(!/[\u0600-\u06ff]/.test(text)) return <span>{text}</span>;
 return <span>{text.split(/([A-Za-z][A-Za-z0-9 ]*[A-Za-z0-9]|[A-Za-z])/g).map((part,index)=>/[A-Za-z]/.test(part)?<bdi key={index} lang="en" dir="ltr">{part}</bdi>:<React.Fragment key={index}>{part}</React.Fragment>)}</span>;
}
