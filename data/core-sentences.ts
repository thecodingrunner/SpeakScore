// data/core-sentences.ts
// 300 core sentences for MVP - manually curated for quality

export interface Sentence {
  id: string;
  text: string;
  phonemes: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  scenario: string;
  context?: string;
  translation_jp?: string; // Optional Japanese translation
}

// ========================================
// PHONEME LESSONS (150 sentences total)
// ========================================

// Lesson 1: /r/ vs /l/ (25 sentences)
export const phoneme_r_vs_l: Sentence[] = [
  // Beginner (10)
  { id: 'rl_001', text: 'I really like reading.', phonemes: ['/r/', '/l/'], difficulty: 'beginner', scenario: 'phoneme_r_vs_l', translation_jp: '私は読書が本当に好きです' },
  { id: 'rl_002', text: 'The library is very large.', phonemes: ['/l/', '/r/'], difficulty: 'beginner', scenario: 'phoneme_r_vs_l' },
  { id: 'rl_003', text: 'I like learning English.', phonemes: ['/l/', '/r/'], difficulty: 'beginner', scenario: 'phoneme_r_vs_l' },
  { id: 'rl_004', text: 'Red leaves are falling.', phonemes: ['/r/', '/l/'], difficulty: 'beginner', scenario: 'phoneme_r_vs_l' },
  { id: 'rl_005', text: 'Please call me later.', phonemes: ['/l/'], difficulty: 'beginner', scenario: 'phoneme_r_vs_l' },
  { id: 'rl_006', text: 'The rabbit is running.', phonemes: ['/r/'], difficulty: 'beginner', scenario: 'phoneme_r_vs_l' },
  { id: 'rl_007', text: 'I like light rain.', phonemes: ['/l/', '/r/'], difficulty: 'beginner', scenario: 'phoneme_r_vs_l' },
  { id: 'rl_008', text: 'The car is red.', phonemes: ['/r/'], difficulty: 'beginner', scenario: 'phoneme_r_vs_l' },
  { id: 'rl_009', text: 'Look at the river.', phonemes: ['/l/', '/r/'], difficulty: 'beginner', scenario: 'phoneme_r_vs_l' },
  { id: 'rl_010', text: 'I really love London.', phonemes: ['/r/', '/l/'], difficulty: 'beginner', scenario: 'phoneme_r_vs_l' },
  
  // Intermediate (10)
  { id: 'rl_011', text: 'Correct pronunciation is very important.', phonemes: ['/r/', '/l/'], difficulty: 'intermediate', scenario: 'phoneme_r_vs_l' },
  { id: 'rl_012', text: 'The electric railway runs regularly.', phonemes: ['/l/', '/r/'], difficulty: 'intermediate', scenario: 'phoneme_r_vs_l' },
  { id: 'rl_013', text: 'Please collect relevant information.', phonemes: ['/l/', '/r/'], difficulty: 'intermediate', scenario: 'phoneme_r_vs_l' },
  { id: 'rl_014', text: 'Rural areas have beautiful landscapes.', phonemes: ['/r/', '/l/'], difficulty: 'intermediate', scenario: 'phoneme_r_vs_l' },
  { id: 'rl_015', text: 'Colorful flowers bloom in April.', phonemes: ['/l/', '/r/'], difficulty: 'intermediate', scenario: 'phoneme_r_vs_l' },
  { id: 'rl_016', text: 'The parallel lines never cross.', phonemes: ['/l/', '/r/'], difficulty: 'intermediate', scenario: 'phoneme_r_vs_l' },
  { id: 'rl_017', text: 'Regular exercise is really beneficial.', phonemes: ['/r/', '/l/'], difficulty: 'intermediate', scenario: 'phoneme_r_vs_l' },
  { id: 'rl_018', text: 'Literal translation can be challenging.', phonemes: ['/l/', '/r/'], difficulty: 'intermediate', scenario: 'phoneme_r_vs_l' },
  { id: 'rl_019', text: 'The roller coaster was extremely thrilling.', phonemes: ['/r/', '/l/'], difficulty: 'intermediate', scenario: 'phoneme_r_vs_l' },
  { id: 'rl_020', text: 'Liberal policies promote individual rights.', phonemes: ['/l/', '/r/'], difficulty: 'intermediate', scenario: 'phoneme_r_vs_l' },
  
  // Advanced (5)
  { id: 'rl_021', text: 'Preliminary results reflect relatively low participation.', phonemes: ['/r/', '/l/'], difficulty: 'advanced', scenario: 'phoneme_r_vs_l' },
  { id: 'rl_022', text: 'Revolutionary technology relies on relentless research.', phonemes: ['/r/', '/l/'], difficulty: 'advanced', scenario: 'phoneme_r_vs_l' },
  { id: 'rl_023', text: 'Literally millions of travelers rely on reliable transportation.', phonemes: ['/l/', '/r/'], difficulty: 'advanced', scenario: 'phoneme_r_vs_l' },
  { id: 'rl_024', text: 'The electoral process requires careful deliberation.', phonemes: ['/l/', '/r/'], difficulty: 'advanced', scenario: 'phoneme_r_vs_l' },
  { id: 'rl_025', text: 'Regulatory frameworks rarely resolve all problems.', phonemes: ['/r/', '/l/'], difficulty: 'advanced', scenario: 'phoneme_r_vs_l' },
];

// Lesson 2: /th/ sounds - θ (think) and ð (this) (25 sentences)
export const phoneme_th_sounds: Sentence[] = [
  // Beginner (10)
  { id: 'th_001', text: 'I think this is good.', phonemes: ['/θ/', '/ð/'], difficulty: 'beginner', scenario: 'phoneme_th_sounds' },
  { id: 'th_002', text: 'Thank you very much.', phonemes: ['/θ/'], difficulty: 'beginner', scenario: 'phoneme_th_sounds' },
  { id: 'th_003', text: 'This is my brother.', phonemes: ['/ð/'], difficulty: 'beginner', scenario: 'phoneme_th_sounds' },
  { id: 'th_004', text: 'Three things are important.', phonemes: ['/θ/'], difficulty: 'beginner', scenario: 'phoneme_th_sounds' },
  { id: 'th_005', text: 'The weather is nice today.', phonemes: ['/ð/'], difficulty: 'beginner', scenario: 'phoneme_th_sounds' },
  { id: 'th_006', text: 'I think about it every day.', phonemes: ['/θ/'], difficulty: 'beginner', scenario: 'phoneme_th_sounds' },
  { id: 'th_007', text: 'These apples are fresh.', phonemes: ['/ð/'], difficulty: 'beginner', scenario: 'phoneme_th_sounds' },
  { id: 'th_008', text: 'Thursday is my favorite day.', phonemes: ['/θ/'], difficulty: 'beginner', scenario: 'phoneme_th_sounds' },
  { id: 'th_009', text: 'Both of them are students.', phonemes: ['/θ/'], difficulty: 'beginner', scenario: 'phoneme_th_sounds' },
  { id: 'th_010', text: 'That was an interesting story.', phonemes: ['/ð/'], difficulty: 'beginner', scenario: 'phoneme_th_sounds' },
  
  // Intermediate (10)
  { id: 'th_011', text: 'I think the theory is thoroughly tested.', phonemes: ['/θ/'], difficulty: 'intermediate', scenario: 'phoneme_th_sounds' },
  { id: 'th_012', text: 'They gathered together on Thursday.', phonemes: ['/ð/', '/θ/'], difficulty: 'intermediate', scenario: 'phoneme_th_sounds' },
  { id: 'th_013', text: 'The athlete showed great strength.', phonemes: ['/θ/'], difficulty: 'intermediate', scenario: 'phoneme_th_sounds' },
  { id: 'th_014', text: 'Nothing is more valuable than health.', phonemes: ['/θ/'], difficulty: 'intermediate', scenario: 'phoneme_th_sounds' },
  { id: 'th_015', text: 'The author writes about mythology.', phonemes: ['/θ/'], difficulty: 'intermediate', scenario: 'phoneme_th_sounds' },
  { id: 'th_016', text: 'They discussed the ethical issues.', phonemes: ['/ð/', '/θ/'], difficulty: 'intermediate', scenario: 'phoneme_th_sounds' },
  { id: 'th_017', text: 'Breathe deeply and think clearly.', phonemes: ['/θ/'], difficulty: 'intermediate', scenario: 'phoneme_th_sounds' },
  { id: 'th_018', text: 'The path through the forest is narrow.', phonemes: ['/θ/'], difficulty: 'intermediate', scenario: 'phoneme_th_sounds' },
  { id: 'th_019', text: 'Either option works for them.', phonemes: ['/ð/', '/θ/'], difficulty: 'intermediate', scenario: 'phoneme_th_sounds' },
  { id: 'th_020', text: 'Mathematics requires methodical thinking.', phonemes: ['/θ/'], difficulty: 'intermediate', scenario: 'phoneme_th_sounds' },
  
  // Advanced (5)
  { id: 'th_021', text: 'The synthesis of anthropological theories requires thorough analysis.', phonemes: ['/θ/'], difficulty: 'advanced', scenario: 'phoneme_th_sounds' },
  { id: 'th_022', text: 'Nevertheless, they thought the method was worthwhile.', phonemes: ['/ð/', '/θ/'], difficulty: 'advanced', scenario: 'phoneme_th_sounds' },
  { id: 'th_023', text: 'Thousands gathered to watch the theatrical performance.', phonemes: ['/θ/'], difficulty: 'advanced', scenario: 'phoneme_th_sounds' },
  { id: 'th_024', text: 'The empathetic therapist thoughtfully addressed their concerns.', phonemes: ['/θ/', '/ð/'], difficulty: 'advanced', scenario: 'phoneme_th_sounds' },
  { id: 'th_025', text: 'Both hypotheses demonstrated theoretical authenticity.', phonemes: ['/θ/'], difficulty: 'advanced', scenario: 'phoneme_th_sounds' },
];

