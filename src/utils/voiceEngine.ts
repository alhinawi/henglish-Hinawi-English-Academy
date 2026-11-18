// ==============================================================================
// Henglish Academy (HENGLISH) - MULTI-TIER VOICE SYNTHESIS & SEQUENTIAL AUDIO QUEUE
// Preserves beloved original female voice + upgraded natural male voice
// Supports Server-Side TTS (ElevenLabs, Google, Kokoro) with client SpeechSynthesis fallback
// Features Event-Driven Queue Playback (ended events, NO setTimeout gaps)
// ==============================================================================

// Ready-made English lesson audio is played synchronously from the user tap.
// Browser voices are not required. Extend only with verified local recordings.
export const STATIC_ENGLISH_AUDIO: Record<string, string> = {
  "What is your name?": "/audio/english/conversation-01-line-1.mp3",
  "My name is Salma. Nice to meet you.": "/audio/english/conversation-01-line-2.mp3",
  "Nice to meet you too. Are you a student?": "/audio/english/conversation-01-line-3.mp3",
  "Yes, I study English.": "/audio/english/conversation-01-line-4.mp3",
  "Who is this?": "/audio/english/conversation-02-line-1.mp3",
  "This is my friend Omar.": "/audio/english/conversation-02-line-2.mp3",
  "Hello, Omar. Where are you from?": "/audio/english/conversation-02-line-3.mp3",
  "I am from Cairo.": "/audio/english/conversation-02-line-4.mp3",
  "Can you spell your surname?": "/audio/english/conversation-03-line-1.mp3",
  "Yes. It is H-A-S-S-A-N.": "/audio/english/conversation-03-line-2.mp3",
  "Thank you. Please write it here.": "/audio/english/conversation-03-line-3.mp3",
  "Of course.": "/audio/english/conversation-03-line-4.mp3",
  "Please turn to page fourteen.": "/audio/english/conversation-04-line-1.mp3",
  "Could you say that again, please?": "/audio/english/conversation-04-line-2.mp3",
  "Page fourteen. One four.": "/audio/english/conversation-04-line-3.mp3",
  "Thank you. I understand now.": "/audio/english/conversation-04-line-4.mp3",
  "What time do you get up?": "/audio/english/conversation-05-line-1.mp3",
  "I get up at seven every day.": "/audio/english/conversation-05-line-2.mp3",
  "Do you have breakfast at home?": "/audio/english/conversation-05-line-3.mp3",
  "Yes, I usually have eggs.": "/audio/english/conversation-05-line-4.mp3",
  "What do you like reading?": "/audio/english/conversation-06-line-1.mp3",
  "I like reading short stories.": "/audio/english/conversation-06-line-2.mp3",
  "Do you read every evening?": "/audio/english/conversation-06-line-3.mp3",
  "Yes, before I go to bed.": "/audio/english/conversation-06-line-4.mp3",
  "Are you free this afternoon?": "/audio/english/conversation-07-line-1.mp3",
  "Yes. Shall we study together?": "/audio/english/conversation-07-line-2.mp3",
  "Good idea. At the library?": "/audio/english/conversation-07-line-3.mp3",
  "Yes, see you there at three.": "/audio/english/conversation-07-line-4.mp3",
  "What do you do in your free time?": "/audio/english/conversation-08-line-1.mp3",
  "I write stories in my notebook.": "/audio/english/conversation-08-line-2.mp3",
  "That sounds interesting. How often?": "/audio/english/conversation-08-line-3.mp3",
  "Every weekend.": "/audio/english/conversation-08-line-4.mp3",
  "May I see your passport, please?": "/audio/english/conversation-09-line-1.mp3",
  "Here you are. Is this the right queue?": "/audio/english/conversation-09-line-2.mp3",
  "Yes. Where are you flying today?": "/audio/english/conversation-09-line-3.mp3",
  "I am flying to London.": "/audio/english/conversation-09-line-4.mp3",
  "Excuse me, where is gate twelve?": "/audio/english/conversation-10-line-1.mp3",
  "Go straight ahead and turn left.": "/audio/english/conversation-10-line-2.mp3",
  "Is it near the coffee shop?": "/audio/english/conversation-10-line-3.mp3",
  "Yes, just past it.": "/audio/english/conversation-10-line-4.mp3",
  "Shall we meet in the city centre?": "/audio/english/conversation-11-line-1.mp3",
  "Could we meet at the station instead?": "/audio/english/conversation-11-line-2.mp3",
  "Sure. Would five o'clock suit you?": "/audio/english/conversation-11-line-3.mp3",
  "Yes, that works for me.": "/audio/english/conversation-11-line-4.mp3",
  "How much are these tomatoes?": "/audio/english/conversation-12-line-1.mp3",
  "They are twenty pounds a kilo.": "/audio/english/conversation-12-line-2.mp3",
  "I would like half a kilo, please.": "/audio/english/conversation-12-line-3.mp3",
  "Certainly. Anything else?": "/audio/english/conversation-12-line-4.mp3",
  "How long have you had this cough?": "/audio/english/conversation-13-line-1.mp3",
  "I have had it since Monday.": "/audio/english/conversation-13-line-2.mp3",
  "Do you have any other symptoms?": "/audio/english/conversation-13-line-3.mp3",
  "I also have a sore throat.": "/audio/english/conversation-13-line-4.mp3",
  "How was your weekend?": "/audio/english/conversation-14-line-1.mp3",
  "I visited a museum with my sister.": "/audio/english/conversation-14-line-2.mp3",
  "What did you enjoy most?": "/audio/english/conversation-14-line-3.mp3",
  "The old maps were amazing.": "/audio/english/conversation-14-line-4.mp3",
  "Have you finished your revision yet?": "/audio/english/conversation-15-line-1.mp3",
  "Not yet, but I have reviewed two chapters.": "/audio/english/conversation-15-line-2.mp3",
  "Would you like to revise together?": "/audio/english/conversation-15-line-3.mp3",
  "Yes, that would help.": "/audio/english/conversation-15-line-4.mp3",
  "What are you going to do after graduation?": "/audio/english/conversation-16-line-1.mp3",
  "I am going to apply for a teaching job.": "/audio/english/conversation-16-line-2.mp3",
  "That sounds exciting. Where?": "/audio/english/conversation-16-line-3.mp3",
  "At a local language school.": "/audio/english/conversation-16-line-4.mp3",
  "I started learning Italian last month.": "/audio/english/conversation-17-line-1.mp3",
  "Really? What made you choose Italian?": "/audio/english/conversation-17-line-2.mp3",
  "I want to visit my cousins in Rome.": "/audio/english/conversation-17-line-3.mp3",
  "That sounds like a good reason.": "/audio/english/conversation-17-line-4.mp3",
  "I find it hard to study after work.": "/audio/english/conversation-18-line-1.mp3",
  "Why don't you try a short session before work?": "/audio/english/conversation-18-line-2.mp3",
  "That might work. How long should I study?": "/audio/english/conversation-18-line-3.mp3",
  "Start with fifteen minutes.": "/audio/english/conversation-18-line-4.mp3",
  "You missed our meeting yesterday.": "/audio/english/conversation-19-line-1.mp3",
  "I am sorry. I should have let you know.": "/audio/english/conversation-19-line-2.mp3",
  "Thanks for saying that. Can we reschedule?": "/audio/english/conversation-19-line-3.mp3",
  "Yes. Would tomorrow afternoon work?": "/audio/english/conversation-19-line-4.mp3",
  "Why would you like to work here?": "/audio/english/conversation-20-line-1.mp3",
  "Your training programme matches my career goals.": "/audio/english/conversation-20-line-2.mp3",
  "Could you give us an example?": "/audio/english/conversation-20-line-3.mp3",
  "I want to develop my classroom skills.": "/audio/english/conversation-20-line-4.mp3",
  "How is the website coming along?": "/audio/english/conversation-21-line-1.mp3",
  "We have finished the design, but testing is still in progress.": "/audio/english/conversation-21-line-2.mp3",
  "What do you need from us?": "/audio/english/conversation-21-line-3.mp3",
  "Feedback on the mobile layout, please.": "/audio/english/conversation-21-line-4.mp3",
  "Could you take care of the slides?": "/audio/english/conversation-22-line-1.mp3",
  "Yes, as long as you send me the figures today.": "/audio/english/conversation-22-line-2.mp3",
  "That is fine. I will send them by noon.": "/audio/english/conversation-22-line-3.mp3",
  "Great. I will start after lunch.": "/audio/english/conversation-22-line-4.mp3",
  "Will the report be ready by Friday?": "/audio/english/conversation-23-line-1.mp3",
  "Yes. We will have completed it by Thursday evening.": "/audio/english/conversation-23-line-2.mp3",
  "Will there be time for a final check?": "/audio/english/conversation-23-line-3.mp3",
  "Yes, we have allowed an extra day.": "/audio/english/conversation-23-line-4.mp3",
  "What happens when you open the file?": "/audio/english/conversation-24-line-1.mp3",
  "An error message appears, and the screen goes blank.": "/audio/english/conversation-24-line-2.mp3",
  "Have you tried restarting the application?": "/audio/english/conversation-24-line-3.mp3",
  "Yes, but the problem is still there.": "/audio/english/conversation-24-line-4.mp3",
  "We should cancel all face-to-face meetings.": "/audio/english/conversation-25-line-1.mp3",
  "I see your point, but some discussions work better in person.": "/audio/english/conversation-25-line-2.mp3",
  "Which discussions do you have in mind?": "/audio/english/conversation-25-line-3.mp3",
  "Sensitive feedback and team planning.": "/audio/english/conversation-25-line-4.mp3",
  "The only solution is to hire more staff.": "/audio/english/conversation-26-line-1.mp3",
  "Have we considered improving the booking system first?": "/audio/english/conversation-26-line-2.mp3",
  "How would that help?": "/audio/english/conversation-26-line-3.mp3",
  "It could reduce the time spent on routine tasks.": "/audio/english/conversation-26-line-4.mp3",
  "Should we move the course online?": "/audio/english/conversation-27-line-1.mp3",
  "On the one hand, it is flexible; on the other hand, some learners need classroom support.": "/audio/english/conversation-27-line-2.mp3",
  "Could we offer both formats?": "/audio/english/conversation-27-line-3.mp3",
  "Yes, a mixed approach might work.": "/audio/english/conversation-27-line-4.mp3",
  "We need the whole budget for advertising.": "/audio/english/conversation-28-line-1.mp3",
  "What if we split it between advertising and training?": "/audio/english/conversation-28-line-2.mp3",
  "I could agree to that if we review the results next month.": "/audio/english/conversation-28-line-3.mp3",
  "That seems fair.": "/audio/english/conversation-28-line-4.mp3",
  "What will your presentation cover?": "/audio/english/conversation-29-line-1.mp3",
  "I will outline the problem, compare two options, and recommend a solution.": "/audio/english/conversation-29-line-2.mp3",
  "How will you involve the audience?": "/audio/english/conversation-29-line-3.mp3",
  "I will begin with a short question.": "/audio/english/conversation-29-line-4.mp3",
  "The new design is more accessible.": "/audio/english/conversation-30-line-1.mp3",
  "Could you explain what you mean by accessible in this context?": "/audio/english/conversation-30-line-2.mp3",
  "The text is easier to read, and the buttons work with a keyboard.": "/audio/english/conversation-30-line-3.mp3",
  "Thank you. That makes it clearer.": "/audio/english/conversation-30-line-4.mp3",
  "Tell us about a difficult project.": "/audio/english/conversation-31-line-1.mp3",
  "Although we missed the first deadline, we used the feedback to improve the final result.": "/audio/english/conversation-31-line-2.mp3",
  "What did you learn from it?": "/audio/english/conversation-31-line-3.mp3",
  "To test our assumptions earlier.": "/audio/english/conversation-31-line-4.mp3",
  "How would you sum up the discussion?": "/audio/english/conversation-32-line-1.mp3",
  "We agree on the goal, but we still need to compare the costs before deciding.": "/audio/english/conversation-32-line-2.mp3",
  "What is the next step?": "/audio/english/conversation-32-line-3.mp3",
  "Let us gather the figures and meet again on Monday.": "/audio/english/conversation-32-line-4.mp3",
  "My name is Salma. I am a student. My English class is on Monday. There are eight students in my class. I bring a blue notebook to every lesson.": "/audio/english/reading-literacy-1.mp3",
  "Adam is at a small cafe. He wants tea and a cheese sandwich. His friend wants water. They sit near the window. Adam pays before they leave.": "/audio/english/reading-literacy-2.mp3",
  "Mona goes to the market with a bag. She buys tomatoes, apples and bread. She does not buy milk because she has milk at home. She walks home with her brother.": "/audio/english/reading-literacy-3.mp3",
  "This is my desk. A notebook is next to my computer. My phone is in my bag. I study here after lunch. At five, I close the computer and go for a walk.": "/audio/english/reading-literacy-4.mp3",
  "Nour likes the library. It opens at nine. She reads a short story there. She cannot eat inside, so she eats her lunch in the garden. Then she chooses another book.": "/audio/english/reading-literacy-5.mp3",
  "On Saturday, Ali and his sister walk to a park. They cross a wooden bridge. Ali takes a photo of a tree. His sister sits on a bench. They return home before dinner.": "/audio/english/reading-literacy-6.mp3",
  "Lina arrived at the airport early, but her flight was delayed. An announcement said the plane would leave two hours later. She called her cousin, who was waiting at the destination. Lina bought a book and found a seat near the gate. She checked the screen regularly to avoid missing the new boarding time.": "/audio/english/reading-literacy-7.mp3",
  "When Sam joined the team, he did not know where to find the shared files. Maya offered to help. She showed him the folders and wrote down the steps. The next day, Sam found a file without asking anyone. He thanked Maya and offered to help the next new team member.": "/audio/english/reading-literacy-8.mp3",
  "Hala used to study with her phone beside her notebook. She often stopped to read messages. Last week, she put her phone in another room. She still took short breaks, but she finished her homework earlier. She decided to keep this routine for another week before judging the result.": "/audio/english/reading-literacy-9.mp3",
  "Omar borrowed a book and promised to return it on Thursday. On Wednesday, he could not find it. He searched his bedroom, then remembered reading on the bus. He called the bus office. Luckily, a driver had found the book. Omar collected it the next morning and kept his promise.": "/audio/english/reading-literacy-10.mp3",
  "Sara wanted the early train, but all its seats were booked. She chose an afternoon train instead. This gave her time to have breakfast at home. She saved the tickets on her phone and printed a copy, because her battery sometimes ran out during long journeys.": "/audio/english/reading-literacy-11.mp3",
  "Four friends started a writing club. Each Friday, they wrote a story and read it aloud. At first, they corrected every mistake. Soon nobody wanted to share unfinished work. They changed the rule: first discuss the story, then suggest one improvement. More people began to bring drafts.": "/audio/english/reading-literacy-12.mp3",
  "The office manager wanted a quiet area for concentrated work. Some employees welcomed the idea, while others worried about losing easy access to colleagues. Rather than change the whole office, the manager tested one room for a month. People could book it when needed. Staff found it helpful for complex tasks, although less useful for collaborative projects. The manager kept the room but added a clear booking policy.": "/audio/english/reading-literacy-13.mp3",
  "Residents wanted to turn an empty plot into a garden. They assumed everyone would prefer flowers. At a meeting, however, several families asked for vegetables and somewhere to sit. The group divided the plot into sections. Volunteers agreed on a watering schedule, and a carpenter repaired some benches. The final plan reflected more voices than the original design.": "/audio/english/reading-literacy-14.mp3",
  "After a presentation went badly, Rami expected criticism of his speaking. Instead, his manager asked what the audience needed to decide. They noticed that his slides contained details but no clear recommendation. Rami shortened the background and put his main proposal first. His next presentation did not answer every possible question, but the audience understood the decision he was asking them to make.": "/audio/english/reading-literacy-15.mp3",
  "Dina wrote long summaries after every book. She found this so tiring that she gradually stopped reading for pleasure. Then she tried a shorter journal: one question, one useful phrase and one personal response. It did not record every detail, but helped her notice patterns across books. She treats it as a conversation with the text rather than a test of memory.": "/audio/english/reading-literacy-16.mp3",
  "A neighbourhood centre held a repair workshop. Visitors brought an object and stayed while a volunteer examined it. The organisers did not promise that everything could be fixed. Their aim was to show people how to investigate problems safely and decide whether repair was possible. Some left with working lamps; others learned why their appliances needed professional attention.": "/audio/english/reading-literacy-17.mp3",
  "A cycling group planned a challenging mountain route. Rain made part of the road unsafe. One member argued that changing the plan would waste weeks of preparation. Another said preparation should help them make better decisions, not prevent them from adapting. They chose a shorter route. Most later agreed that returning safely mattered more than following the original map.": "/audio/english/reading-literacy-18.mp3",
  "The open-office debate is often framed as a choice between collaboration and privacy. Yet this overlooks the variety of tasks people perform. A designer may need conversation while exploring ideas and silence while developing a detailed plan. In this imagined redesign, a firm provides several kinds of space rather than expecting one layout to suit everyone. The proposal does not claim that a design guarantees productivity, but that employees should have meaningful choices and clear expectations.": "/audio/english/reading-literacy-19.mp3",
  "A headline says a study proves that a habit causes success. A careful reader asks what was measured. Perhaps the study only found that two things occurred together. Perhaps the sample was too narrow to support a broad conclusion. Neither possibility automatically makes the study worthless. They change how confidently its findings can be applied. Critical reading matches the strength of a claim to its evidence, rather than accepting or rejecting research as a whole.": "/audio/english/reading-literacy-20.mp3",
  "For an imagined exhibition, a curator removes the usual explanatory labels. Visitors describe what they notice before learning the objects' histories. Some enjoy the freedom; others find the lack of context frustrating. The curator adds optional information cards. This compromise preserves independent observation while recognising that interpretation is shaped by knowledge. Access to information and space for personal response need not be opposing goals.": "/audio/english/reading-literacy-21.mp3",
  "In a fictional town, a delivery service offers lower fees for a wider delivery window. Many people choose it. However, residents with unpredictable schedules find that waiting at home has its own cost. Discussion shifts from the checkout price to the flexibility required from customers. The service is convenient for some but burdensome for others. Evaluating convenience requires asking whose time is saved and whose is used.": "/audio/english/reading-literacy-22.mp3",
  "A tutor asks students to separate drafting from editing. Some object that this encourages careless work. She replies that the distinction concerns timing, not standards. Drafting allows writers to discover what they mean; revision tests whether the text communicates it. Perfecting every sentence immediately can leave an elegant opening attached to an undeveloped argument. She expects accurate final work, but treats temporary uncertainty as part of the process rather than failure.": "/audio/english/reading-literacy-23.mp3",
  "A fictional community considers a visitor centre. Supporters expect jobs and better facilities; opponents fear traffic and shoreline damage. Planners propose a smaller building, improved bus access and a review after one year. This does not remove uncertainty. It makes the trade-offs explicit and creates opportunities to adjust. A responsible proposal should include conditions for revision, rather than presenting uncertain benefits as guaranteed outcomes.": "/audio/english/reading-literacy-24.mp3",
  "An archive is often imagined as a neutral store of what happened. Yet collections embody choices about what was worth preserving and who had the means to leave records. This does not make archives useless. It makes their silences part of the evidence. A historian reading a landlord's records may learn about tenants without hearing them directly. The challenge is to acknowledge that asymmetry without filling gaps with confident invention. Responsible interpretation separates what a document establishes, what it makes plausible, and what remains unknown.": "/audio/english/reading-literacy-25.mp3",
  "Public communication often rewards certainty when evidence warrants caution. A spokesperson who qualifies a claim may sound less persuasive than one offering a simple promise. Yet removing uncertainty from the message does not remove it from the world. It transfers surprise to the audience when events unfold differently. Effective communication explains both a judgement and the conditions under which it might change. This is not an excuse for indecision: it requires a definite recommendation, clear limits, and willingness to revise when relevant evidence arrives.": "/audio/english/reading-literacy-26.mp3",
  "Restoring a landscape raises a deceptively simple question: restore it to when? A hillside remembered as untouched may have been shaped by grazing and settlement for centuries. Choosing a historical reference point also chooses which human relationships to privilege. This need not paralyse conservation. It encourages planners to specify goals: protecting a habitat, reducing erosion, or preserving a cultural practice. Interventions can then be judged against explicit aims rather than an undefined ideal of original nature.": "/audio/english/reading-literacy-27.mp3",
  "Readers praise translations that flow so naturally they forget they are translations. The compliment can conceal difficult choices about rhythm, ambiguity and cultural reference. Preserving every unfamiliar feature may burden readers; removing all of them may erase the original voice. No universal formula balances these demands. Individual decisions should serve a coherent understanding of the text and be explainable, rather than being defended simply because they sound natural in isolation.": "/audio/english/reading-literacy-28.mp3",
  "A digital service is presented at launch, when its interface is clean and promises are easy to demonstrate. Less visible is the work of correcting errors, updating instructions and helping users recover from failure. Treating this as an afterthought creates a misleading picture of innovation. A service that cannot be maintained may impose continuing costs on those who rely on it. Designing for maintenance makes repair, ownership and eventual replacement part of the original proposal.": "/audio/english/reading-literacy-29.mp3",
  "A college rewards students for the number of books finished. The count is easy to compare, but students choose shorter books and avoid difficult ones. Nothing explicitly forbids challenging reading; nevertheless, the incentive changes what feels worthwhile. This does not show measurement is always harmful. It shows that a convenient indicator can drift from its original purpose. Better evaluation combines evidence and asks whether success on the measure still reflects success in the activity.": "/audio/english/reading-literacy-30.mp3",
  "Describing technological change as inevitable does more than predict it. It narrows responses considered legitimate: if a future cannot be altered, debate appears wasted. Yet technology depends on choices about funding, regulation and access. Recognising these does not imply that any outcome can be produced at will. It rejects the false opposition between total control and helplessness. The useful question is which decisions remain open, who can influence them, and what obligations follow from exercising that influence.": "/audio/english/reading-literacy-31.mp3",
  "When the narrator insists he remembers the evening perfectly, the reader has already noticed two contradictions. The insistence has the opposite of its apparent purpose: rather than reassuring us, it reveals the effort of sounding reliable. This does not mean every detail is false. His evasions may reveal more about his priorities than a confession would. Reading requires holding competing possibilities in view, attending to what is said and to what the speaker cannot comfortably acknowledge.": "/audio/english/reading-literacy-32.mp3",
  "Reconstructing a life from fragmentary records, a biographer may turn a plausible motive into a settled explanation. Narrative continuity rewards the move: a smooth account is easier to follow than admissions of ignorance. But the convenience belongs to the storyteller, while attributed certainty belongs to someone unable to contest it. Leaving a gap can be ethical as well as evidential. Interpretation should make visible the boundary between documented action and imaginative reconstruction, especially when invention risks becoming the reader's only memory of the subject.": "/audio/english/reading-literacy-33.mp3",
  "An institution may proclaim everyone belongs while leaving its everyday language unchanged. The discrepancy need not be deliberate to matter. A welcome expressed in specialist shorthand assumes the familiarity newcomers lack. Simplifying need not strip precision away; it can make the path into precision visible. Definitions, examples and questions redistribute the burden of understanding. Belonging is less a feeling an organisation can announce than a practice tested in ordinary encounters.": "/audio/english/reading-literacy-34.mp3",
  "A map including everything would cease to be useful as a map. Selection is a condition of representation, not an accidental flaw. The question is whether simplifications suit the decisions a model supports. A hiking map and a property map can truthfully depict the same ground while foregrounding different relationships. Trouble starts when the authority of one purpose is silently carried into another, turning a partial view into an exhaustive account. The remedy is a clearer scope, not a fantasy of perspective-free vision.": "/audio/english/reading-literacy-35.mp3",
  "Effortless prose may conceal labour, but celebrating labour alone misses the point. Revision matters when it brings readers' experience into a better relation with the writer's intention. Sometimes this requires removing an elegant sentence whose function has disappeared. Sometimes it means preserving an awkward detail because smoothing it away would distort the subject. The standard is neither ease nor difficulty, but fidelity to what the text needs to do. Style is not decoration applied to an argument; it shapes how the argument becomes thinkable.": "/audio/english/reading-literacy-36.mp3",
  "My name is Hana. I live in Cairo. I am a student. I like reading.": "/audio/english/writing-literacy-writing-1.mp3",
  "My friend is Karim. He is kind. We study English together. He helps me with new words.": "/audio/english/writing-literacy-writing-2.mp3",
  "First, I get up at seven. I wash my face. Then I have breakfast. I walk to work.": "/audio/english/writing-literacy-writing-3.mp3",
  "My desk is near the window. A notebook is next to my laptop. My bag is under the desk.": "/audio/english/writing-literacy-writing-4.mp3",
  "Hi Dina, please come for tea on Saturday at five. We can meet at my home. Are you free?": "/audio/english/writing-literacy-writing-5.mp3",
  "Hi Omar, thank you for your help. The homework is clear now. You are a good friend. See you tomorrow.": "/audio/english/writing-literacy-writing-6.mp3",
  "Last Saturday, I went to the beach with my cousins. We walked and took photos. It was windy, but we enjoyed the day.\n\nWe ate our lunch near the water. After lunch, my cousin showed me a small shop, and I bought a postcard. We went home by bus in the afternoon. I was tired, but I was happy to spend time with my family.": "/audio/english/writing-literacy-writing-7.mp3",
  "Hi Sara, can we meet at four instead of three? I have an appointment. Please tell me if four works for you.\n\nWe can still meet at the library entrance. I will bring my notebook and the practice questions. If four is too late, we can choose another day. I am free on Wednesday afternoon too. Thank you for understanding.": "/audio/english/writing-literacy-writing-8.mp3",
  "Hello, I am coming to your centre tomorrow. Could you tell me how to get there from the station? Can I walk?\n\nMy train arrives at half past nine, and the class starts at ten. I do not know the area well. Is there a bus stop near the centre? Please also tell me which entrance I should use. Thank you for your help.": "/audio/english/writing-literacy-writing-9.mp3",
  "The staff were friendly and the tea was good. However, the music was too loud for studying. I would prefer a quieter table.\n\nI visited this imagined cafe with a friend on Saturday afternoon. We ordered sandwiches and sat near the window. Our food arrived quickly, and the table was clean. I would go there again to meet a friend, but not to do my homework.": "/audio/english/writing-literacy-writing-10.mp3",
  "In the picture, the sun is rising behind the hills. The sky is orange. The place looks peaceful, but I cannot tell how warm it is.\n\nThere is a path beside the trees, and I cannot see any people. The ground looks dark. It may be wet, but the picture does not show this clearly. I would like to walk there and see what is behind the hill.": "/audio/english/writing-literacy-writing-11.mp3",
  "Hi Nour, I am sorry I missed your call. I was at work. Can I call you this evening at eight?\n\nI saw your message after my meeting. I am at home now, but I need to finish one small job before we talk. If eight is not a good time, please send me a message. I am free tomorrow morning too.": "/audio/english/writing-literacy-writing-12.mp3",
  "Dear Course Team, I am interested in your English course. Could you send me the timetable and current fees? Is there an entry test?\n\nI work during the day, so I am looking for an evening class. I would also like to know how many students usually study in one group and whether course materials are included in the price. If a place is available, please explain how I can apply.\n\nThank you for your time. I look forward to hearing from you.\n\nBest regards,\nLina": "/audio/english/writing-literacy-writing-13.mp3",
  "Dear Hiring Manager, I am applying for the assistant role. In my previous role, I organised appointments and answered questions. I would like to bring these skills to your team.\n\nFor example, I kept a shared calendar and checked meeting details before sending reminders. When a customer asked a question I could not answer, I wrote it down and passed it to the right person. This helped me give clear information without guessing.\n\nI would welcome the chance to discuss the role and learn more about your team.\n\nKind regards,\nSamira": "/audio/english/writing-literacy-writing-14.mp3",
  "Dear Customer Service Team, the notebook I ordered arrived with a torn cover. Could you arrange a replacement? I can provide a photo of the damage.\n\nThe parcel arrived yesterday, and the notebook has not been used. The pages inside look fine, but the cover does not close properly. Please tell me whether I should return the damaged notebook and how to do this. I would prefer a replacement rather than a different product.\n\nPlease confirm the next step when you have checked the order. Thank you for your help.": "/audio/english/writing-literacy-writing-15.mp3",
  "First, check the class time and location. Next, bring a notebook and a pen. Finally, arrive a little early so you can find your room.\n\nIf the class is online, test the meeting link before the lesson starts. Find a quiet place and check that you can hear the sound. You do not need to understand every new word on the first day. Write down questions and ask the teacher when you have a chance.\n\nAfter the lesson, read your notes again and choose one thing to practise before the next class.": "/audio/english/writing-literacy-writing-16.mp3",
  "I recommend this imagined family story. The language is clear and the ending makes you think. If you enjoy stories about difficult choices, you may like it.\n\nThe story follows two sisters who find an old letter while preparing to move house. They disagree about whether to show it to their mother. I enjoyed the conversations because both sisters have understandable reasons for their choices. Some scenes are slow, but they help the reader notice small changes in the family.\n\nI would recommend it to a reading group because there is plenty to discuss without giving away the ending.": "/audio/english/writing-literacy-writing-17.mp3",
  "I think our college needs a quiet study room. Some students cannot concentrate in a busy library. For example, a separate room could help them revise before exams.\n\nThis does not mean that talking should be banned everywhere. Group work is useful, and students also need places where they can ask questions. A clearly marked quiet room would give people a choice without changing the whole library. The college could try this in one room for a month and ask students for feedback.\n\nIf the trial works well, the room could become a regular part of the study space.": "/audio/english/writing-literacy-writing-18.mp3",
  "The draft guide is complete, and the team is reviewing it. However, two examples still need permission. We will publish only after those permissions are confirmed.\n\nThis week, the reviewers are checking that each instruction matches the current process. They will record unclear steps in the shared document rather than changing the live service. The main risk is that the permissions may arrive after the planned publication date. If that happens, we can either delay the guide or replace the examples with ones we are allowed to use.\n\nThe next update will confirm which option is possible. Until then, the publication date should be treated as provisional.": "/audio/english/writing-literacy-writing-19.mp3",
  "Online study offers flexibility, whereas classroom lessons provide a fixed routine. For someone with changing work hours, online study may be more practical, provided that regular study time is protected.\n\nThe choice also depends on the type of online course. Recorded lessons can be watched at different times, but a live session may be just as difficult to attend as a classroom lesson. Classroom study can make it easier to ask a quick question, although travel adds time and cost. Neither format guarantees regular practice.\n\nI would first compare the actual timetable, feedback and opportunities to speak. For this learner, a flexible course with scheduled feedback would be a sensible option to investigate, not an automatic best choice.": "/audio/english/writing-literacy-writing-20.mp3",
  "The new area is bright and well organised. Its booking system makes busy periods easier to manage. Nevertheless, limited opening hours may exclude evening students.\n\nIn this imagined library, the quiet desks are separated from the group tables, so readers can choose a suitable space. Clear signs also make the different areas easy to find. The main limitation is that the building closes before some evening classes finish. A well-designed room offers little help to someone who cannot reach it while it is open.\n\nI would recommend the space for daytime study. Before recommending it more widely, I would want the library to review demand for later hours and explain what staffing that would require.": "/audio/english/writing-literacy-writing-21.mp3",
  "Thank you for considering me. I cannot take on the full report without delaying our agreed deadline. I could review the introduction on Thursday if that would help.\n\nMy current priority is to finish the course guide, including the final checks we agreed last week. The additional report would require research as well as writing, so fitting it into the same period would put both pieces of work at risk. I do not want to promise a date I cannot meet.\n\nIf the report is more urgent, we could discuss changing the order of the work. Otherwise, I can offer the limited review above and suggest questions for the person who takes the report forward.": "/audio/english/writing-literacy-writing-22.mp3",
  "The club proposes a three-month trial of a monthly book exchange. Members would bring books they no longer need. Participation would be reviewed before deciding whether to continue.\n\nThe proposal suggests using the room after an existing club meeting, which could avoid the need for a separate booking. A volunteer would record the number of participants and note practical problems, such as books left behind. Members would not be required to bring a book every month. The plan has not yet been approved, and volunteer cover still needs to be confirmed.\n\nAt the end of the trial, the club would consider attendance and feedback alongside the work involved. The proposal does not commit the club to running a permanent exchange.": "/audio/english/writing-literacy-writing-23.mp3",
  "The street was almost empty when Leila left the station. Rain shone under the lamps. She reached for her ticket, but found a folded note in her pocket instead.\n\nIt was not the shopping list she had written that morning. The paper was thick and dry, and her name appeared on the outside in small, careful letters. She looked back at the station doors. A cleaner was stacking chairs inside, and the last passenger had already turned the corner.\n\nLeila opened the note beneath a lamp. There were only five words: Do not take the bridge. Across the road, the signal changed, although no car was waiting. She put the paper back in her pocket and stayed where she was.": "/audio/english/writing-literacy-writing-24.mp3",
  "I recommend a limited pilot, subject to an agreed review point. The proposal may improve access, but the current evidence does not establish how different groups would be affected.\n\nThe pilot should therefore test a specific question: whether an evening session helps residents who cannot attend during the day. Before it begins, the organisers should agree how attendance, waiting times and access problems will be recorded. Participation alone would not show that the service meets everyone's needs; feedback from people who could not attend would also matter.\n\nAt the review, the team should compare the practical benefits with the staffing required. Expansion should depend on that assessment, rather than on the assumption that a small trial will necessarily succeed at a larger scale.": "/audio/english/writing-literacy-writing-25.mp3",
  "Students requested longer opening hours before exams. The consultation identifies a need, but staffing remains unresolved. A short evening trial would allow the college to assess demand before making a permanent commitment.\n\nThe immediate decision is therefore whether the college can support a trial, not whether extended hours should become a permanent service. A workable plan would need to identify who opens and closes the building, how students obtain help, and what happens if a staff member is absent. These arrangements should be costed before dates are announced.\n\nIf the trial proceeds, the review should consider both use of the space and the burden on staff. A busy first evening would be encouraging, but it would not by itself establish that the arrangement is sustainable.": "/audio/english/writing-literacy-writing-26.mp3",
  "A longer guide can provide valuable detail. Its length, however, is not evidence of usefulness. Readers also need a clear structure and a quick route to the information required for their task.\n\nThere is a reasonable case for including exceptions, worked examples and explanations of unfamiliar terms. Removing them merely to achieve a shorter document could leave readers unable to act. The better distinction is between detail that supports a decision and detail that interrupts it. A short overview can explain the main steps, while clearly labelled sections preserve material needed only in particular circumstances.\n\nThe guide should then be tested with realistic questions. If readers repeatedly overlook an essential condition, adding another paragraph may be less effective than changing the heading or moving the condition beside the relevant step.": "/audio/english/writing-literacy-writing-27.mp3",
  "The proposed space would give residents somewhere quiet to study. Volunteers would supervise a weekly programme. Attendance and participant feedback would inform a review after the first term.\n\nThe initial programme would use an existing room for one evening each week. Before opening, the organisers would confirm access arrangements, a safeguarding contact and a named person responsible for each session. Volunteers would receive clear instructions about the support they can offer and when to refer a question elsewhere. The proposal does not assume that volunteers can replace specialist teaching.\n\nEvaluation would include recorded attendance, reasons for missed sessions where participants choose to share them, and comments on the space. No improvement in examination results is promised. The first review would determine whether the service is useful, manageable and worth continuing.": "/audio/english/writing-literacy-writing-28.mp3",
  "This proposed study examines responses to written feedback. It would compare guided revision tasks with general comments. No data have yet been collected, so no claims about effectiveness are made.\n\nParticipants would revise a short piece of writing after receiving one of the two forms of feedback. A second task would explore whether they can apply the same point without further guidance. The analysis would distinguish changes made to the original draft from evidence of later independent use. These are related outcomes, but they should not be treated as interchangeable.\n\nParticipation would be voluntary, and the study would set out how writing samples are stored and anonymised. Any eventual report would describe the sample and the limits of the design. A difference between groups would require interpretation, not an automatic claim that one approach is best for every learner.": "/audio/english/writing-literacy-writing-29.mp3",
  "We plan to review the current procedure. The review will focus on unclear steps and avoid changing requirements that already work. We will explain the reasons for any proposed changes.\n\nFirst, we will ask staff to identify the points where they most often need clarification. We will then compare those questions with the written instructions. This will help us separate missing information from information that is present but difficult to find. We will test revised wording with a small group before asking the whole team to use it.\n\nThe final version will name the person responsible for each step and show where to report a problem. We will keep a record of the changes so that staff can understand what is different. The aim is a procedure people can follow, not a shorter document at any cost.": "/audio/english/writing-literacy-writing-30.mp3",
  "Fluency matters, but it cannot be the sole measure of a translation. A readable sentence may erase ambiguity central to the original. The judgement must consider what kind of reading the source makes possible.\n\nImagine a fictional letter whose final line can be read as either an invitation or a dismissal. A translator who makes the intention explicit may produce a smoother sentence while settling a question the writer deliberately leaves open. Conversely, preserving every feature of the source in an unfamiliar form could create confusion that the original audience never experienced. Neither ease nor difficulty is inherently faithful.\n\nThe relevant judgement is therefore relational: what has changed, for which readers, and with what effect? A useful assessment would consider meaning, register, rhythm and purposeful uncertainty alongside readability. It would also acknowledge choices that cannot all be satisfied at once. Fluency remains an important achievement, but it is evidence to examine rather than a verdict that ends the discussion.": "/audio/english/writing-literacy-writing-31.mp3",
  "The recommendation applies to the pilot sites only. Extension would require evidence of comparable support elsewhere. If implementation reveals unequal access, the policy should be revised rather than its assumptions defended at any cost.\n\nFor the pilot, each site should retain a staffed alternative to the new booking process. This is a precaution, not a prediction that the digital route will fail. The review should record whether people can complete the process, where they need help, and whether the alternative is available when they need it. A high overall completion rate could otherwise conceal a serious obstacle affecting a smaller group.\n\nThe decision to extend the policy should follow that review and include the resources needed to maintain both routes. If the evidence is incomplete, the appropriate response may be to continue a narrower trial. The condition for expansion is a service that people can actually use, not simply the successful installation of the software.": "/audio/english/writing-literacy-writing-32.mp3",
  "Repeated assurances of calm may suggest an effort to control perception. They do not prove the account false; rather, they invite attention to the tension between stated composure and the need to insist on it.\n\nIn the imagined passage, the narrator returns to the same assurance even when no other character has questioned his behaviour. One possible reading is that he anticipates the reader's suspicion and tries to answer it in advance. Another is that the repeated phrase offers reassurance to himself. The distinction matters: a defensive voice need not be a deliberately deceptive one.\n\nA stronger interpretation would connect this pattern with other details in the passage, such as interruptions, changes of tense or gaps in the account. Without those details, certainty would exceed the evidence. The repetition gives us a reason to question the narrator's presentation, but it does not supply a complete explanation of his motives. Its force lies in keeping that uncertainty active.": "/audio/english/writing-literacy-writing-33.mp3",
  "Consultation can delay a decision, and urgency sometimes limits what is possible. Yet speed alone does not establish soundness. Early objections may reveal costs that would otherwise emerge only after implementation.\n\nThe fair objection is not that affected people have nothing useful to say, but that a decision may lose its purpose if every disagreement must first be settled. That concern deserves an answer about scope and time. An urgent decision can still include a short opportunity to identify immediate barriers, a clear account of who was not reached, and a date for reconsidering the arrangement. These steps do not amount to full consultation, and they should not be described as such.\n\nWhere action cannot wait, the decision should be as limited and reversible as the circumstances allow. Urgency may justify a different process; it does not make the consequences disappear. The responsibility is to act while preserving a practical route for correction.": "/audio/english/writing-literacy-writing-34.mp3",
  "Travel does not guarantee understanding. Its value may lie less in distance than in the habits of attention carried home. Whether a journey matters depends partly on what the traveller is willing to question afterwards.\n\nThis leaves room for modest outcomes. A conversation may unsettle a familiar assumption without replacing it with a complete explanation of another place. An uncomfortable mistake may prompt greater care, although discomfort alone is no proof of learning. Even an uneventful journey can matter if the traveller notices how much ordinary life escapes a visitor's brief view.\n\nThe conclusion, then, should resist both the promise of automatic transformation and the dismissal of travel as empty consumption. What deserves attention is the relationship between encounter and response. The journey supplies an opportunity, not a certificate of openness. Its significance remains unfinished when the traveller returns, because understanding depends on what is done with the questions that remain.": "/audio/english/writing-literacy-writing-35.mp3",
  "A public service should be judged throughout its use, not only at launch. This is a principle of accountability, not a claim that every new system fails. It asks who will correct errors and support users.\n\nA launch can demonstrate that a service works under tested conditions. It cannot settle every question about future demand, changing rules or the circumstances of people who were not represented in those tests. The argument for maintenance does not depend on predicting a particular failure. It follows from the decision to make people rely on a service whose conditions may change.\n\nA credible plan would therefore identify who receives reports, how urgent problems are assessed, and which alternatives remain available during an interruption. It would also make responsibility visible when suppliers or staff change. These are proposals about how a service ought to be run. Claims about its actual performance would still need evidence from use, rather than reassurance drawn from the fact that it launched successfully.": "/audio/english/writing-literacy-writing-36.mp3",
  "My name is Lina. I am from Cairo. Our English class starts at nine. Please bring a pen and a notebook. I sit next to the window.": "/audio/english/listening-listening-studio-1-passage.mp3",
  "Our English class starts at nine.": "/audio/english/listening-listening-studio-1-dictation.mp3",
  "Hello. I would like a small coffee with milk, please. I do not want sugar. My friend wants tea. We will sit outside. Here is my card.": "/audio/english/listening-listening-studio-2-passage.mp3",
  "I do not want sugar.": "/audio/english/listening-listening-studio-2-dictation.mp3",
  "This is my friend Adam. He is twenty years old. He works in a shop. He likes football, but he does not like tennis. We study English together on Monday.": "/audio/english/listening-listening-studio-3-passage.mp3",
  "We study English together on Monday.": "/audio/english/listening-listening-studio-3-dictation.mp3",
  "I get up at seven. I make breakfast and read a book. I leave home at eight. My office is near my house, so I walk to work. I do not take the bus.": "/audio/english/listening-listening-studio-4-passage.mp3",
  "I walk to work.": "/audio/english/listening-listening-studio-4-dictation.mp3",
  "I need three apples and two bananas. The apples are red. These bananas are for my sister. I have a small bag. Please put the fruit in my bag.": "/audio/english/listening-listening-studio-5-passage.mp3",
  "Please put the fruit in my bag.": "/audio/english/listening-listening-studio-5-dictation.mp3",
  "The library is quiet today. My brother is reading a story. I am looking for a book about animals. We must be quiet here. We go home at four.": "/audio/english/listening-listening-studio-6-passage.mp3",
  "We must be quiet here.": "/audio/english/listening-listening-studio-6-dictation.mp3",
  "Attention, please. The train to Brighton will now leave from platform six, not platform three. It is running fifteen minutes late. Please keep your ticket with you during the journey.": "/audio/english/listening-listening-studio-7-passage.mp3",
  "Please keep your ticket with you during the journey.": "/audio/english/listening-listening-studio-7-dictation.mp3",
  "Reception closes at eleven tonight. If you leave before seven tomorrow morning, put your room key in the box beside the lift. Breakfast begins at half past seven. Your taxi is booked for six thirty.": "/audio/english/listening-listening-studio-8-passage.mp3",
  "Your taxi is booked for six thirty.": "/audio/english/listening-listening-studio-8-dictation.mp3",
  "We planned to have a picnic by the river on Saturday. The forecast says it will rain all morning, so we are going to the indoor market instead. Bring a jacket. We will meet outside the station at ten.": "/audio/english/listening-listening-studio-9-passage.mp3",
  "Bring a jacket.": "/audio/english/listening-listening-studio-9-dictation.mp3",
  "First, wash the tomatoes and cut them into small pieces. Heat some oil in a pan. Add the tomatoes and cook them for ten minutes. Finally, add the pasta. Do not add the cheese until you serve the meal.": "/audio/english/listening-listening-studio-10-passage.mp3",
  "Finally, add the pasta.": "/audio/english/listening-listening-studio-10-dictation.mp3",
  "Hello, this is a message about your delivery. We came at two, but nobody was home. Your parcel is at the shop opposite the post office. Please collect it before Friday and bring some identification.": "/audio/english/listening-listening-studio-11-passage.mp3",
  "Please collect it before Friday.": "/audio/english/listening-listening-studio-11-dictation.mp3",
  "Good afternoon. Your appointment with the nurse has moved from Tuesday to Wednesday. The time is still three o'clock. Please arrive ten minutes early and bring the form we sent you. Call us if you cannot come.": "/audio/english/listening-listening-studio-12-passage.mp3",
  "Please arrive ten minutes early.": "/audio/english/listening-listening-studio-12-dictation.mp3",
  "When I started at the design studio, I expected to spend all day drawing. In fact, I spent most mornings talking to customers. At first I found that difficult, but it taught me to ask better questions before starting a project.": "/audio/english/listening-listening-studio-13-passage.mp3",
  "It taught me to ask better questions.": "/audio/english/listening-listening-studio-13-dictation.mp3",
  "My suitcase did not arrive with my flight. The airline found it that evening, but I had already bought a clean shirt for my meeting. They delivered the suitcase to my hotel the next morning. Fortunately, I had kept my laptop in my hand luggage.": "/audio/english/listening-listening-studio-14-passage.mp3",
  "I had kept my laptop in my hand luggage.": "/audio/english/listening-listening-studio-14-dictation.mp3",
  "Our group used to meet once a month to clean the park. Last spring we started a small community garden as well. The hardest part was not planting the vegetables; it was finding people who could water them during the week.": "/audio/english/listening-listening-studio-15-passage.mp3",
  "The hardest part was finding people.": "/audio/english/listening-listening-studio-15-dictation.mp3",
  "The guide said the main exhibition was upstairs, but she suggested starting with the photographs on the ground floor. They showed the town before the new bridge was built. Looking at them first helped us understand why the bridge mattered so much.": "/audio/english/listening-listening-studio-16-passage.mp3",
  "They showed the town before the new bridge was built.": "/audio/english/listening-listening-studio-16-dictation.mp3",
  "I tried to read a whole chapter every evening, but I usually gave up after a few days. Now I read just two pages after breakfast. It sounds less ambitious, yet I have finished more books this way because the routine is easier to keep.": "/audio/english/listening-listening-studio-17-passage.mp3",
  "The routine is easier to keep.": "/audio/english/listening-listening-studio-17-dictation.mp3",
  "Our running club normally meets on Wednesday evenings. This week we are meeting on Sunday morning because the coach is away. Beginners should choose the shorter route around the lake. The longer route includes a steep hill and is only for experienced runners.": "/audio/english/listening-listening-studio-18-passage.mp3",
  "Beginners should choose the shorter route.": "/audio/english/listening-listening-studio-18-dictation.mp3",
  "We could launch on Monday, provided the accessibility review is complete. The payment system has passed its tests, but keyboard navigation still needs work. I would rather postpone the release than make the site difficult to use for customers who cannot use a mouse.": "/audio/english/listening-listening-studio-19-passage.mp3",
  "Keyboard navigation still needs work.": "/audio/english/listening-listening-studio-19-dictation.mp3",
  "The proposed bus route would connect the hospital with the university. Supporters say it would reduce the need to change buses in the city centre. Opponents are concerned about losing parking spaces. The council has requested passenger estimates before deciding whether the benefits justify the disruption.": "/audio/english/listening-listening-studio-20-passage.mp3",
  "The council has requested passenger estimates.": "/audio/english/listening-listening-studio-20-dictation.mp3",
  "The headline claimed that the new study proved music improves memory. The researcher was more cautious. Participants remembered a list of words immediately after listening to music, but the study did not test whether the effect lasted. A short-term result should not be presented as a permanent benefit.": "/audio/english/listening-listening-studio-21-passage.mp3",
  "The study did not test whether the effect lasted.": "/audio/english/listening-listening-studio-21-dictation.mp3",
  "The presenter praised the camera throughout the video and mentioned the sponsor only at the end. That does not necessarily make the review false. However, viewers should know about the commercial relationship before evaluating the recommendation, especially when competing products are not discussed.": "/audio/english/listening-listening-studio-22-passage.mp3",
  "Viewers should know about the commercial relationship.": "/audio/english/listening-listening-studio-22-dictation.mp3",
  "The team can afford either new office furniture or a training course this quarter, not both. Although the furniture is worn, it remains usable. The training addresses a skill gap that is delaying client work. For that reason, the manager recommends funding the course first and reviewing furniture costs later.": "/audio/english/listening-listening-studio-23-passage.mp3",
  "The manager recommends funding the course first.": "/audio/english/listening-listening-studio-23-dictation.mp3",
  "The old station could be converted into a library without removing its original roof. Some residents favour replacing the building entirely, arguing that maintenance would be cheaper. The architect disputes that assumption and has asked for an independent comparison of lifetime costs rather than construction costs alone.": "/audio/english/listening-listening-studio-24-passage.mp3",
  "The architect disputes that assumption.": "/audio/english/listening-listening-studio-24-dictation.mp3",
  "The panel approved the proposal in principle, subject to a revised staffing plan. It would therefore be premature to describe the grant as secured. Unless the team can demonstrate that the project is adequately resourced, the funder may withhold the final agreement, irrespective of the enthusiasm expressed at the meeting.": "/audio/english/listening-listening-studio-25-passage.mp3",
  "The panel approved the proposal in principle.": "/audio/english/listening-listening-studio-25-dictation.mp3",
  "Automation may reduce routine errors, but responsibility does not disappear when a decision is delegated to software. An organisation must still explain how affected people can challenge an outcome. Otherwise, a nominally efficient process risks becoming impossible to question, particularly for users whose circumstances were absent from the training data.": "/audio/english/listening-listening-studio-26-passage.mp3",
  "Responsibility does not disappear.": "/audio/english/listening-listening-studio-26-dictation.mp3",
  "The forecast assumes that demand will continue rising while supply costs remain stable. Neither assumption is unreasonable in isolation, yet their combination leaves little room for adverse conditions. A stress test would reveal whether the expansion remains viable if demand weakens at the same time as costs increase.": "/audio/english/listening-listening-studio-27-passage.mp3",
  "Their combination leaves little room for adverse conditions.": "/audio/english/listening-listening-studio-27-dictation.mp3",
  "Asked whether she would accept the role, the candidate replied that the work was compelling, though the relocation arrangements required discussion. This is neither an outright refusal nor an unqualified acceptance. Her response keeps negotiations open while making clear that practical conditions could determine the final decision.": "/audio/english/listening-listening-studio-28-passage.mp3",
  "Her response keeps negotiations open.": "/audio/english/listening-listening-studio-28-dictation.mp3",
  "Pedestrianising the square may make the area more pleasant, but the consultation should not treat all residents as equally affected. Deliveries, disability access and late-night transport require separate consideration. A design that works beautifully for a weekend visitor may create daily obstacles for someone who lives above a shop.": "/audio/english/listening-listening-studio-29-passage.mp3",
  "Disability access requires separate consideration.": "/audio/english/listening-listening-studio-29-dictation.mp3",
  "The archive contains detailed accounts from officials but almost no testimony from temporary workers. This imbalance does not invalidate the surviving records; it limits the conclusions we can responsibly draw from them. Silence in an archive may reflect who was able to leave a record rather than who played a significant part.": "/audio/english/listening-listening-studio-30-passage.mp3",
  "It limits the conclusions we can responsibly draw.": "/audio/english/listening-listening-studio-30-dictation.mp3",
  "Splendid, the chair said, another report explaining why the report is late. Her words, taken literally, expressed approval; her emphasis and the repetition of report suggested the opposite. The target was not the act of documenting progress itself, but a process that seemed to substitute explanation for action.": "/audio/english/listening-listening-studio-31-passage.mp3",
  "Her words expressed approval only when taken literally.": "/audio/english/listening-listening-studio-31-dictation.mp3",
  "We have no reason at present to believe the talks will fail, the spokesperson said. The formulation is reassuring without predicting success: at present confines the claim in time, while no reason to believe reports the available grounds for judgment rather than the eventual outcome. Reading it as a promise would erase both qualifications.": "/audio/english/listening-listening-studio-32-passage.mp3",
  "Reading it as a promise would erase both qualifications.": "/audio/english/listening-listening-studio-32-dictation.mp3",
  "According to the supplier, the replacement component meets the original specification. The auditor repeated that claim without endorsing it, noting that independent testing was still outstanding. A summary that says the auditor confirmed compliance would therefore shift ownership of the assertion and strengthen its evidential status without justification.": "/audio/english/listening-listening-studio-33-passage.mp3",
  "Independent testing was still outstanding.": "/audio/english/listening-listening-studio-33-dictation.mp3",
  "Complaints declined after the booking system was redesigned, which is consistent with the redesign having helped. Yet demand also fell during the same period, and the categories used to record complaints changed. Without accounting for those shifts, attributing the entire decline to the interface would turn a plausible explanation into an unwarranted conclusion.": "/audio/english/listening-listening-studio-34-passage.mp3",
  "Demand also fell during the same period.": "/audio/english/listening-listening-studio-34-dictation.mp3",
  "Granted, the current arrangement is cumbersome. It does not follow that the proposed alternative is preferable, still less that it should be adopted without a trial. The speaker concedes the diagnosis while resisting the remedy: agreement about a problem is being separated, deliberately, from agreement about the appropriate response.": "/audio/english/listening-listening-studio-35-passage.mp3",
  "Agreement about a problem is not agreement about a response.": "/audio/english/listening-listening-studio-35-dictation.mp3",
  "The interviews portray the programme as transformative, whereas attendance records suggest only intermittent participation. These findings need not be mutually exclusive: a small number of highly engaged participants may have experienced substantial benefits. The defensible synthesis is narrower than either a claim of universal success or a dismissal of the programme as ineffective.": "/audio/english/listening-listening-studio-36-passage.mp3",
  "These findings need not be mutually exclusive.": "/audio/english/listening-listening-studio-36-dictation.mp3",
  "Good afternoon, passengers. This is the final boarding call for British Airways flight BA 249 to London Heathrow. All ticketed passengers should proceed immediately to gate B12. Please have your boarding pass and passport open and ready for inspection. The aircraft doors will close in approximately ten minutes. Thank you.": "/audio/english/listening-list-1-passage.mp3",
  "All ticketed passengers should proceed immediately to gate B12.": "/audio/english/listening-list-1-dictation.mp3",
  "Welcome everyone to sprint 14 planning. By next Tuesday morning, our engineering squad will have deployed the new database indexing layer to the staging cluster. Kareem, will you have finished the automated unit test suite before the code freeze on Thursday night? If so, we will have verified all critical user journeys before our CEO presents to the board.": "/audio/english/listening-list-2-passage.mp3",
  "By next Tuesday morning, our engineering squad will have deployed the new database indexing layer.": "/audio/english/listening-list-2-dictation.mp3",
  "Good morning, and thank you for this opportunity. My name is Omar, and I have over four years of experience in digital marketing. In my previous role, I managed social media campaigns for three major brands, and I increased online engagement by forty percent in just one year. I am a fast learner, and I work very well under pressure. I believe my communication skills and my passion for creative content make me a strong fit for this position.": "/audio/english/listening-list-3-passage.mp3",
  "I increased online engagement by forty percent in just one year.": "/audio/english/listening-list-3-dictation.mp3",
  "Doctor: Good morning, what seems to be the problem? Patient: I have had a terrible headache since yesterday, and I feel dizzy when I stand up. Doctor: I see. Have you taken any medicine? Patient: Yes, I took two painkillers last night, but they did not help at all. Doctor: Alright. I will check your blood pressure first, and then I will give you something stronger. Make sure you drink plenty of water and get enough rest.": "/audio/english/listening-list-4-passage.mp3",
  "I have had a terrible headache since yesterday.": "/audio/english/listening-list-4-dictation.mp3",
  "Guest: Excuse me, I am afraid there is a problem with my room. The air conditioning is not working, and the room next door is very noisy. Receptionist: I am terribly sorry about that, sir. Let me see what I can do. We have a deluxe room available on the fifth floor with a sea view. I will upgrade you at no extra charge, and I will send someone to help with your luggage right away. Guest: That is very kind of you. Thank you so much.": "/audio/english/listening-list-5-passage.mp3",
  "I will upgrade you at no extra charge.": "/audio/english/listening-list-5-dictation.mp3",
  "Good morning, everyone. Today we turn to one of the most pressing questions of our century: how quickly will our cities have adapted to rising temperatures? Current models suggest that by 2050, most coastal cities will have redesigned their drainage systems, and many will have invested billions in flood defenses. However, adaptation is not only about engineering. By the same year, schools will have integrated climate literacy into every science curriculum, ensuring that the next generation understands both the risks and the solutions. Remember, the decisions we make this decade will shape the world your grandchildren inherit.": "/audio/english/listening-list-6-passage.mp3",
  "By 2050, most coastal cities will have redesigned their drainage systems.": "/audio/english/listening-list-6-dictation.mp3",
  "sheep": "/audio/english/pronunciation-mp-1-a.mp3",
  "ship": "/audio/english/pronunciation-mp-1-b.mp3",
  "leave": "/audio/english/pronunciation-mp-2-a.mp3",
  "live": "/audio/english/pronunciation-mp-2-b.mp3",
  "pen": "/audio/english/pronunciation-mp-3-a.mp3",
  "Ben": "/audio/english/pronunciation-mp-3-b.mp3",
  "bad": "/audio/english/pronunciation-mp-4-a.mp3",
  "bed": "/audio/english/pronunciation-mp-4-b.mp3",
  "think": "/audio/english/pronunciation-mp-5-a.mp3",
  "sink": "/audio/english/pronunciation-mp-5-b.mp3",
  "breathe": "/audio/english/pronunciation-mp-6-a.mp3",
  "breeze": "/audio/english/pronunciation-mp-6-b.mp3",
  "share": "/audio/english/pronunciation-mp-7-a.mp3",
  "chair": "/audio/english/pronunciation-mp-7-b.mp3",
  "cart": "/audio/english/pronunciation-mp-8-a.mp3",
  "cut": "/audio/english/pronunciation-mp-8-b.mp3",
  "light": "/audio/english/pronunciation-mp-9-a.mp3",
  "right": "/audio/english/pronunciation-mp-9-b.mp3",
  "bat": "/audio/english/pronunciation-mp-10-a.mp3",
  "pat": "/audio/english/pronunciation-mp-10-b.mp3",
  "sip": "/audio/english/pronunciation-mp-11-a.mp3",
  "very": "/audio/english/pronunciation-mp-13-a.mp3",
  "ferry": "/audio/english/pronunciation-mp-13-b.mp3",
  "gate": "/audio/english/pronunciation-mp-17-a.mp3",
  "get": "/audio/english/pronunciation-mp-17-b.mp3",
  "Omar, will you have finished revising the grammar units by Thursday night?": "/audio/english/legacy-dia-study-line-1.mp3",
  "Yes, I’ll have completed all six chapters by Wednesday evening, insha’Allah.": "/audio/english/legacy-dia-study-line-2.mp3",
  "That’s awesome! I’ll have reviewed all past exams and vocabulary by then too.": "/audio/english/legacy-dia-study-line-3.mp3",
  "Perfect. That means by Friday morning, we’ll have solved every single practice test together.": "/audio/english/legacy-dia-study-line-4.mp3",
  "Karim, will the frontend team have integrated the new payment gateway by tomorrow?": "/audio/english/legacy-dia-sprint-line-1.mp3",
  "Yes, we will have merged all pull requests by 2 p.m. today.": "/audio/english/legacy-dia-sprint-line-2.mp3",
  "Great. The QA team will have performed all automated stress tests by 5 p.m.": "/audio/english/legacy-dia-sprint-line-3.mp3",
  "Excellent! By the time the client tests the staging environment, we will have deployed the zero-bug build.": "/audio/english/legacy-dia-sprint-line-4.mp3",
  "Hassan, we must hurry! By the time we reach Terminal 3, the check-in desk will have closed!": "/audio/english/legacy-dia-airport-line-1.mp3",
  "Don’t panic, Tariq. I checked the highway traffic. We will have arrived at the airport by 7:15.": "/audio/english/legacy-dia-airport-line-2.mp3",
  "Are you sure? Will the flight crew have boarded all passengers by then?": "/audio/english/legacy-dia-airport-line-3.mp3",
  "No, boarding starts at 7:45. We will have checked our luggage and passed passport control well before that.": "/audio/english/legacy-dia-airport-line-4.mp3",
  "Nour, where do you envision your professional career in five years from today?": "/audio/english/legacy-dia-interview-line-1.mp3",
  "By 2031, I will have earned my Master’s degree in Data Science and spearheaded major AI initiatives.": "/audio/english/legacy-dia-interview-line-2.mp3",
  "Impressive! And how will you have contributed to our department’s growth by then?": "/audio/english/legacy-dia-interview-line-3.mp3",
  "I will have trained a squad of junior engineers and optimized our data pipelines to achieve 99.9% uptime.": "/audio/english/legacy-dia-interview-line-4.mp3",
  "Nour, will you have finished buying all the vegetables before the market gets crowded?": "/audio/english/legacy-dia-market-line-1.mp3",
  "Don’t worry, I’ll have picked the best tomatoes and cucumbers by eleven o’clock.": "/audio/english/legacy-dia-market-line-2.mp3",
  "Great. By noon, we’ll have bought everything for the family dinner.": "/audio/english/legacy-dia-market-line-3.mp3",
  "And by two o’clock, mom will have started cooking the stuffed pigeon.": "/audio/english/legacy-dia-market-line-4.mp3",
  "Hassan, by next week, will you have completed all the physiotherapy sessions?": "/audio/english/legacy-dia-doctor-line-1.mp3",
  "Yes doctor, I’ll have attended six sessions by Friday.": "/audio/english/legacy-dia-doctor-line-2.mp3",
  "Excellent. By the end of the month, your knee will have healed almost completely.": "/audio/english/legacy-dia-doctor-line-3.mp3",
  "That’s great news. Will I have regained full movement by the tournament?": "/audio/english/legacy-dia-doctor-line-4.mp3",
  "Youssef, by the time this position starts, will you have finished your current project?": "/audio/english/legacy-dia-interview-line-1.mp3",
  "Absolutely. I’ll have handed over all my responsibilities two weeks before that.": "/audio/english/legacy-dia-interview-line-2.mp3",
  "Impressive. And by the end of your first year, what will you have achieved here?": "/audio/english/legacy-dia-interview-line-3.mp3",
  "By then, I will have built a strong client portfolio and led at least two major campaigns.": "/audio/english/legacy-dia-interview-line-4.mp3",
  "Omar, will you have checked in our bags before the gate closes?": "/audio/english/legacy-dia-airport-line-1.mp3",
  "Relax, I’ll have finished all the procedures an hour before boarding.": "/audio/english/legacy-dia-airport-line-2.mp3",
  "By the time we land in London, we’ll have flown for almost five hours.": "/audio/english/legacy-dia-airport-line-3.mp3",
  "And by tomorrow morning, we’ll have reached our hotel near the Thames.": "/audio/english/legacy-dia-airport-line-4.mp3",
  "Good evening. How can I help you today, sir?": "/audio/english/legacy-dia-pharmacy-line-1.mp3",
  "I have this prescription. Will you have prepared the antibiotics by tomorrow morning?": "/audio/english/legacy-dia-pharmacy-line-2.mp3",
  "Certainly. By 9 a.m., we will have received the new stock and packed your order.": "/audio/english/legacy-dia-pharmacy-line-3.mp3",
  "Perfect. And by the end of the week, I will have completed the first course.": "/audio/english/legacy-dia-pharmacy-line-4.mp3",
  "Youssef, by June, will you have completed the full strength program?": "/audio/english/legacy-dia-gym-line-1.mp3",
  "Yes coach. I will have trained five days a week for three months by then.": "/audio/english/legacy-dia-gym-line-2.mp3",
  "Excellent discipline. By the championship, you will have gained five kilos of muscle.": "/audio/english/legacy-dia-gym-line-3.mp3",
  "And by next week, I will have adjusted my diet completely.": "/audio/english/legacy-dia-gym-line-4.mp3"
};

