import { CertificateDefinition } from '../data/certificatesData';
export interface CertificateScore {score:number;total:number;date:string;}
export const certificateExamKey=(id:string)=>`certificate-final:${id}`;
export function certificateEligibility(def:CertificateDefinition,completed:string[],scores:Record<string,CertificateScore>,registered:boolean){
 const remaining=def.requiredLessonIds.filter(id=>!completed.includes(id));
 const exam=scores[certificateExamKey(def.id)];
 const percent=exam&&Number.isFinite(exam.score)&&Number.isFinite(exam.total)&&exam.total>=5&&exam.score>=0&&exam.score<=exam.total?Math.floor(exam.score/exam.total*100):null;
 const examPassed=percent!==null&&percent>=Math.max(70,def.minQuizAverage);
 return {eligible:registered&&def.requiredLessonIds.length>0&&remaining.length===0&&examPassed,remaining,percent,examPassed,passMark:Math.max(70,def.minQuizAverage)};
}
