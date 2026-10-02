const icon = require('./icons.cjs');
const skills = ['UI/UX Design', 'Product Design', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Interaction Design', 'Responsive Design', 'AI Workflows', 'Visual Design'];
module.exports = () => `<section class="skills-playground section container" id="skills" aria-labelledby="skills-title">
  <div class="skills-intro"><p class="eyebrow"><span class="dot" aria-hidden="true"></span>THE SKILLS BEHIND THE WORK</p><h2 class="section-heading" id="skills-title">A little craft.<br>A lot of possibility.</h2><p>From the first question to the final interaction.<br>These are the skills I bring to the table.</p></div>
  <div class="skills-arena" data-skills-arena role="group" aria-label="Interactive design skills" aria-describedby="skills-help">${skills.map((skill,i)=>`<button type="button" class="skill-pill${i%4===0?' is-orange':''}" aria-describedby="skills-help">${icon(['layout-grid','perspective','route','plus','arrow-up-right'][i%5])}<span>${skill}</span></button>`).join('')}</div>
  <div class="skills-bottom"><p id="skills-help">My design toolkit, always growing.</p><button type="button" class="skills-reset" data-skills-reset hidden>Reset pills${icon('arrow-right')}</button></div>
  <span class="sr-only" role="status" data-skills-status></span>
</section>`;