export type VoiceGender = 'female' | 'male';
export type VoiceAccent = 'US' | 'UK';
export type SpeechSpeed = 0.75 | 0.92 | 1.0 | 1.25;

export interface VoiceSettings {
  gender: VoiceGender;
  accent: VoiceAccent;
  speed: SpeechSpeed;
  isMuted: boolean;
  selectedVoiceId?: string;
  selectedVoiceName?: string;
}

const STORAGE_KEY = 'henglish_voice_settings';

// Load stored settings or provide defaults (Female default preserved exactly as is)
export function getSavedVoiceSettings(): VoiceSettings {
  if (typeof window === 'undefined') {
    return { gender: 'female', accent: 'US', speed: 0.92, isMuted: false, selectedVoiceId: 'EXAVITQu4vr4xnSDxMaL', selectedVoiceName: 'Sarah' };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return { gender: 'female', accent: 'US', speed: 0.92, isMuted: false, selectedVoiceId: 'EXAVITQu4vr4xnSDxMaL', selectedVoiceName: 'Sarah' };
}

export function saveVoiceSettings(settings: VoiceSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

let currentSettings: VoiceSettings = getSavedVoiceSettings();
let speechGeneration = 0;
let synthesisController: AbortController | null = null;
let lastSpokenText: string = '';
let currentUtterance: SpeechSynthesisUtterance | null = null;
let currentHtmlAudio: HTMLAudioElement | null = null;
let speechStateListeners: Array<(isPlaying: boolean, text: string) => void> = [];

// Client-side in-memory audio blob cache
const clientAudioBlobCache = new Map<string, string>();

export function subscribeSpeechState(listener: (isPlaying: boolean, text: string) => void): () => void {
  speechStateListeners.push(listener);
  return () => {
    speechStateListeners = speechStateListeners.filter(l => l !== listener);
  };
}

function notifyState(isPlaying: boolean, text: string) {
  speechStateListeners.forEach(l => l(isPlaying, text));
}

// Ensure voices are loaded in Chromium/Safari/Firefox
let availableVoices: SpeechSynthesisVoice[] = [];
function loadVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  availableVoices = window.speechSynthesis.getVoices().filter(v => /\bmicrosoft\b/i.test(v.name) && !/google/i.test(v.name));
  return availableVoices;
}

export function hasMicrosoftBrowserVoice(language = 'en'): boolean {
  const requested = language.toLowerCase().split(/[-_]/)[0];
  return loadVoices().some(voice => voice.lang.toLowerCase().split(/[-_]/)[0] === requested);
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    loadVoices();
  };
}

