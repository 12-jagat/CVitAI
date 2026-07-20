import React from 'react';
import { Resume } from '../types';

interface TemplateProps {
  data: Resume;
  accent: { primary: string; text: string; bg: string; border: string; badge: string; textDark?: string };
}

const colorMap: Record<string, { primary: string; text: string; bg: string; border: string; badge: string; textDark?: string }> = {
  rose: { primary: 'text-rose-600', text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-600', badge: 'bg-rose-50 text-rose-700 border-rose-200', textDark: 'text-rose-800' },
  emerald: { primary: 'text-emerald-600', text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-600', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', textDark: 'text-emerald-800' },
  indigo: { primary: 'text-indigo-600', text: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-600', badge: 'bg-indigo-50 text-indigo-700 border-indigo-200', textDark: 'text-indigo-800' },
  amber: { primary: 'text-amber-600', text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-600', badge: 'bg-amber-50 text-amber-700 border-amber-200', textDark: 'text-amber-800' },
  slate: { primary: 'text-slate-700', text: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-700', badge: 'bg-slate-50 text-slate-700 border-slate-200', textDark: 'text-slate-800' },
};

export const ModernTemplate: React.FC<TemplateProps> = ({ data, accent }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, achievements } = data;
  const fullName = `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`.trim() || 'Your Name';

  return (
    <div className="bg-white p-8 max-w-[21cm] min-h-[29.7cm] flex flex-col justify-between h-full border border-slate-100 shadow-md text-inherit">
      <div>
        {/* Header Section */}
        <div className={`border-b-2 ${accent.border} pb-6 mb-6`}>
          <h1 className="text-3xl font-extrabold tracking-tight uppercase text-inherit">{fullName}</h1>
          <p className={`${accent.text} font-bold text-sm uppercase tracking-wider mt-1`}>{personalInfo.jobTitle || 'Target Job Title'}</p>
          
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs opacity-70 mt-4 text-inherit">
            {personalInfo.email && <span>Email: {personalInfo.email}</span>}
            {personalInfo.phone && <span>Phone: {personalInfo.phone}</span>}
            {personalInfo.location && <span>Location: {personalInfo.location}</span>}
            {personalInfo.website && <span>Web: {personalInfo.website}</span>}
            {personalInfo.linkedin && <span>LinkedIn: {personalInfo.linkedin}</span>}
            {personalInfo.github && <span>GitHub: {personalInfo.github}</span>}
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-12 gap-8 text-left text-inherit">
          {/* Main Panel */}
          <div className="col-span-8 space-y-6 text-inherit">
            {summary && (
              <div>
                <h2 className={`text-xs font-extrabold uppercase tracking-widest ${accent.text} border-b border-slate-200 pb-1 mb-2`}>Professional Summary</h2>
                <p className="text-xs leading-relaxed opacity-95 whitespace-pre-line text-inherit">{summary}</p>
              </div>
            )}

            {experience && experience.length > 0 && (
              <div className="text-inherit">
                <h2 className={`text-xs font-extrabold uppercase tracking-widest ${accent.text} border-b border-slate-200 pb-1 mb-3`}>Work History</h2>
                <div className="space-y-4 text-inherit">
                  {experience.map((exp, idx) => (
                    <div key={idx} className="space-y-1 text-inherit">
                      <div className="flex justify-between items-baseline text-inherit">
                        <h3 className="text-xs font-extrabold text-inherit">{exp.position}</h3>
                        <span className="text-[10px] font-bold opacity-70 text-inherit">
                          {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline text-[10px] font-semibold opacity-85 text-inherit">
                        <span>{exp.company}</span>
                        {exp.location && <span>{exp.location}</span>}
                      </div>
                      <p className="text-[10px] leading-relaxed opacity-80 whitespace-pre-line pl-2 border-l border-slate-250 text-inherit">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {projects && projects.length > 0 && (
              <div className="text-inherit">
                <h2 className={`text-xs font-extrabold uppercase tracking-widest ${accent.text} border-b border-slate-200 pb-1 mb-3`}>Key Projects</h2>
                <div className="space-y-4 text-inherit">
                  {projects.map((proj, idx) => (
                    <div key={idx} className="space-y-1 text-inherit">
                      <div className="flex justify-between items-baseline text-inherit">
                        <h3 className="text-xs font-extrabold text-inherit">{proj.name}</h3>
                        {proj.startDate && (
                          <span className="text-[10px] font-bold opacity-70 text-inherit">
                            {proj.startDate} {proj.endDate ? `– ${proj.endDate}` : ''}
                          </span>
                        )}
                      </div>
                      {proj.role && <div className={`text-[10px] font-bold ${accent.text}`}>{proj.role}</div>}
                      <p className="text-[10px] leading-relaxed opacity-80 whitespace-pre-line pl-2 border-l border-slate-200 text-inherit">
                        {proj.description}
                      </p>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="text-[9px] font-semibold opacity-70 pt-1 text-inherit">
                          Technologies: {proj.technologies.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Panel */}
          <div className="col-span-4 space-y-6 text-inherit">
            {skills && skills.length > 0 && (
              <div>
                <h2 className={`text-xs font-extrabold uppercase tracking-widest ${accent.text} border-b border-slate-200 pb-1 mb-3`}>Expertise</h2>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill, idx) => (
                    <span key={idx} className={`border ${accent.badge} text-[10px] font-bold px-2 py-0.5 rounded`}>
                      {skill.name} {skill.level ? `(${skill.level})` : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {education && education.length > 0 && (
              <div className="text-inherit">
                <h2 className={`text-xs font-extrabold uppercase tracking-widest ${accent.text} border-b border-slate-200 pb-1 mb-3`}>Education</h2>
                <div className="space-y-3 text-inherit">
                  {education.map((edu, idx) => (
                    <div key={idx} className="space-y-0.5 text-xs text-inherit">
                      <h3 className="text-xs font-extrabold text-inherit">{edu.degree}</h3>
                      <div className="text-[10px] font-bold opacity-90 text-inherit">{edu.fieldOfStudy}</div>
                      <div className="text-[10px] font-semibold opacity-80 text-inherit">{edu.school}</div>
                      <div className="text-[9px] font-bold opacity-70 text-inherit">
                        {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                      </div>
                      {edu.gpa && <div className="text-[9px] font-bold opacity-75 text-inherit">GPA: {edu.gpa}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {certifications && certifications.length > 0 && (
              <div className="text-inherit">
                <h2 className={`text-xs font-extrabold uppercase tracking-widest ${accent.text} border-b border-slate-200 pb-1 mb-3`}>Credentials</h2>
                <div className="space-y-2 text-inherit">
                  {certifications.map((cert, idx) => (
                    <div key={idx} className="text-xs text-inherit">
                      <h3 className="text-[10px] font-extrabold text-inherit">{cert.name}</h3>
                      <div className="text-[9px] font-bold opacity-70 text-inherit">{cert.issuer} {cert.issueDate ? `(${cert.issueDate})` : ''}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {languages && languages.length > 0 && (
              <div className="text-inherit">
                <h2 className={`text-xs font-extrabold uppercase tracking-widest ${accent.text} border-b border-slate-200 pb-1 mb-3`}>Languages</h2>
                <div className="space-y-1 text-inherit">
                  {languages.map((lang, idx) => (
                    <div key={idx} className="flex justify-between text-[10px] opacity-90 font-bold text-inherit">
                      <span>{lang.name}</span>
                      <span className="opacity-60 font-medium">{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {achievements && achievements.length > 0 && (
              <div className="text-inherit">
                <h2 className={`text-xs font-extrabold uppercase tracking-widest ${accent.text} border-b border-slate-200 pb-1 mb-3`}>Awards</h2>
                <div className="space-y-2 text-inherit">
                  {achievements.map((ach, idx) => (
                    <div key={idx} className="text-xs space-y-0.5 text-inherit">
                      <h3 className="text-[10px] font-extrabold text-inherit">{ach.title}</h3>
                      <p className="text-[9px] opacity-75 leading-relaxed text-inherit">{ach.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const MinimalTemplate: React.FC<TemplateProps> = ({ data, accent }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications } = data;
  const fullName = `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`.trim() || 'Your Name';

  return (
    <div className="bg-white p-10 max-w-[21cm] min-h-[29.7cm] flex flex-col justify-between text-left h-full border border-slate-100 shadow-md text-inherit">
      <div className="space-y-6 text-inherit">
        {/* Centered Minimal Header */}
        <div className="text-center space-y-2 mb-8 text-inherit">
          <h1 className="text-3xl font-normal tracking-wide uppercase text-inherit">{fullName}</h1>
          <p className={`text-xs font-bold ${accent.text} uppercase tracking-widest`}>{personalInfo.jobTitle || 'Target Job Title'}</p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] opacity-70 text-inherit">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.website && <span>{personalInfo.website}</span>}
          </div>
        </div>

        {summary && (
          <div className="space-y-2 text-inherit">
            <h2 className="text-xs font-bold uppercase tracking-widest opacity-90 border-b border-slate-200 pb-1 text-inherit">Summary</h2>
            <p className="text-xs leading-relaxed opacity-85 whitespace-pre-line text-inherit">{summary}</p>
          </div>
        )}

        {experience && experience.length > 0 && (
          <div className="space-y-3 text-inherit">
            <h2 className="text-xs font-bold uppercase tracking-widest opacity-90 border-b border-slate-200 pb-1 text-inherit">Experience</h2>
            <div className="space-y-4 text-inherit">
              {experience.map((exp, idx) => (
                <div key={idx} className="space-y-1 text-xs text-inherit">
                  <div className="flex justify-between items-baseline font-bold text-inherit">
                    <span>{exp.position}</span>
                    <span className="text-[10px] opacity-70 font-medium text-inherit">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-[10px] italic opacity-75 text-inherit">
                    <span>{exp.company} {exp.location ? `| ${exp.location}` : ''}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-80 whitespace-pre-line mt-1 text-inherit">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {education && education.length > 0 && (
          <div className="space-y-3 text-inherit">
            <h2 className="text-xs font-bold uppercase tracking-widest opacity-90 border-b border-slate-200 pb-1 text-inherit">Education</h2>
            <div className="space-y-3 text-inherit">
              {education.map((edu, idx) => (
                <div key={idx} className="space-y-0.5 text-xs text-inherit">
                  <div className="flex justify-between items-baseline font-bold text-inherit">
                    <span>{edu.degree} in {edu.fieldOfStudy}</span>
                    <span className="text-[10px] opacity-70 font-medium text-inherit">
                      {edu.startDate} – {edu.endDate}
                    </span>
                  </div>
                  <div className="text-[10px] italic opacity-75 text-inherit">{edu.school} {edu.location ? `| ${edu.location}` : ''}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills && skills.length > 0 && (
          <div className="space-y-3 text-inherit">
            <h2 className="text-xs font-bold uppercase tracking-widest opacity-90 border-b border-slate-200 pb-1 text-inherit">Skills</h2>
            <div className="flex flex-wrap gap-2 pt-1 text-inherit">
              {skills.map((skill, idx) => (
                <span key={idx} className="text-[10px] font-bold opacity-90 bg-slate-100 py-0.5 px-2.5 rounded-full border border-slate-200 text-inherit">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const TechTemplate: React.FC<TemplateProps> = ({ data, accent }) => {
  const { personalInfo, summary, experience, education, skills, projects } = data;
  const fullName = `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`.trim() || 'Your Name';

  return (
    <div className="bg-white p-8 max-w-[21cm] min-h-[29.7cm] flex flex-col justify-between text-left h-full border border-slate-100 shadow-md text-inherit">
      <div className="space-y-6 font-mono text-inherit">
        {/* Terminal Header */}
        <div className="bg-slate-900 text-slate-100 p-6 rounded-lg border border-slate-800 relative shadow-inner">
          <div className="absolute top-3 left-4 flex gap-1.5">
            <span className="w-2.5 h-2.5 bg-rose-500 rounded-full" />
            <span className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
          </div>
          <div className="text-center space-y-1 mt-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">{`$ cat profile.json`}</h1>
            <p className={`${accent.text} font-bold text-xs uppercase tracking-wider mt-1`}>{fullName} // {personalInfo.jobTitle || 'Developer'}</p>
            <div className="flex flex-wrap justify-center gap-x-4 text-[10px] text-slate-400 mt-2 font-mono">
              {personalInfo.email && <span>email: {personalInfo.email}</span>}
              {personalInfo.phone && <span>phone: {personalInfo.phone}</span>}
              {personalInfo.location && <span>loc: {personalInfo.location}</span>}
            </div>
          </div>
        </div>

        {summary && (
          <div className="space-y-2 text-inherit">
            <h2 className={`text-xs font-bold uppercase tracking-widest ${accent.text} border-b border-slate-300 pb-1`}># Profile Summary</h2>
            <p className="text-xs leading-relaxed opacity-90 whitespace-pre-line text-inherit">{summary}</p>
          </div>
        )}

        {skills && skills.length > 0 && (
          <div className="space-y-2 text-inherit">
            <h2 className={`text-xs font-bold uppercase tracking-widest ${accent.text} border-b border-slate-300 pb-1`}># Tech Stack</h2>
            <div className="flex flex-wrap gap-1.5 text-inherit">
              {skills.map((skill, idx) => (
                <span key={idx} className={`border ${accent.badge} text-[10px] font-bold px-2 py-0.5 rounded`}>
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {experience && experience.length > 0 && (
          <div className="space-y-3 text-inherit">
            <h2 className={`text-xs font-bold uppercase tracking-widest ${accent.text} border-b border-slate-300 pb-1`}># Employment History</h2>
            <div className="space-y-4 text-inherit">
              {experience.map((exp, idx) => (
                <div key={idx} className="space-y-1 text-xs text-inherit">
                  <div className="flex justify-between items-baseline font-bold text-inherit">
                    <span>{exp.position} @ {exp.company}</span>
                    <span className="text-[10px] opacity-70 text-inherit">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <p className="text-[10px] leading-relaxed opacity-85 whitespace-pre-line pl-4 border-l-2 border-pink-500/25 text-inherit">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {education && education.length > 0 && (
          <div className="space-y-3 text-inherit">
            <h2 className={`text-xs font-bold uppercase tracking-widest ${accent.text} border-b border-slate-300 pb-1`}># Academic Background</h2>
            <div className="space-y-3 text-inherit">
              {education.map((edu, idx) => (
                <div key={idx} className="space-y-0.5 text-xs text-inherit">
                  <div className="font-bold text-inherit">{edu.degree} - {edu.school}</div>
                  <div className="text-[10px] opacity-75 text-inherit">{edu.fieldOfStudy} ({edu.startDate} - {edu.endDate})</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const ElegantTemplate: React.FC<TemplateProps> = ({ data, accent }) => {
  const { personalInfo, summary, experience, education, skills, projects } = data;
  const fullName = `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`.trim() || 'Your Name';

  return (
    <div className="bg-[#fcfbf9] p-10 max-w-[21cm] min-h-[29.7cm] flex flex-col justify-between text-left h-full border border-[#e5e2db] shadow-md text-inherit">
      <div className="space-y-6 text-inherit">
        {/* Centered Classic Serif Header */}
        <div className="text-center space-y-1 mb-6 text-inherit">
          <h1 className="text-4xl font-normal tracking-wide text-inherit">{fullName}</h1>
          <p className={`text-xs italic ${accent.textDark || accent.text} tracking-wide mt-1`}>{personalInfo.jobTitle || 'Target Job Title'}</p>
          <hr className="border-[#d5cfc0] w-1/4 mx-auto my-3" />
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] opacity-80 text-inherit">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
        </div>

        {summary && (
          <div className="space-y-2 text-inherit">
            <h2 className={`text-xs font-bold uppercase tracking-widest ${accent.textDark || accent.text} border-b border-[#d5cfc0] pb-1`}>Summary</h2>
            <p className="text-xs leading-relaxed opacity-90 whitespace-pre-line text-inherit">{summary}</p>
          </div>
        )}

        {experience && experience.length > 0 && (
          <div className="space-y-3 text-inherit">
            <h2 className={`text-xs font-bold uppercase tracking-widest ${accent.textDark || accent.text} border-b border-[#d5cfc0] pb-1`}>Professional History</h2>
            <div className="space-y-4 text-inherit">
              {experience.map((exp, idx) => (
                <div key={idx} className="space-y-1 text-xs text-inherit">
                  <div className="flex justify-between items-baseline font-bold text-inherit">
                    <span className="text-xs tracking-tight">{exp.position}</span>
                    <span className="text-[10px] opacity-70 font-medium text-inherit">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-[10px] italic opacity-75 text-inherit">
                    <span>{exp.company}</span>
                    {exp.location && <span>{exp.location}</span>}
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-85 whitespace-pre-line mt-1 text-inherit">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {education && education.length > 0 && (
          <div className="space-y-3 text-inherit">
            <h2 className={`text-xs font-bold uppercase tracking-widest ${accent.textDark || accent.text} border-b border-[#d5cfc0] pb-1`}>Education</h2>
            <div className="space-y-3 text-inherit">
              {education.map((edu, idx) => (
                <div key={idx} className="space-y-0.5 text-xs text-inherit">
                  <div className="flex justify-between items-baseline font-bold text-inherit">
                    <span>{edu.degree} in {edu.fieldOfStudy}</span>
                    <span className="text-[10px] opacity-70 font-medium text-inherit">
                      {edu.startDate} – {edu.endDate}
                    </span>
                  </div>
                  <div className="text-[10px] italic opacity-75 text-inherit">{edu.school} {edu.location ? `| ${edu.location}` : ''}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface ResumeTemplateSelectorProps {
  id: string;
  data: Resume;
  fontStyle?: string;
  fontSize?: string;
  textColor?: string;
}

export const ResumeTemplateSelector: React.FC<ResumeTemplateSelectorProps> = ({ 
  id, data, fontStyle = 'sans', fontSize = 'md', textColor = 'plum' 
}) => {
  // Parse template structure and color preset
  // ID format: "layout-color" e.g., "modern-rose" (fallback to "modern-indigo")
  const parts = id.split('-');
  const layoutType = parts[0] || 'modern';
  const colorPreset = parts[1] || 'indigo';

  const accent = colorMap[colorPreset] || colorMap['indigo'];

  const fontClassMap: Record<string, string> = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono',
  };

  const sizeClassMap: Record<string, string> = {
    sm: 'text-[9px] md:text-[10px] [&_h1]:text-2xl [&_h2]:text-[10px] [&_h3]:text-[10px] [&_p]:text-[9px] [&_span]:text-[9px] [&_li]:text-[9px] [&_input]:text-xl',
    md: 'text-[10px] md:text-[11px] [&_h1]:text-3xl [&_h2]:text-[12px] [&_h3]:text-[11px] [&_p]:text-[10px] [&_span]:text-[10px] [&_li]:text-[10px] [&_input]:text-2xl',
    lg: 'text-[11px] md:text-[12px] [&_h1]:text-4xl [&_h2]:text-[14px] [&_h3]:text-[12px] [&_p]:text-[11px] [&_span]:text-[11px] [&_li]:text-[11px] [&_input]:text-3xl',
  };

  const textColorClassMap: Record<string, string> = {
    plum: 'text-[#2d1b24] [&_p]:text-[#47303d] [&_span]:text-[#5e4754] [&_h1]:text-[#2d1b24] [&_h2]:text-[#2d1b24] [&_h3]:text-[#2d1b24]',
    charcoal: 'text-[#1a1417] [&_p]:text-[#332b2e] [&_span]:text-[#4c4246] [&_h1]:text-[#1a1417] [&_h2]:text-[#1a1417] [&_h3]:text-[#1a1417]',
    slate: 'text-[#1e293b] [&_p]:text-[#334155] [&_span]:text-[#475569] [&_h1]:text-[#1e293b] [&_h2]:text-[#1e293b] [&_h3]:text-[#1e293b]',
    navy: 'text-[#0f172a] [&_p]:text-[#1e293b] [&_span]:text-[#334155] [&_h1]:text-[#0f172a] [&_h2]:text-[#0f172a] [&_h3]:text-[#0f172a]',
  };

  const fontClass = fontClassMap[fontStyle] || 'font-sans';
  const sizeClass = sizeClassMap[fontSize] || 'text-[10px] md:text-[11px]';
  const colorClass = textColorClassMap[textColor] || textColorClassMap['plum'];

  const renderTemplate = () => {
    switch (layoutType) {
      case 'minimal':
        return <MinimalTemplate data={data} accent={accent} />;
      case 'tech':
        return <TechTemplate data={data} accent={accent} />;
      case 'elegant':
        return <ElegantTemplate data={data} accent={accent} />;
      case 'modern':
      default:
        return <ModernTemplate data={data} accent={accent} />;
    }
  };

  return (
    <div className={`${fontClass} ${sizeClass} ${colorClass} h-full`}>
      {renderTemplate()}
    </div>
  );
};