// Lesson 3: /f/ vs /h/ (25 sentences)
export const phoneme_f_vs_h: Sentence[] = [
  // Beginner (10)
  { id: 'fh_001', text: 'I feel happy today.', phonemes: ['/f/', '/h/'], difficulty: 'beginner', scenario: 'phoneme_f_vs_h' },
  { id: 'fh_002', text: 'He has five friends.', phonemes: ['/h/', '/f/'], difficulty: 'beginner', scenario: 'phoneme_f_vs_h' },
  { id: 'fh_003', text: 'The food is hot.', phonemes: ['/f/', '/h/'], difficulty: 'beginner', scenario: 'phoneme_f_vs_h' },
  { id: 'fh_004', text: 'Her hat is beautiful.', phonemes: ['/h/'], difficulty: 'beginner', scenario: 'phoneme_f_vs_h' },
  { id: 'fh_005', text: 'I have a fast car.', phonemes: ['/h/', '/f/'], difficulty: 'beginner', scenario: 'phoneme_f_vs_h' },
  { id: 'fh_006', text: 'The fish is fresh.', phonemes: ['/f/'], difficulty: 'beginner', scenario: 'phoneme_f_vs_h' },
  { id: 'fh_007', text: 'He hopes for success.', phonemes: ['/h/', '/f/'], difficulty: 'beginner', scenario: 'phoneme_f_vs_h' },
  { id: 'fh_008', text: 'Five hours is enough.', phonemes: ['/f/', '/h/'], difficulty: 'beginner', scenario: 'phoneme_f_vs_h' },
  { id: 'fh_009', text: 'Her family is happy.', phonemes: ['/h/', '/f/'], difficulty: 'beginner', scenario: 'phoneme_f_vs_h' },
  { id: 'fh_010', text: 'The phone is here.', phonemes: ['/f/', '/h/'], difficulty: 'beginner', scenario: 'phoneme_f_vs_h' },
  
  // Intermediate (10)
  { id: 'fh_011', text: 'The comfortable hotel has helpful staff.', phonemes: ['/f/', '/h/'], difficulty: 'intermediate', scenario: 'phoneme_f_vs_h' },
  { id: 'fh_012', text: 'Her husband works in finance.', phonemes: ['/h/', '/f/'], difficulty: 'intermediate', scenario: 'phoneme_f_vs_h' },
  { id: 'fh_013', text: 'The famous historian gave a lecture.', phonemes: ['/f/', '/h/'], difficulty: 'intermediate', scenario: 'phoneme_f_vs_h' },
  { id: 'fh_014', text: 'Hopefully the forecast is accurate.', phonemes: ['/h/', '/f/'], difficulty: 'intermediate', scenario: 'phoneme_f_vs_h' },
  { id: 'fh_015', text: 'Physical fitness requires hard work.', phonemes: ['/f/', '/h/'], difficulty: 'intermediate', scenario: 'phoneme_f_vs_h' },
  { id: 'fh_016', text: 'The fresh air feels refreshing.', phonemes: ['/f/'], difficulty: 'intermediate', scenario: 'phoneme_f_vs_h' },
  { id: 'fh_017', text: 'Her helpful advice was effective.', phonemes: ['/h/', '/f/'], difficulty: 'intermediate', scenario: 'phoneme_f_vs_h' },
  { id: 'fh_018', text: 'The photograph shows happy faces.', phonemes: ['/f/', '/h/'], difficulty: 'intermediate', scenario: 'phoneme_f_vs_h' },
  { id: 'fh_019', text: 'Financial habits affect future outcomes.', phonemes: ['/f/', '/h/'], difficulty: 'intermediate', scenario: 'phoneme_f_vs_h' },
  { id: 'fh_020', text: 'He found the hidden file.', phonemes: ['/h/', '/f/'], difficulty: 'intermediate', scenario: 'phoneme_f_vs_h' },
  
  // Advanced (5)
  { id: 'fh_021', text: 'The pharmaceutical company had a helpful healthcare initiative.', phonemes: ['/f/', '/h/'], difficulty: 'advanced', scenario: 'phoneme_f_vs_h' },
  { id: 'fh_022', text: 'His philosophical hypothesis faced harsh criticism.', phonemes: ['/f/', '/h/'], difficulty: 'advanced', scenario: 'phoneme_f_vs_h' },
  { id: 'fh_023', text: 'The beautiful symphony hall hosted famous performances.', phonemes: ['/f/', '/h/'], difficulty: 'advanced', scenario: 'phoneme_f_vs_h' },
  { id: 'fh_024', text: 'Her influential speech emphasized fundamental human rights.', phonemes: ['/f/', '/h/'], difficulty: 'advanced', scenario: 'phoneme_f_vs_h' },
  { id: 'fh_025', text: 'Helpful feedback facilitates professional growth and happiness.', phonemes: ['/h/', '/f/'], difficulty: 'advanced', scenario: 'phoneme_f_vs_h' },
];