/**
 * Female voice picker:
 * EXACT preservation of the original female voice logic that the user loves.
 */
function getPreservedFemaleVoice(accent: VoiceAccent): SpeechSynthesisVoice | null {
  const voices = availableVoices.length > 0 ? availableVoices : loadVoices();
  const langPrefix = accent === 'UK' ? 'en-GB' : 'en-US';

  // 1. Check for specific natural female voices
  const preferredFemale = voices.find(v => 
    (v.lang.startsWith(langPrefix) || v.lang.startsWith('en')) &&
    (v.name.includes('Samantha') || 
     v.name.includes('Zira') || 
     v.name.includes('Victoria') ||
     (v.name.includes('Natural') && v.name.includes('Jenny')) ||
     (v.name.includes('Natural') && v.name.includes('Aria')) ||
     v.name.toLowerCase().includes('female'))
  );
  if (preferredFemale) return preferredFemale;

  // Fallback to any en voice that isn't clearly male
  const anyNonMale = voices.find(v => 
    (v.lang.startsWith(langPrefix) || v.lang.startsWith('en')) &&
    !v.name.toLowerCase().includes('male') &&
    !v.name.toLowerCase().includes('david') &&
    !v.name.toLowerCase().includes('george')
  );

  return anyNonMale || voices.find(v => v.lang.startsWith('en')) || null;
}