// Lesson 4: /v/ vs /b/ (25 sentences)
export const phoneme_v_vs_b: Sentence[] = [
  // Beginner (10)
  { id: 'vb_001', text: 'I have a very big bag.', phonemes: ['/v/', '/b/'], difficulty: 'beginner', scenario: 'phoneme_v_vs_b' },
  { id: 'vb_002', text: 'The vest is better than the belt.', phonemes: ['/v/', '/b/'], difficulty: 'beginner', scenario: 'phoneme_v_vs_b' },
  { id: 'vb_003', text: 'Seven boats are in the bay.', phonemes: ['/v/', '/b/'], difficulty: 'beginner', scenario: 'phoneme_v_vs_b' },
  { id: 'vb_004', text: 'The van is very fast.', phonemes: ['/v/'], difficulty: 'beginner', scenario: 'phoneme_v_vs_b' },
  { id: 'vb_005', text: 'My vocabulary is improving.', phonemes: ['/v/', '/b/'], difficulty: 'beginner', scenario: 'phoneme_v_vs_b' },
  { id: 'vb_006', text: 'The best view is from above.', phonemes: ['/b/', '/v/'], difficulty: 'beginner', scenario: 'phoneme_v_vs_b' },
  { id: 'vb_007', text: 'I love beautiful beaches.', phonemes: ['/v/', '/b/'], difficulty: 'beginner', scenario: 'phoneme_v_vs_b' },
  { id: 'vb_008', text: 'November brings cold weather.', phonemes: ['/v/', '/b/'], difficulty: 'beginner', scenario: 'phoneme_v_vs_b' },
  { id: 'vb_009', text: 'The brave volunteer helps everyone.', phonemes: ['/b/', '/v/'], difficulty: 'beginner', scenario: 'phoneme_v_vs_b' },
  { id: 'vb_010', text: 'Video games are very popular.', phonemes: ['/v/', '/b/'], difficulty: 'beginner', scenario: 'phoneme_v_vs_b' },
  
  // Intermediate (10)
  { id: 'vb_011', text: 'The valuable advice proved beneficial.', phonemes: ['/v/', '/b/'], difficulty: 'intermediate', scenario: 'phoneme_v_vs_b' },
  { id: 'vb_012', text: 'Behavioral patterns reveal individual values.', phonemes: ['/b/', '/v/'], difficulty: 'intermediate', scenario: 'phoneme_v_vs_b' },
  { id: 'vb_013', text: 'Every November, volunteers distribute blankets.', phonemes: ['/v/', '/b/'], difficulty: 'intermediate', scenario: 'phoneme_v_vs_b' },
  { id: 'vb_014', text: 'The private beach provides a better view.', phonemes: ['/v/', '/b/'], difficulty: 'intermediate', scenario: 'phoneme_v_vs_b' },
  { id: 'vb_015', text: 'Obvious problems require brave solutions.', phonemes: ['/v/', '/b/'], difficulty: 'intermediate', scenario: 'phoneme_v_vs_b' },
  { id: 'vb_016', text: 'The verbal agreement was very binding.', phonemes: ['/v/', '/b/'], difficulty: 'intermediate', scenario: 'phoneme_v_vs_b' },
  { id: 'vb_017', text: 'Biodiversity is vital for survival.', phonemes: ['/b/', '/v/'], difficulty: 'intermediate', scenario: 'phoneme_v_vs_b' },
  { id: 'vb_018', text: 'Several businesses moved beyond borders.', phonemes: ['/v/', '/b/'], difficulty: 'intermediate', scenario: 'phoneme_v_vs_b' },
  { id: 'vb_019', text: 'The vibrant neighborhood has busy venues.', phonemes: ['/v/', '/b/'], difficulty: 'intermediate', scenario: 'phoneme_v_vs_b' },
  { id: 'vb_020', text: 'Believing in yourself brings visible results.', phonemes: ['/b/', '/v/'], difficulty: 'intermediate', scenario: 'phoneme_v_vs_b' },
  
  // Advanced (5)
  { id: 'vb_021', text: 'The ambitious venture capitalist invested in innovative biotechnology.', phonemes: ['/b/', '/v/'], difficulty: 'advanced', scenario: 'phoneme_v_vs_b' },
  { id: 'vb_022', text: 'Objective observation reveals various behavioral variables.', phonemes: ['/b/', '/v/'], difficulty: 'advanced', scenario: 'phoneme_v_vs_b' },
  { id: 'vb_023', text: 'The controversial debate involved verbal battles between both parties.', phonemes: ['/v/', '/b/'], difficulty: 'advanced', scenario: 'phoneme_v_vs_b' },
  { id: 'vb_024', text: 'Behavioral psychologists value observable evidence above subjective beliefs.', phonemes: ['/b/', '/v/'], difficulty: 'advanced', scenario: 'phoneme_v_vs_b' },
  { id: 'vb_025', text: 'The brave volunteers provided invaluable support during the crisis.', phonemes: ['/b/', '/v/'], difficulty: 'advanced', scenario: 'phoneme_v_vs_b' },
];

// Lesson 5: Word Stress (25 sentences)
export const phoneme_word_stress: Sentence[] = [
  // Beginner - Noun/Verb pairs (10)
  { id: 'ws_001', text: 'Please REcord the reCORD.', phonemes: ['stress'], difficulty: 'beginner', scenario: 'phoneme_word_stress', context: 'noun_vs_verb' },
  { id: 'ws_002', text: 'The PREsent was preSENTed yesterday.', phonemes: ['stress'], difficulty: 'beginner', scenario: 'phoneme_word_stress', context: 'noun_vs_verb' },
  { id: 'ws_003', text: 'I OBject to that OBject.', phonemes: ['stress'], difficulty: 'beginner', scenario: 'phoneme_word_stress', context: 'noun_vs_verb' },
  { id: 'ws_004', text: 'The CONtest will be conTESTed.', phonemes: ['stress'], difficulty: 'beginner', scenario: 'phoneme_word_stress', context: 'noun_vs_verb' },
  { id: 'ws_005', text: 'We need a PERmit to perMIT this.', phonemes: ['stress'], difficulty: 'beginner', scenario: 'phoneme_word_stress', context: 'noun_vs_verb' },
  { id: 'ws_006', text: 'The CONduct showed good conDUCT.', phonemes: ['stress'], difficulty: 'beginner', scenario: 'phoneme_word_stress', context: 'noun_vs_verb' },
  { id: 'ws_007', text: 'There is a CONflict, so we must conFLICT.', phonemes: ['stress'], difficulty: 'beginner', scenario: 'phoneme_word_stress', context: 'noun_vs_verb' },
  { id: 'ws_008', text: 'The CONtent made me conTENT.', phonemes: ['stress'], difficulty: 'beginner', scenario: 'phoneme_word_stress', context: 'noun_vs_verb' },
  { id: 'ws_009', text: 'The PROduce section proDUCEs fresh food.', phonemes: ['stress'], difficulty: 'beginner', scenario: 'phoneme_word_stress', context: 'noun_vs_verb' },
  { id: 'ws_010', text: 'I refuse to touch the REfuse.', phonemes: ['stress'], difficulty: 'beginner', scenario: 'phoneme_word_stress', context: 'noun_vs_verb' },
  
  // Intermediate - Compound nouns (10)
  { id: 'ws_011', text: 'The GREENhouse is not a green HOUSE.', phonemes: ['stress'], difficulty: 'intermediate', scenario: 'phoneme_word_stress', context: 'compound' },
  { id: 'ws_012', text: 'I saw a BLACKbird, not a black BIRD.', phonemes: ['stress'], difficulty: 'intermediate', scenario: 'phoneme_word_stress', context: 'compound' },
  { id: 'ws_013', text: 'The HOTdog stand sells hot DOGS too.', phonemes: ['stress'], difficulty: 'intermediate', scenario: 'phoneme_word_stress', context: 'compound' },
  { id: 'ws_014', text: 'The PARking lot has a lot of PARking.', phonemes: ['stress'], difficulty: 'intermediate', scenario: 'phoneme_word_stress', context: 'compound' },
  { id: 'ws_015', text: 'My LAptop is on top of my LAP.', phonemes: ['stress'], difficulty: 'intermediate', scenario: 'phoneme_word_stress', context: 'compound' },
  { id: 'ws_016', text: 'The BACKpack is on my BACK.', phonemes: ['stress'], difficulty: 'intermediate', scenario: 'phoneme_word_stress', context: 'compound' },
  { id: 'ws_017', text: 'The SUNshine brings warm SUN.', phonemes: ['stress'], difficulty: 'intermediate', scenario: 'phoneme_word_stress', context: 'compound' },
  { id: 'ws_018', text: 'The FOOTball is at my FEET.', phonemes: ['stress'], difficulty: 'intermediate', scenario: 'phoneme_word_stress', context: 'compound' },
  { id: 'ws_019', text: 'The AIRport has fresh AIR.', phonemes: ['stress'], difficulty: 'intermediate', scenario: 'phoneme_word_stress', context: 'compound' },
  { id: 'ws_020', text: 'The TOOTHbrush cleans my TEETH.', phonemes: ['stress'], difficulty: 'intermediate', scenario: 'phoneme_word_stress', context: 'compound' },
  
  // Advanced - Multi-syllable words (5)
  { id: 'ws_021', text: 'The PHOtograph was taken by the phoTOgrapher using phoTOGraphy.', phonemes: ['stress'], difficulty: 'advanced', scenario: 'phoneme_word_stress', context: 'related_words' },
  { id: 'ws_022', text: 'The ECOnomy is ecoNOMic, but economically speaking, it is ecoNOMical.', phonemes: ['stress'], difficulty: 'advanced', scenario: 'phoneme_word_stress', context: 'related_words' },
  { id: 'ws_023', text: 'DemoCRAcy is demoGRATic, but deMOcratize the DEMocrats.', phonemes: ['stress'], difficulty: 'advanced', scenario: 'phoneme_word_stress', context: 'related_words' },
  { id: 'ws_024', text: 'The TElephone call used teLEPhony and telePHONic equipment.', phonemes: ['stress'], difficulty: 'advanced', scenario: 'phoneme_word_stress', context: 'related_words' },
  { id: 'ws_025', text: 'The BIOlogy class studied bioLOGical processes with biOLogists.', phonemes: ['stress'], difficulty: 'advanced', scenario: 'phoneme_word_stress', context: 'related_words' },
];

// Lesson 6: Silent Letters & Syllables (25 sentences)
export const phoneme_silent_letters: Sentence[] = [
  // Beginner - Silent E (10)
  { id: 'sl_001', text: 'The cake is made with care.', phonemes: ['silent_e'], difficulty: 'beginner', scenario: 'phoneme_silent_letters', context: 'silent_e' },
  { id: 'sl_002', text: 'I hope you like my home.', phonemes: ['silent_e'], difficulty: 'beginner', scenario: 'phoneme_silent_letters', context: 'silent_e' },
  { id: 'sl_003', text: 'The name on the plate is Kate.', phonemes: ['silent_e'], difficulty: 'beginner', scenario: 'phoneme_silent_letters', context: 'silent_e' },
  { id: 'sl_004', text: 'I will write about the white bike.', phonemes: ['silent_e'], difficulty: 'beginner', scenario: 'phoneme_silent_letters', context: 'silent_e' },
  { id: 'sl_005', text: 'The cute duke made a huge mistake.', phonemes: ['silent_e'], difficulty: 'beginner', scenario: 'phoneme_silent_letters', context: 'silent_e' },
  { id: 'sl_006', text: 'I will bake a cake by the lake.', phonemes: ['silent_e'], difficulty: 'beginner', scenario: 'phoneme_silent_letters', context: 'silent_e' },
  { id: 'sl_007', text: 'The smile on her face is nice.', phonemes: ['silent_e'], difficulty: 'beginner', scenario: 'phoneme_silent_letters', context: 'silent_e' },
  { id: 'sl_008', text: 'I chose to use the blue rose.', phonemes: ['silent_e'], difficulty: 'beginner', scenario: 'phoneme_silent_letters', context: 'silent_e' },
  { id: 'sl_009', text: 'The time to dine is nine.', phonemes: ['silent_e'], difficulty: 'beginner', scenario: 'phoneme_silent_letters', context: 'silent_e' },
  { id: 'sl_010', text: 'I drove home alone on the phone.', phonemes: ['silent_e'], difficulty: 'beginner', scenario: 'phoneme_silent_letters', context: 'silent_e' },
  
  // Intermediate - Various silent letters (10)
  { id: 'sl_011', text: 'I know the answer in my knee.', phonemes: ['silent_k'], difficulty: 'intermediate', scenario: 'phoneme_silent_letters', context: 'silent_k' },
  { id: 'sl_012', text: 'The calm palm tree is on the island.', phonemes: ['silent_l'], difficulty: 'intermediate', scenario: 'phoneme_silent_letters', context: 'silent_l' },
  { id: 'sl_013', text: 'I walk and talk on the sidewalk.', phonemes: ['silent_l'], difficulty: 'intermediate', scenario: 'phoneme_silent_letters', context: 'silent_l' },
  { id: 'sl_014', text: 'The honest hour passed in autumn.', phonemes: ['silent_h'], difficulty: 'intermediate', scenario: 'phoneme_silent_letters', context: 'silent_h' },
  { id: 'sl_015', text: 'Listen to the castle whistle softly.', phonemes: ['silent_t'], difficulty: 'intermediate', scenario: 'phoneme_silent_letters', context: 'silent_t' },
  { id: 'sl_016', text: 'The knight knew about the knot.', phonemes: ['silent_k'], difficulty: 'intermediate', scenario: 'phoneme_silent_letters', context: 'silent_k' },
  { id: 'sl_017', text: 'The receipt shows the doubt I bought.', phonemes: ['silent_p', 'silent_b'], difficulty: 'intermediate', scenario: 'phoneme_silent_letters', context: 'silent_p_b' },
  { id: 'sl_018', text: 'The Wednesday answer was wrong.', phonemes: ['silent_d'], difficulty: 'intermediate', scenario: 'phoneme_silent_letters', context: 'silent_d' },
  { id: 'sl_019', text: 'I could walk half the day.', phonemes: ['silent_l'], difficulty: 'intermediate', scenario: 'phoneme_silent_letters', context: 'silent_l' },
  { id: 'sl_020', text: 'The science psychology exam was tough.', phonemes: ['silent_p'], difficulty: 'intermediate', scenario: 'phoneme_silent_letters', context: 'silent_p' },
  
  // Advanced - Complex words (5)
  { id: 'sl_021', text: 'The comptroller acknowledged the pneumonia diagnosis.', phonemes: ['silent_p', 'silent_k'], difficulty: 'advanced', scenario: 'phoneme_silent_letters', context: 'multiple_silent' },
  { id: 'sl_022', text: 'The psychologist exhibited extraordinary knowledge about gnomes.', phonemes: ['silent_p', 'silent_g'], difficulty: 'advanced', scenario: 'phoneme_silent_letters', context: 'multiple_silent' },
  { id: 'sl_023', text: 'The debris caused doubt about the subtle design.', phonemes: ['silent_s', 'silent_b'], difficulty: 'advanced', scenario: 'phoneme_silent_letters', context: 'multiple_silent' },
  { id: 'sl_024', text: 'The rhythmic yacht sailed through the archipelago.', phonemes: ['silent_h'], difficulty: 'advanced', scenario: 'phoneme_silent_letters', context: 'silent_h' },
  { id: 'sl_025', text: 'The colonel knew about the mortgage receipt.', phonemes: ['silent_l', 'silent_t'], difficulty: 'advanced', scenario: 'phoneme_silent_letters', context: 'multiple_silent' },
];

  // ========================================
  // DAILY DRILL (50 sentences - mixed phonemes)
  // ========================================
  
  export const daily_drill: Sentence[] = [
    // Beginner (20 sentences)
    { id: 'dd_001', text: 'I really think this is important.', phonemes: ['/r/', '/θ/'], difficulty: 'beginner', scenario: 'daily_drill' },
    { id: 'dd_002', text: 'The library has very helpful books.', phonemes: ['/l/', '/v/', '/h/'], difficulty: 'beginner', scenario: 'daily_drill' },
    { id: 'dd_003', text: 'Please call me later this afternoon.', phonemes: ['/l/', '/θ/'], difficulty: 'beginner', scenario: 'daily_drill' },
    { id: 'dd_004', text: 'The red car is very fast.', phonemes: ['/r/', '/v/', '/f/'], difficulty: 'beginner', scenario: 'daily_drill' },
    { id: 'dd_005', text: 'The fresh vegetables taste very good.', phonemes: ['/f/', '/v/'], difficulty: 'beginner', scenario: 'daily_drill' },
    { id: 'dd_006', text: 'I like listening to the radio.', phonemes: ['/l/', '/r/'], difficulty: 'beginner', scenario: 'daily_drill' },
    { id: 'dd_007', text: 'Thank you for your help today.', phonemes: ['/θ/', '/h/'], difficulty: 'beginner', scenario: 'daily_drill' },
    { id: 'dd_008', text: 'The weather is really nice.', phonemes: ['/ð/', '/r/'], difficulty: 'beginner', scenario: 'daily_drill' },
    { id: 'dd_009', text: 'I have five friends from London.', phonemes: ['/f/', '/v/', '/l/'], difficulty: 'beginner', scenario: 'daily_drill' },
    { id: 'dd_010', text: 'This book is better than that one.', phonemes: ['/ð/', '/b/'], difficulty: 'beginner', scenario: 'daily_drill' },
    { id: 'dd_011', text: 'The hotel room has a beautiful view.', phonemes: ['/h/', '/v/', '/b/'], difficulty: 'beginner', scenario: 'daily_drill' },
    { id: 'dd_012', text: 'I want to travel around the world.', phonemes: ['/r/', '/l/', '/v/'], difficulty: 'beginner', scenario: 'daily_drill' },
    { id: 'dd_013', text: 'The food here is fresh and healthy.', phonemes: ['/f/', '/h/'], difficulty: 'beginner', scenario: 'daily_drill' },
    { id: 'dd_014', text: 'I like reading before going to bed.', phonemes: ['/l/', '/r/', '/b/'], difficulty: 'beginner', scenario: 'daily_drill' },
    { id: 'dd_015', text: 'Three birds are sitting on the tree.', phonemes: ['/θ/', '/b/'], difficulty: 'beginner', scenario: 'daily_drill' },
    { id: 'dd_016', text: 'The movie theater is very crowded.', phonemes: ['/θ/', '/v/'], difficulty: 'beginner', scenario: 'daily_drill' },
    { id: 'dd_017', text: 'I really love chocolate cake.', phonemes: ['/r/', '/l/'], difficulty: 'beginner', scenario: 'daily_drill' },
    { id: 'dd_018', text: 'Her family lives near the beach.', phonemes: ['/h/', '/f/', '/l/', '/b/'], difficulty: 'beginner', scenario: 'daily_drill' },
    { id: 'dd_019', text: 'The train arrives every half hour.', phonemes: ['/r/', '/v/', '/h/'], difficulty: 'beginner', scenario: 'daily_drill' },
    { id: 'dd_020', text: 'This coffee tastes better with milk.', phonemes: ['/ð/', '/b/', '/l/'], difficulty: 'beginner', scenario: 'daily_drill' },
    
    // Intermediate (20 sentences)
    { id: 'dd_021', text: 'Five brave volunteers arrived Thursday.', phonemes: ['/f/', '/b/', '/v/', '/θ/'], difficulty: 'intermediate', scenario: 'daily_drill' },
    { id: 'dd_022', text: 'I love learning through these lessons.', phonemes: ['/l/', '/r/', '/θ/', '/ð/'], difficulty: 'intermediate', scenario: 'daily_drill' },
    { id: 'dd_023', text: 'The restaurant serves delicious Italian food.', phonemes: ['/r/', '/l/', '/f/'], difficulty: 'intermediate', scenario: 'daily_drill' },
    { id: 'dd_024', text: 'Regular practice really improves pronunciation.', phonemes: ['/r/', '/l/'], difficulty: 'intermediate', scenario: 'daily_drill' },
    { id: 'dd_025', text: 'The lecture about history was fascinating.', phonemes: ['/l/', '/h/', '/f/'], difficulty: 'intermediate', scenario: 'daily_drill' },
    { id: 'dd_026', text: 'I prefer traveling by train rather than bus.', phonemes: ['/r/', '/v/', '/b/'], difficulty: 'intermediate', scenario: 'daily_drill' },
    { id: 'dd_027', text: 'The hospital provides excellent healthcare services.', phonemes: ['/h/', '/v/', '/θ/'], difficulty: 'intermediate', scenario: 'daily_drill' },
    { id: 'dd_028', text: 'Please deliver the package before Thursday.', phonemes: ['/l/', '/v/', '/θ/'], difficulty: 'intermediate', scenario: 'daily_drill' },
    { id: 'dd_029', text: 'The conference will feature several international speakers.', phonemes: ['/f/', '/v/', '/r/', '/l/'], difficulty: 'intermediate', scenario: 'daily_drill' },
    { id: 'dd_030', text: 'I thoroughly enjoyed the theatrical performance.', phonemes: ['/θ/', '/ð/'], difficulty: 'intermediate', scenario: 'daily_drill' },
    { id: 'dd_031', text: 'The valuable collection includes rare photographs.', phonemes: ['/v/', '/l/', '/r/', '/f/'], difficulty: 'intermediate', scenario: 'daily_drill' },
    { id: 'dd_032', text: 'Regular exercise and healthy food improve life quality.', phonemes: ['/r/', '/l/', '/h/', '/f/'], difficulty: 'intermediate', scenario: 'daily_drill' },
    { id: 'dd_033', text: 'The comfortable hotel overlooks the beautiful harbor.', phonemes: ['/f/', '/h/', '/l/', '/b/'], difficulty: 'intermediate', scenario: 'daily_drill' },
    { id: 'dd_034', text: 'I believe practice leads to better results.', phonemes: ['/b/', '/l/', '/v/', '/r/'], difficulty: 'intermediate', scenario: 'daily_drill' },
    { id: 'dd_035', text: 'The library offers free internet access for visitors.', phonemes: ['/l/', '/f/', '/r/', '/v/'], difficulty: 'intermediate', scenario: 'daily_drill' },
    { id: 'dd_036', text: 'Fresh vegetables and fruit provide essential vitamins.', phonemes: ['/f/', '/v/', '/r/'], difficulty: 'intermediate', scenario: 'daily_drill' },
    { id: 'dd_037', text: 'The weather forecast predicts rain throughout the week.', phonemes: ['/ð/', '/f/', '/r/', '/θ/'], difficulty: 'intermediate', scenario: 'daily_drill' },
    { id: 'dd_038', text: 'I highly recommend visiting the historical museum.', phonemes: ['/h/', '/r/', '/v/', '/l/'], difficulty: 'intermediate', scenario: 'daily_drill' },
    { id: 'dd_039', text: 'The volleyball team practiced every Thursday afternoon.', phonemes: ['/v/', '/l/', '/b/', '/θ/'], difficulty: 'intermediate', scenario: 'daily_drill' },
    { id: 'dd_040', text: 'Several international students arrived last November.', phonemes: ['/v/', '/r/', '/l/'], difficulty: 'intermediate', scenario: 'daily_drill' },
    
    // Advanced (10 sentences)
    { id: 'dd_041', text: 'The revolutionary technology fundamentally transformed business operations.', phonemes: ['/r/', '/l/', '/v/', '/f/', '/b/'], difficulty: 'advanced', scenario: 'daily_drill' },
    { id: 'dd_042', text: 'Behavioral psychologists carefully analyze various environmental factors.', phonemes: ['/b/', '/v/', '/l/', '/r/', '/f/'], difficulty: 'advanced', scenario: 'daily_drill' },
    { id: 'dd_043', text: 'The influential philosopher thoroughly explored ethical theories.', phonemes: ['/f/', '/l/', '/θ/', '/r/'], difficulty: 'advanced', scenario: 'daily_drill' },
    { id: 'dd_044', text: 'International collaboration facilitates valuable research breakthroughs.', phonemes: ['/l/', '/b/', '/f/', '/v/', '/r/', '/θ/'], difficulty: 'advanced', scenario: 'daily_drill' },
    { id: 'dd_045', text: 'The comprehensive analysis revealed several critical variables.', phonemes: ['/r/', '/v/', '/l/'], difficulty: 'advanced', scenario: 'daily_drill' },
    { id: 'dd_046', text: 'Environmental sustainability requires collaborative efforts worldwide.', phonemes: ['/v/', '/r/', '/l/', '/b/', '/θ/'], difficulty: 'advanced', scenario: 'daily_drill' },
    { id: 'dd_047', text: 'The therapeutic approach effectively addresses behavioral challenges.', phonemes: ['/θ/', '/v/', '/b/', '/l/'], difficulty: 'advanced', scenario: 'daily_drill' },
    { id: 'dd_048', text: 'Preliminary research indicates promising results for future development.', phonemes: ['/r/', '/l/', '/f/', '/v/'], difficulty: 'advanced', scenario: 'daily_drill' },
    { id: 'dd_049', text: 'The pharmaceutical industry invests heavily in research laboratories.', phonemes: ['/f/', '/r/', '/l/', '/v/', '/h/'], difficulty: 'advanced', scenario: 'daily_drill' },
    { id: 'dd_050', text: 'Revolutionary innovations frequently challenge traditional belief systems.', phonemes: ['/r/', '/v/', '/l/', '/f/', '/b/'], difficulty: 'advanced', scenario: 'daily_drill' },
  ];
  
  // ========================================
  // TOEIC SPEAKING (100 sentences)
  // ========================================
  
  export const toeic_speaking: Sentence[] = [
    // Read Aloud (30 sentences)
    { id: 'toeic_001', text: 'The meeting will be held in Conference Room Three on Thursday afternoon.', phonemes: ['/θ/', '/r/'], difficulty: 'intermediate', scenario: 'toeic', context: 'read_aloud' },
    { id: 'toeic_002', text: 'Please submit your report before the deadline this Friday.', phonemes: ['/r/', '/θ/'], difficulty: 'intermediate', scenario: 'toeic', context: 'read_aloud' },
    { id: 'toeic_003', text: 'The company values both innovation and reliability in our products.', phonemes: ['/v/', '/b/', '/r/'], difficulty: 'intermediate', scenario: 'toeic', context: 'read_aloud' },
    { id: 'toeic_004', text: 'All employees are required to attend the training session next Thursday.', phonemes: ['/r/', '/θ/'], difficulty: 'intermediate', scenario: 'toeic', context: 'read_aloud' },
    { id: 'toeic_005', text: 'The quarterly results will be available on our website later today.', phonemes: ['/r/', '/l/', '/v/'], difficulty: 'intermediate', scenario: 'toeic', context: 'read_aloud' },
    { id: 'toeic_006', text: 'Please review the attached documents carefully before the meeting.', phonemes: ['/r/', '/v/', '/f/'], difficulty: 'intermediate', scenario: 'toeic', context: 'read_aloud' },
    { id: 'toeic_007', text: 'Our customer service department operates from nine to five every day.', phonemes: ['/v/', '/f/'], difficulty: 'intermediate', scenario: 'toeic', context: 'read_aloud' },
    { id: 'toeic_008', text: 'The new policy will be effective from the first of March.', phonemes: ['/f/', '/θ/'], difficulty: 'intermediate', scenario: 'toeic', context: 'read_aloud' },
    { id: 'toeic_009', text: 'We are pleased to announce three new products launching this quarter.', phonemes: ['/θ/', '/r/'], difficulty: 'intermediate', scenario: 'toeic', context: 'read_aloud' },
    { id: 'toeic_010', text: 'The conference registration fee includes lunch and refreshments.', phonemes: ['/f/', '/r/', '/l/'], difficulty: 'intermediate', scenario: 'toeic', context: 'read_aloud' },
    { id: 'toeic_011', text: 'Please arrive at least fifteen minutes before your scheduled appointment.', phonemes: ['/r/', '/v/', '/f/'], difficulty: 'intermediate', scenario: 'toeic', context: 'read_aloud' },
    { id: 'toeic_012', text: 'The research team published their findings in several academic journals.', phonemes: ['/r/', '/θ/', '/v/', '/l/'], difficulty: 'intermediate', scenario: 'toeic', context: 'read_aloud' },
    { id: 'toeic_013', text: 'International travelers must present valid identification at check-in.', phonemes: ['/r/', '/l/', '/v/'], difficulty: 'intermediate', scenario: 'toeic', context: 'read_aloud' },
    { id: 'toeic_014', text: 'The library will be closed for renovations throughout the month.', phonemes: ['/l/', '/θ/'], difficulty: 'intermediate', scenario: 'toeic', context: 'read_aloud' },
    { id: 'toeic_015', text: 'Please forward all inquiries to our main office in London.', phonemes: ['/f/', '/r/', '/l/'], difficulty: 'intermediate', scenario: 'toeic', context: 'read_aloud' },
    { id: 'toeic_016', text: 'The hotel provides complimentary breakfast for all registered guests.', phonemes: ['/h/', '/v/', '/r/', '/b/'], difficulty: 'intermediate', scenario: 'toeic', context: 'read_aloud' },
    { id: 'toeic_017', text: 'Regular maintenance ensures optimal performance of all equipment.', phonemes: ['/r/', '/l/', '/f/'], difficulty: 'intermediate', scenario: 'toeic', context: 'read_aloud' },
    { id: 'toeic_018', text: 'The application deadline has been extended until the end of November.', phonemes: ['/v/', '/θ/'], difficulty: 'intermediate', scenario: 'toeic', context: 'read_aloud' },
    { id: 'toeic_019', text: 'All visitors must register at the front desk before entering.', phonemes: ['/v/', '/r/', '/f/'], difficulty: 'intermediate', scenario: 'toeic', context: 'read_aloud' },
    { id: 'toeic_020', text: 'The sales department exceeded their quarterly targets by thirty percent.', phonemes: ['/θ/', '/r/'], difficulty: 'intermediate', scenario: 'toeic', context: 'read_aloud' },
    { id: 'toeic_021', text: 'Please confirm your attendance by replying to this email.', phonemes: ['/f/', '/r/', '/l/'], difficulty: 'intermediate', scenario: 'toeic', context: 'read_aloud' },
    { id: 'toeic_022', text: 'The training program covers both theoretical and practical aspects.', phonemes: ['/θ/', '/b/', '/v/'], difficulty: 'intermediate', scenario: 'toeic', context: 'read_aloud' },
    { id: 'toeic_023', text: 'Our delivery service operates throughout the metropolitan area.', phonemes: ['/v/', '/θ/', '/r/'], difficulty: 'intermediate', scenario: 'toeic', context: 'read_aloud' },
    { id: 'toeic_024', text: 'The annual budget review will take place in early February.', phonemes: ['/r/', '/v/', '/f/', '/b/'], difficulty: 'intermediate', scenario: 'toeic', context: 'read_aloud' },
    { id: 'toeic_025', text: 'International shipping usually takes between seven and ten business days.', phonemes: ['/b/', '/v/', '/θ/'], difficulty: 'intermediate', scenario: 'toeic', context: 'read_aloud' },
    { id: 'toeic_026', text: 'The board of directors approved the proposal unanimously.', phonemes: ['/b/', '/v/', '/r/'], difficulty: 'intermediate', scenario: 'toeic', context: 'read_aloud' },
    { id: 'toeic_027', text: 'Please feel free to contact us if you have any further questions.', phonemes: ['/f/', '/v/', '/θ/'], difficulty: 'intermediate', scenario: 'toeic', context: 'read_aloud' },
    { id: 'toeic_028', text: 'The research facility is located approximately three miles from here.', phonemes: ['/r/', '/f/', '/l/', '/θ/'], difficulty: 'intermediate', scenario: 'toeic', context: 'read_aloud' },
    { id: 'toeic_029', text: 'All staff members are encouraged to participate in the voluntary survey.', phonemes: ['/v/', '/r/', '/l/'], difficulty: 'intermediate', scenario: 'toeic', context: 'read_aloud' },
    { id: 'toeic_030', text: 'The revised schedule will be distributed to everyone by email tomorrow.', phonemes: ['/r/', '/v/', '/b/'], difficulty: 'intermediate', scenario: 'toeic', context: 'read_aloud' },
    
    // Describe Picture (30 sentences)
    { id: 'toeic_031', text: 'In this photograph, three people are having a business discussion.', phonemes: ['/θ/', '/f/', '/b/'], difficulty: 'intermediate', scenario: 'toeic', context: 'describe_picture' },
    { id: 'toeic_032', text: 'Several employees are gathered around the conference table.', phonemes: ['/v/', '/r/'], difficulty: 'intermediate', scenario: 'toeic', context: 'describe_picture' },
    { id: 'toeic_033', text: 'A woman is presenting information on a large screen.', phonemes: ['/l/', '/r/'], difficulty: 'intermediate', scenario: 'toeic', context: 'describe_picture' },
    { id: 'toeic_034', text: 'Two colleagues are reviewing documents together at their desks.', phonemes: ['/r/', '/v/', '/ð/'], difficulty: 'intermediate', scenario: 'toeic', context: 'describe_picture' },
    { id: 'toeic_035', text: 'The office appears to be bright and very modern.', phonemes: ['/v/', '/b/', '/r/'], difficulty: 'intermediate', scenario: 'toeic', context: 'describe_picture' },
    { id: 'toeic_036', text: 'People are sitting in a meeting room listening carefully.', phonemes: ['/l/', '/r/'], difficulty: 'intermediate', scenario: 'toeic', context: 'describe_picture' },
    { id: 'toeic_037', text: 'A man is talking on the phone while looking at his computer.', phonemes: ['/θ/', '/l/', '/f/'], difficulty: 'intermediate', scenario: 'toeic', context: 'describe_picture' },
    { id: 'toeic_038', text: 'Several customers are browsing products in the retail store.', phonemes: ['/v/', '/r/', '/b/'], difficulty: 'intermediate', scenario: 'toeic', context: 'describe_picture' },
    { id: 'toeic_039', text: 'The receptionist is helping a visitor at the front desk.', phonemes: ['/h/', '/v/', '/f/'], difficulty: 'intermediate', scenario: 'toeic', context: 'describe_picture' },
    { id: 'toeic_040', text: 'Employees are working collaboratively in an open office environment.', phonemes: ['/l/', '/b/', '/v/'], difficulty: 'intermediate', scenario: 'toeic', context: 'describe_picture' },
    { id: 'toeic_041', text: 'A group of professionals are attending a training session.', phonemes: ['/r/', '/f/', '/θ/'], difficulty: 'intermediate', scenario: 'toeic', context: 'describe_picture' },
    { id: 'toeic_042', text: 'The warehouse workers are organizing inventory on the shelves.', phonemes: ['/r/', '/v/', '/ð/'], difficulty: 'intermediate', scenario: 'toeic', context: 'describe_picture' },
    { id: 'toeic_043', text: 'People are having lunch together in the company cafeteria.', phonemes: ['/h/', '/v/', '/ð/'], difficulty: 'intermediate', scenario: 'toeic', context: 'describe_picture' },
    { id: 'toeic_044', text: 'A delivery person is bringing packages to the building.', phonemes: ['/v/', '/r/', '/b/'], difficulty: 'intermediate', scenario: 'toeic', context: 'describe_picture' },
    { id: 'toeic_045', text: 'The team members are celebrating their successful project completion.', phonemes: ['/θ/', '/f/', '/l/'], difficulty: 'intermediate', scenario: 'toeic', context: 'describe_picture' },
    { id: 'toeic_046', text: 'Someone is cleaning the office floor with professional equipment.', phonemes: ['/f/', '/l/', '/θ/'], difficulty: 'intermediate', scenario: 'toeic', context: 'describe_picture' },
    { id: 'toeic_047', text: 'The conference room is filled with people watching the presentation.', phonemes: ['/f/', '/θ/', '/ð/'], difficulty: 'intermediate', scenario: 'toeic', context: 'describe_picture' },
    { id: 'toeic_048', text: 'A businessman is reading reports on his tablet device.', phonemes: ['/r/', '/b/', '/h/'], difficulty: 'intermediate', scenario: 'toeic', context: 'describe_picture' },
    { id: 'toeic_049', text: 'Several technicians are installing new computer systems.', phonemes: ['/v/', '/r/', '/l/'], difficulty: 'intermediate', scenario: 'toeic', context: 'describe_picture' },
    { id: 'toeic_050', text: 'The manager is interviewing a candidate for the vacant position.', phonemes: ['/v/', '/f/', '/θ/'], difficulty: 'intermediate', scenario: 'toeic', context: 'describe_picture' },
    { id: 'toeic_051', text: 'People are waiting in line at the customer service counter.', phonemes: ['/l/', '/v/'], difficulty: 'intermediate', scenario: 'toeic', context: 'describe_picture' },
    { id: 'toeic_052', text: 'The architect is reviewing building plans with the construction team.', phonemes: ['/r/', '/v/', '/θ/', '/b/'], difficulty: 'intermediate', scenario: 'toeic', context: 'describe_picture' },
    { id: 'toeic_053', text: 'Staff members are preparing materials for the upcoming event.', phonemes: ['/f/', '/r/', '/v/'], difficulty: 'intermediate', scenario: 'toeic', context: 'describe_picture' },
    { id: 'toeic_054', text: 'The factory workers are operating machinery on the production line.', phonemes: ['/f/', '/r/', '/l/'], difficulty: 'intermediate', scenario: 'toeic', context: 'describe_picture' },
    { id: 'toeic_055', text: 'A salesperson is demonstrating the product to potential buyers.', phonemes: ['/r/', '/b/'], difficulty: 'intermediate', scenario: 'toeic', context: 'describe_picture' },
    { id: 'toeic_056', text: 'The security guard is checking identification at the entrance.', phonemes: ['/ð/', '/θ/'], difficulty: 'intermediate', scenario: 'toeic', context: 'describe_picture' },
    { id: 'toeic_057', text: 'Researchers are conducting experiments in the laboratory environment.', phonemes: ['/r/', '/v/', '/l/'], difficulty: 'intermediate', scenario: 'toeic', context: 'describe_picture' },
    { id: 'toeic_058', text: 'The accountant is carefully reviewing the financial statements.', phonemes: ['/r/', '/v/', '/f/'], difficulty: 'intermediate', scenario: 'toeic', context: 'describe_picture' },
    { id: 'toeic_059', text: 'Passengers are boarding the airplane through the terminal gate.', phonemes: ['/θ/', '/r/'], difficulty: 'intermediate', scenario: 'toeic', context: 'describe_picture' },
    { id: 'toeic_060', text: 'The volunteers are helping organize books in the library.', phonemes: ['/v/', '/l/', '/h/', '/r/'], difficulty: 'intermediate', scenario: 'toeic', context: 'describe_picture' },
    
    // Respond to Questions - Opinion (20 sentences)
    { id: 'toeic_061', text: 'I think the proposal has both advantages and disadvantages.', phonemes: ['/θ/', '/v/', '/b/'], difficulty: 'intermediate', scenario: 'toeic', context: 'opinion' },
    { id: 'toeic_062', text: 'In my opinion, regular training improves employee performance.', phonemes: ['/r/', '/l/'], difficulty: 'intermediate', scenario: 'toeic', context: 'opinion' },
    { id: 'toeic_063', text: 'I believe flexible working hours benefit both employers and employees.', phonemes: ['/b/', '/l/', '/f/', '/b/'], difficulty: 'intermediate', scenario: 'toeic', context: 'opinion' },
    { id: 'toeic_064', text: 'From my perspective, effective communication is vital for success.', phonemes: ['/f/', '/v/', '/f/'], difficulty: 'intermediate', scenario: 'toeic', context: 'opinion' },
    { id: 'toeic_065', text: 'I feel that environmental responsibility should be a priority.', phonemes: ['/f/', '/v/', '/r/', '/θ/'], difficulty: 'intermediate', scenario: 'toeic', context: 'opinion' },
    { id: 'toeic_066', text: 'In my view, teamwork leads to better results than working alone.', phonemes: ['/v/', '/l/', '/b/', '/r/', '/θ/'], difficulty: 'intermediate', scenario: 'toeic', context: 'opinion' },
    { id: 'toeic_067', text: 'I think customer feedback provides valuable insights for improvement.', phonemes: ['/θ/', '/f/', '/v/', '/f/'], difficulty: 'intermediate', scenario: 'toeic', context: 'opinion' },
    { id: 'toeic_068', text: 'I believe technology has greatly improved workplace efficiency.', phonemes: ['/b/', '/l/', '/r/', '/v/', '/f/'], difficulty: 'intermediate', scenario: 'toeic', context: 'opinion' },
    { id: 'toeic_069', text: 'From my experience, professional development is very important for careers.', phonemes: ['/f/', '/v/', '/r/', '/f/', '/v/'], difficulty: 'intermediate', scenario: 'toeic', context: 'opinion' },
    { id: 'toeic_070', text: 'I strongly believe that diversity strengthens organizations overall.', phonemes: ['/b/', '/l/', '/v/', '/θ/', '/r/', '/v/', '/l/'], difficulty: 'intermediate', scenario: 'toeic', context: 'opinion' },
    { id: 'toeic_071', text: 'In my opinion, work-life balance is essential for employee wellbeing.', phonemes: ['/l/', '/b/', '/f/', '/l/', '/b/'], difficulty: 'intermediate', scenario: 'toeic', context: 'opinion' },
    { id: 'toeic_072', text: 'I think investing in employee training brings long-term benefits.', phonemes: ['/θ/', '/v/', '/r/', '/b/', '/l/', '/b/'], difficulty: 'intermediate', scenario: 'toeic', context: 'opinion' },
    { id: 'toeic_073', text: 'From my perspective, clear leadership direction is crucial for teams.', phonemes: ['/f/', '/l/', '/r/', '/f/', '/r/'], difficulty: 'intermediate', scenario: 'toeic', context: 'opinion' },
    { id: 'toeic_074', text: 'I believe remote work offers flexibility without reducing productivity.', phonemes: ['/b/', '/l/', '/v/', '/f/', '/r/', '/θ/'], difficulty: 'intermediate', scenario: 'toeic', context: 'opinion' },
    { id: 'toeic_075', text: 'In my view, innovation requires both creativity and practical thinking.', phonemes: ['/v/', '/v/', '/r/', '/b/', '/θ/', '/v/', '/θ/'], difficulty: 'intermediate', scenario: 'toeic', context: 'opinion' },
    { id: 'toeic_076', text: 'I think mentorship programs help develop future leaders effectively.', phonemes: ['/θ/', '/h/', '/v/', '/l/', '/f/', '/v/'], difficulty: 'intermediate', scenario: 'toeic', context: 'opinion' },
    { id: 'toeic_077', text: 'I believe quality should always take priority over quantity.', phonemes: ['/b/', '/l/', '/θ/', '/l/', '/v/', '/r/', '/θ/'], difficulty: 'intermediate', scenario: 'toeic', context: 'opinion' },
    { id: 'toeic_078', text: 'From my experience, collaboration produces better results than competition.', phonemes: ['/f/', '/l/', '/b/', '/r/', '/θ/', '/b/'], difficulty: 'intermediate', scenario: 'toeic', context: 'opinion' },
    { id: 'toeic_079', text: 'I think sustainable business practices benefit society and profitability.', phonemes: ['/θ/', '/b/', '/f/', '/b/', '/f/'], difficulty: 'intermediate', scenario: 'toeic', context: 'opinion' },
    { id: 'toeic_080', text: 'In my opinion, continuous learning is vital in our changing world.', phonemes: ['/l/', '/v/', '/r/', '/θ/'], difficulty: 'intermediate', scenario: 'toeic', context: 'opinion' },
    
    // Propose Solution (20 sentences)
    { id: 'toeic_081', text: 'I would recommend scheduling a follow-up meeting to discuss this further.', phonemes: ['/r/', '/f/', '/θ/'], difficulty: 'advanced', scenario: 'toeic', context: 'solution' },
    { id: 'toeic_082', text: 'One solution would be to revise the current procedures thoroughly.', phonemes: ['/v/', '/r/', '/v/', '/θ/', '/r/', '/θ/'], difficulty: 'advanced', scenario: 'toeic', context: 'solution' },
    { id: 'toeic_083', text: 'I suggest we implement a trial period before making final decisions.', phonemes: ['/l/', '/b/', '/f/'], difficulty: 'advanced', scenario: 'toeic', context: 'solution' },
    { id: 'toeic_084', text: 'Perhaps we could allocate additional resources to resolve this issue.', phonemes: ['/r/', '/v/', '/θ/'], difficulty: 'advanced', scenario: 'toeic', context: 'solution' },
    { id: 'toeic_085', text: 'I propose developing a comprehensive training program for all staff.', phonemes: ['/v/', '/h/', '/f/', '/r/', '/l/'], difficulty: 'advanced', scenario: 'toeic', context: 'solution' },
    { id: 'toeic_086', text: 'We should consider bringing in external consultants for their expertise.', phonemes: ['/b/', '/r/', '/f/', '/r/', '/θ/'], difficulty: 'advanced', scenario: 'toeic', context: 'solution' },
    { id: 'toeic_087', text: 'I would advise creating clearer communication channels between departments.', phonemes: ['/v/', '/r/', '/l/', '/b/'], difficulty: 'advanced', scenario: 'toeic', context: 'solution' },
    { id: 'toeic_088', text: 'One effective approach would be to establish regular feedback sessions.', phonemes: ['/f/', '/v/', '/f/', '/b/', '/r/', '/f/', '/b/'], difficulty: 'advanced', scenario: 'toeic', context: 'solution' },
    { id: 'toeic_089', text: 'I suggest reviewing our current strategy and revising it accordingly.', phonemes: ['/r/', '/v/', '/r/', '/v/', '/r/'], difficulty: 'advanced', scenario: 'toeic', context: 'solution' },
    { id: 'toeic_090', text: 'We could improve efficiency by streamlining the approval process.', phonemes: ['/v/', '/f/', '/b/', '/r/', '/l/', '/v/', '/r/'], difficulty: 'advanced', scenario: 'toeic', context: 'solution' },
    { id: 'toeic_091', text: 'I recommend investing in better technology to solve these problems.', phonemes: ['/v/', '/b/', '/v/', '/θ/', '/r/', '/b/'], difficulty: 'advanced', scenario: 'toeic', context: 'solution' },
    { id: 'toeic_092', text: 'Perhaps we should conduct a thorough analysis before proceeding further.', phonemes: ['/θ/', '/r/', '/b/', '/f/', '/θ/'], difficulty: 'advanced', scenario: 'toeic', context: 'solution' },
    { id: 'toeic_093', text: 'I propose organizing a workshop to address these concerns collectively.', phonemes: ['/r/', '/r/', '/ð/', '/l/', '/v/'], difficulty: 'advanced', scenario: 'toeic', context: 'solution' },
    { id: 'toeic_094', text: 'We should establish clear guidelines and distribute them to everyone.', phonemes: ['/b/', '/l/', '/r/', '/b/', '/v/'], difficulty: 'advanced', scenario: 'toeic', context: 'solution' },
    { id: 'toeic_095', text: 'I would suggest hiring additional personnel to handle the increased workload.', phonemes: ['/h/', '/r/', '/ð/', '/h/', '/l/'], difficulty: 'advanced', scenario: 'toeic', context: 'solution' },
    { id: 'toeic_096', text: 'One practical solution involves restructuring the current team organization.', phonemes: ['/r/', '/v/', '/v/', '/r/', '/r/', '/r/'], difficulty: 'advanced', scenario: 'toeic', context: 'solution' },
    { id: 'toeic_097', text: 'I recommend developing partnerships with other companies for better results.', phonemes: ['/v/', '/r/', '/θ/', '/b/', '/r/'], difficulty: 'advanced', scenario: 'toeic', context: 'solution' },
    { id: 'toeic_098', text: 'We could enhance performance by providing regular professional development opportunities.', phonemes: ['/v/', '/r/', '/f/', '/r/', '/v/', '/r/', '/f/', '/v/'], difficulty: 'advanced', scenario: 'toeic', context: 'solution' },
    { id: 'toeic_099', text: 'I suggest implementing new quality control measures throughout the process.', phonemes: ['/l/', '/θ/', '/r/', '/θ/', '/r/'], difficulty: 'advanced', scenario: 'toeic', context: 'solution' },
    { id: 'toeic_100', text: 'Perhaps we should reconsider our approach and explore alternative solutions.', phonemes: ['/r/', '/r/', '/r/', '/l/', '/r/', '/l/'], difficulty: 'advanced', scenario: 'toeic', context: 'solution' },
  ];
  

// ========================================
// EXPORT ALL SENTENCES
// ========================================

export const ALL_CORE_SENTENCES: Sentence[] = [
  ...phoneme_r_vs_l,
  ...phoneme_th_sounds,
  ...phoneme_f_vs_h,
  ...phoneme_v_vs_b,
  ...phoneme_word_stress,
  ...phoneme_silent_letters,
  ...daily_drill,
  ...toeic_speaking,
];

// Helper function to get sentences by scenario
export function getSentencesByScenario(scenario: string): Sentence[] {
  return ALL_CORE_SENTENCES.filter(s => s.scenario === scenario);
}

// Helper function to get sentences by difficulty
export function getSentencesByDifficulty(
  scenario: string,
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): Sentence[] {
  return ALL_CORE_SENTENCES.filter(
    s => s.scenario === scenario && s.difficulty === difficulty
  );
}