/**
 * Male voice picker:
 * VASTLY IMPROVED natural, warm, native-sounding male pronunciation.
 */
function getUpgradedMaleVoice(accent: VoiceAccent): SpeechSynthesisVoice | null {
  const voices = availableVoices.length > 0 ? availableVoices : loadVoices();
  const langPrefix = accent === 'UK' ? 'en-GB' : 'en-US';

  const maleKeywords = [
    'guy online (natural)',
    'christopher online (natural)',
    'ryan online (natural)',
    'guyneural',
    'ryanneural',
    'georgeneural',
    'daniel (enhanced)',
    'daniel',
    'oliver',
    'george',
    'arthur',
    'microsoft david',
    'alex',
    'fred',
    'male'
  ];

  for (const keyword of maleKeywords) {
    const match = voices.find(v => 
      v.lang.startsWith(langPrefix) && v.name.toLowerCase().includes(keyword)
    );
    if (match) return match;
  }

  for (const keyword of maleKeywords) {
    const match = voices.find(v => 
      v.lang.startsWith('en') && v.name.toLowerCase().includes(keyword)
    );
    if (match) return match;
  }

  const genericMale = voices.find(v => 
    v.lang.startsWith('en') && v.name.toLowerCase().includes('male')
  );
  if (genericMale) return genericMale;

  return voices.find(v => v.lang.startsWith('en')) || null;
}

export function setVoiceGender(gender: VoiceGender): void {
  currentSettings.gender = gender;
  saveVoiceSettings(currentSettings);
}

export function setVoiceAccent(accent: VoiceAccent): void {
  currentSettings.accent = accent;
  saveVoiceSettings(currentSettings);
}

export function setVoiceSpeed(speed: SpeechSpeed): void {
  currentSettings.speed = speed;
  saveVoiceSettings(currentSettings);
}

export function setVoiceId(
  voiceId: string,
  voiceName?: string,
  gender?: VoiceGender,
  accent?: VoiceAccent
): void {
  currentSettings.selectedVoiceId = voiceId;
  if (voiceName) currentSettings.selectedVoiceName = voiceName;
  if (gender) currentSettings.gender = gender;
  if (accent) currentSettings.accent = accent;
  saveVoiceSettings(currentSettings);
}

export function toggleAudioMute(): boolean {
  currentSettings.isMuted = !currentSettings.isMuted;
  saveVoiceSettings(currentSettings);
  if (currentSettings.isMuted) {
    stopSpeech();
  }
  return currentSettings.isMuted;
}

export function getVoiceSettings(): VoiceSettings {
  return { ...currentSettings };
}

export function stopSpeech(): void {
  speechGeneration++;
  synthesisController?.abort();
  synthesisController = null;
  if (currentHtmlAudio) {
    currentHtmlAudio.pause();
    currentHtmlAudio.currentTime = 0;
    currentHtmlAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
  notifyState(false, '');
}

export function pauseSpeech(): void {
  if (currentHtmlAudio) {
    currentHtmlAudio.pause();
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.pause();
  }
  notifyState(false, lastSpokenText);
}

export function resumeSpeech(): void {
  if (currentHtmlAudio) {
    currentHtmlAudio.play().catch(() => {});
    notifyState(true, lastSpokenText);
    return;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.resume();
    notifyState(true, lastSpokenText);
  }
}

export function replaySpeech(): void {
  if (lastSpokenText) {
    speakEnglishVoice(lastSpokenText);
  }
}

export interface SpeakOptions {
  gender?: VoiceGender;
  accent?: VoiceAccent;
  speed?: SpeechSpeed;
  pitch?: number;
  voiceId?: string;
  onEnd?: () => void;
  onEnded?: () => void;
  onError?: () => void;
}

/**
 * Play sentence with browser SpeechSynthesis
 */
function speakViaBrowserSpeech(text: string, options?: SpeakOptions, generation = speechGeneration): void {
  if (generation !== speechGeneration) return;
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (options?.onError) options.onError();
    return;
  }

  try {
    window.speechSynthesis.cancel();

    const gender = options?.gender || currentSettings.gender;
    const accent = options?.accent || currentSettings.accent;
    const speed = options?.speed || currentSettings.speed;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = accent === 'UK' ? 'en-GB' : 'en-US';
    utterance.rate = speed;

    const voice = gender === 'female' ? getPreservedFemaleVoice(accent) : getUpgradedMaleVoice(accent);
    // Never leave voice unset: the OS default may be Google or an unknown vendor.
    if (!voice) { notifyState(false, ''); options?.onError?.(); return; }
    utterance.voice = voice;
    utterance.pitch = options?.pitch ?? (gender === 'female' ? 1.0 : 0.94);

    utterance.onstart = () => {
      if (generation !== speechGeneration) return;
      currentUtterance = utterance;
      notifyState(true, text);
    };

    utterance.onend = () => {
      if (generation !== speechGeneration) return;
      currentUtterance = null;
      notifyState(false, '');
      if (options?.onEnd) options.onEnd();
      if (options?.onEnded) options.onEnded();
    };

    utterance.onerror = () => {
      if (generation !== speechGeneration) return;
      currentUtterance = null;
      notifyState(false, '');
      if (options?.onError) options.onError();
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Browser SpeechSynthesis error:', err);
    notifyState(false, '');
    if (options?.onError) options.onError();
  }
}

/**
 * Main Single Speech Function (Server TTS -> Cached Audio -> Browser SpeechSynthesis Fallback)
 */
export function speakEnglishVoice(text: string, options?: SpeakOptions): void {
  if (typeof window === 'undefined' || currentSettings.isMuted) return;
  const trimmed = text.trim();
  if (!trimmed) return;
  lastSpokenText = trimmed;
  stopSpeech();
  const generation = speechGeneration;
  const isCurrent = () => generation === speechGeneration;
  const gender = options?.gender || currentSettings.gender;
  const accent = options?.accent || currentSettings.accent;
  const speed = options?.speed || currentSettings.speed;
  const voiceId = options?.voiceId || currentSettings.selectedVoiceId;
  const cacheKey = `${trimmed}_${voiceId || `${accent}_${gender}`}_${speed}`;
  let fallbackStarted = false;
  const fallback = () => {
    if (!isCurrent() || fallbackStarted) return;
    fallbackStarted = true;
    if (currentHtmlAudio) { currentHtmlAudio.pause(); currentHtmlAudio = null; }
    speakViaBrowserSpeech(trimmed, options, generation);
  };
  const playAudio = (src: string, onFailure = fallback) => {
    if (!isCurrent()) return;
    const audio = new Audio(src);
    currentHtmlAudio = audio;
    audio.playbackRate = speed;
    audio.onplay = () => { if (isCurrent() && currentHtmlAudio === audio) notifyState(true, trimmed); };
    audio.onended = () => {
      if (!isCurrent() || currentHtmlAudio !== audio) return;
      currentHtmlAudio = null;
      notifyState(false, '');
      options?.onEnd?.();
      options?.onEnded?.();
    };
    let failed = false;
    const failOnce = () => { if (failed || !isCurrent()) return; failed = true; onFailure(); };
    audio.onerror = failOnce;
    audio.play().catch(failOnce);
  };
  const requestServerAudio = () => {
    if (!isCurrent()) return;
    if (currentHtmlAudio) { currentHtmlAudio.pause(); currentHtmlAudio = null; }
  const cached = clientAudioBlobCache.get(cacheKey);
  if (cached) { playAudio(cached); return; }
  const controller = new AbortController();
  synthesisController = controller;
  fetch('/api/tts/synthesize', {
    signal: controller.signal,
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: trimmed, accent, gender, speed, voiceId }),
  })
    .then(res => { if (!isCurrent()) return null; return res.json(); })
    .then(data => {
      if (!isCurrent()) return;
      synthesisController = null;
      if (data?.audioBase64) {
        const src = `data:${data.mimeType || 'audio/mpeg'};base64,${data.audioBase64}`;
        clientAudioBlobCache.set(cacheKey, src);
        playAudio(src);
      } else fallback();
    })
    .catch(() => { if (isCurrent()) { synthesisController = null; fallback(); } });
  };
  const readyClip = STATIC_ENGLISH_AUDIO[trimmed];
  if (readyClip) { playAudio(readyClip, requestServerAudio); return; }
  requestServerAudio();
}

/**
 * Sequential Sentence Audio Queue Player:
 * Guarantees zero overlapping, plays sentence by sentence listening to the true 'ended' event.
 */
export class AudioQueuePlayer {
  private queue: Array<{
    text: string;
    gender?: VoiceGender;
    accent?: VoiceAccent;
    speakerName?: string;
  }> = [];
  private isStopped = true;
  private generation = 0;
  private releaseWait: (() => void) | null = null;
  private resumeWait: (() => void) | null = null;
  private gapTimer: ReturnType<typeof setTimeout> | null = null;
  private isPaused = false;
  private currentIndex = 0;
  private onSentenceChange?: (index: number) => void;
  private onQueueFinished?: () => void;

  public async startQueue(
    items: Array<{
      text: string;
      gender?: VoiceGender;
      accent?: VoiceAccent;
      speakerName?: string;
    }>,
    onSentenceChange?: (index: number) => void,
    onQueueFinished?: () => void
  ): Promise<void> {
    this.stop();
    this.queue = items;
    this.isStopped = false;
    this.isPaused = false;
    this.currentIndex = 0;
    this.onSentenceChange = onSentenceChange;
    this.onQueueFinished = onQueueFinished;

    await this.processNextSentence(this.generation);
  }

  private async processNextSentence(generation: number): Promise<void> {
    const isCurrent = () => generation === this.generation && !this.isStopped;
    while (isCurrent() && this.currentIndex < this.queue.length) {
      if (this.isPaused) await new Promise<void>(resolve => { this.resumeWait = resolve; });
      if (!isCurrent()) return;
      const currentItem = this.queue[this.currentIndex];
      this.onSentenceChange?.(this.currentIndex);
      await new Promise<void>(resolve => {
        const finish = () => { if (this.releaseWait === finish) this.releaseWait = null; resolve(); };
        this.releaseWait = finish;
        speakEnglishVoice(currentItem.text, {
          gender: currentItem.gender, accent: currentItem.accent,
          onEnd: finish, onError: finish,
        });
      });
      if (!isCurrent()) return;
      this.currentIndex++;
      // Preserve the existing natural pause, but let Stop settle it immediately.
      await new Promise<void>(resolve => {
        const finish = () => { if (this.releaseWait === finish) this.releaseWait = null; resolve(); };
        this.releaseWait = finish;
        this.gapTimer = setTimeout(() => { this.gapTimer = null; finish(); }, 300);
      });
    }
    if (!isCurrent()) return;
    this.isStopped = true;
    const finished = this.onQueueFinished;
    this.onQueueFinished = undefined;
    finished?.();
  }

  public stop(): void {
    this.generation++;
    const wasActive = !this.isStopped;
    this.isStopped = true;
    this.isPaused = false;
    this.queue = [];
    if (this.gapTimer !== null) clearTimeout(this.gapTimer);
    this.gapTimer = null;
    this.releaseWait?.();
    this.releaseWait = null;
    this.resumeWait?.();
    this.resumeWait = null;
    stopSpeech();
    const finished = this.onQueueFinished;
    this.onQueueFinished = undefined;
    if (wasActive) finished?.();
  }

  public pause(): void {
    if (this.isStopped) return;
    this.isPaused = true;
    pauseSpeech();
  }

  public resume(): void {
    if (this.isStopped || !this.isPaused) return;
    this.isPaused = false;
    this.resumeWait?.();
    this.resumeWait = null;
    resumeSpeech();
  }

  public getIsPlaying(): boolean {
    return !this.isStopped && !this.isPaused;
  }
}

// Singleton Queue Player instance
let globalQueuePlayer: AudioQueuePlayer | null = null;
export function getAudioQueuePlayer(): AudioQueuePlayer {
  if (!globalQueuePlayer) {
    globalQueuePlayer = new AudioQueuePlayer();
  }
  return globalQueuePlayer;
}

// Alias for universal compatibility
export const speakText = speakEnglishVoice;

/**
 * Universal Multilingual Speech Function
 * Speaks text in any specified language (e.g. 'ar', 'en', 'fr', 'es', 'de', etc.)
 */
export function speakMultilingualText(text: string, langCode: string = 'en', onEndOrOptions?: (() => void) | SpeakOptions): void {
  const options = typeof onEndOrOptions === 'function' ? { onEnd: onEndOrOptions } : onEndOrOptions;
  if (typeof window === 'undefined') { options?.onError?.(); return; }
  if (currentSettings.isMuted) return;

  const trimmed = text.trim();
  if (!trimmed) return;

  stopSpeech();

  // If language is English, we can use our enhanced speakEnglishVoice
  if (langCode === 'en' || langCode.startsWith('en-')) {
    speakEnglishVoice(trimmed, options);
    return;
  }

  const generation = speechGeneration;
  // Otherwise, use browser SpeechSynthesis with the matching language voice
  try {
    const utterance = new SpeechSynthesisUtterance(trimmed);
    const voices = loadVoices();
    const language = langCode.toLowerCase().replace('_', '-');
    const targetVoice = voices.find(v => v.lang.toLowerCase().replace('_', '-') === language)
      || voices.find(v => v.lang.toLowerCase().split(/[-_]/)[0] === language.split('-')[0]);
    if (!targetVoice) { notifyState(false, ''); options?.onError?.(); return; }
    utterance.voice = targetVoice;
    utterance.lang = langCode;
    utterance.rate = options?.speed ?? 0.95;

    utterance.onstart = () => { if (generation === speechGeneration) notifyState(true, trimmed); };
    utterance.onend = () => {
      if (generation !== speechGeneration) return;
      notifyState(false, '');
      options?.onEnd?.();
      options?.onEnded?.();
    };
    utterance.onerror = () => {
      if (generation !== speechGeneration) return;
      notifyState(false, '');
      options?.onError?.();
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
    notifyState(false, '');
    options?.onError?.();
  }
}
