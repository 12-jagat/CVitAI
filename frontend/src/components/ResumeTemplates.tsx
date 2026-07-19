import React from 'react';
import { Resume } from '../types';

interface TemplateProps {
  data: Resume;
}

export const ModernTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, achievements } = data;
  const fullName = `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`.trim() || 'Your Name';

  return (
    <div className="bg-white text-slate-900 p-8 max-w-[21cm] min-h-[29.7cm] font-sans shadow-md border border-slate-100 flex flex-col justify-between">
      <div>
        {/* Header Section */}
        <div className="border-b-2 border-indigo-600 pb-6 mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 uppercase">{fullName}</h1>
          <p className="text-indigo-600 font-bold text-sm uppercase tracking-wider mt-1">{personalInfo.jobTitle || 'Target Job Title'}</p>
          
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500 mt-4">
            {personalInfo.email && <span>Email: {personalInfo.email}</span>}
            {personalInfo.phone && <span>Phone: {personalInfo.phone}</span>}
            {personalInfo.location && <span>Location: {personalInfo.location}</span>}
            {personalInfo.website && <span>Web: {personalInfo.website}</span>}
            {personalInfo.linkedin && <span>LinkedIn: {personalInfo.linkedin}</span>}
            {personalInfo.github && <span>GitHub: {personalInfo.github}</span>}
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-12 gap-8 text-left">
          {/* Main Panel */}
          <div className="col-span-8 space-y-6">
            {summary && (
              <div>
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 border-b border-slate-200 pb-1 mb-2">Professional Summary</h2>
                <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-line">{summary}</p>
              </div>
            )}

            {experience && experience.length > 0 && (
              <div>
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 border-b border-slate-200 pb-1 mb-3">Work History</h2>
                <div className="space-y-4">
                  {experience.map((exp, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-xs font-extrabold text-slate-900">{exp.position}</h3>
                        <span className="text-[10px] font-bold text-slate-500">
                          {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline text-[10px] font-semibold text-slate-600">
                        <span>{exp.company}</span>
                        {exp.location && <span>{exp.location}</span>}
                      </div>
                      <p className="text-[10px] leading-relaxed text-slate-600 whitespace-pre-line pl-2 border-l border-slate-200">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {projects && projects.length > 0 && (
              <div>
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 border-b border-slate-200 pb-1 mb-3">Key Projects</h2>
                <div className="space-y-4">
                  {projects.map((proj, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-xs font-extrabold text-slate-900">{proj.name}</h3>
                        {proj.startDate && (
                          <span className="text-[10px] font-bold text-slate-500">
                            {proj.startDate} {proj.endDate ? `– ${proj.endDate}` : ''}
                          </span>
                        )}
                      </div>
                      {proj.role && <div className="text-[10px] font-bold text-indigo-600">{proj.role}</div>}
                      <p className="text-[10px] leading-relaxed text-slate-600 whitespace-pre-line pl-2 border-l border-slate-200">
                        {proj.description}
                      </p>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="text-[9px] font-semibold text-slate-500 pt-1">
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
          <div className="col-span-4 space-y-6">
            {skills && skills.length > 0 && (
              <div>
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 border-b border-slate-200 pb-1 mb-3">Expertise</h2>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                      {skill.name} {skill.level ? `(${skill.level})` : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {education && education.length > 0 && (
              <div>
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 border-b border-slate-200 pb-1 mb-3">Education</h2>
                <div className="space-y-3">
                  {education.map((edu, idx) => (
                    <div key={idx} className="space-y-0.5 text-xs">
                      <h3 className="text-xs font-extrabold text-slate-900">{edu.degree}</h3>
                      <div className="text-[10px] font-bold text-slate-700">{edu.fieldOfStudy}</div>
                      <div className="text-[10px] font-semibold text-slate-500">{edu.school}</div>
                      <div className="text-[9px] font-bold text-slate-400">
                        {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                      </div>
                      {edu.gpa && <div className="text-[9px] font-bold text-slate-500">GPA: {edu.gpa}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {certifications && certifications.length > 0 && (
              <div>
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 border-b border-slate-200 pb-1 mb-3">Credentials</h2>
                <div className="space-y-2">
                  {certifications.map((cert, idx) => (
                    <div key={idx} className="text-xs">
                      <h3 className="text-[10px] font-extrabold text-slate-900">{cert.name}</h3>
                      <div className="text-[9px] font-bold text-slate-500">{cert.issuer} {cert.issueDate ? `(${cert.issueDate})` : ''}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {languages && languages.length > 0 && (
              <div>
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 border-b border-slate-200 pb-1 mb-3">Languages</h2>
                <div className="space-y-1">
                  {languages.map((lang, idx) => (
                    <div key={idx} className="flex justify-between text-[10px] text-slate-600 font-bold">
                      <span>{lang.name}</span>
                      <span className="text-slate-400 font-medium">{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {achievements && achievements.length > 0 && (
              <div>
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 border-b border-slate-200 pb-1 mb-3">Awards</h2>
                <div className="space-y-2">
                  {achievements.map((ach, idx) => (
                    <div key={idx} className="text-xs space-y-0.5">
                      <h3 className="text-[10px] font-extrabold text-slate-900">{ach.title}</h3>
                      <p className="text-[9px] text-slate-500 leading-relaxed">{ach.description}</p>
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

export const MinimalTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications } = data;
  const fullName = `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`.trim() || 'Your Name';

  return (
    <div className="bg-white text-slate-900 p-10 max-w-[21cm] min-h-[29.7cm] font-serif shadow-md border border-slate-100 flex flex-col justify-between text-left">
      <div className="space-y-6">
        {/* Centered Minimal Header */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-normal tracking-wide text-slate-900 uppercase">{fullName}</h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{personalInfo.jobTitle || 'Target Job Title'}</p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-slate-500 font-sans">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.website && <span>{personalInfo.website}</span>}
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          </div>
        </div>

        {summary && (
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-1 font-sans">Summary</h2>
            <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-line">{summary}</p>
          </div>
        )}

        {experience && experience.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-1 font-sans">Professional Experience</h2>
            <div className="space-y-4">
              {experience.map((exp, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between items-baseline font-sans font-bold text-slate-900">
                    <span>{exp.position} — <span className="font-medium text-slate-650">{exp.company}</span></span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.location && <div className="text-[10px] font-sans font-semibold text-slate-500">{exp.location}</div>}
                  <p className="text-[11px] leading-relaxed text-slate-650 whitespace-pre-line mt-1">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {education && education.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-1 font-sans">Education</h2>
            <div className="space-y-3">
              {education.map((edu, idx) => (
                <div key={idx} className="space-y-0.5 text-xs">
                  <div className="flex justify-between items-baseline font-sans font-bold text-slate-900">
                    <span>{edu.degree} in {edu.fieldOfStudy}</span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-[10px] font-sans text-slate-500">
                    <span>{edu.school} {edu.location ? `| ${edu.location}` : ''}</span>
                    {edu.gpa && <span>GPA: {edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills && skills.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-1 font-sans">Skills</h2>
            <div className="text-xs text-slate-700">
              <span className="font-bold font-sans text-[11px]">Core Proficiencies: </span>
              {skills.map((s) => s.name).join(', ')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const TechTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, projects } = data;
  const fullName = `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`.trim() || 'Your Name';

  return (
    <div className="bg-slate-50 text-slate-900 p-8 max-w-[21cm] min-h-[29.7cm] font-mono shadow-md border border-slate-200 flex flex-col justify-between text-left">
      <div className="space-y-6">
        {/* Terminal Style Header */}
        <div className="border border-slate-300 bg-white p-5 rounded-lg space-y-2">
          <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3 mb-2">
            <span className="w-2.5 h-2.5 bg-rose-450 rounded-full" />
            <span className="w-2.5 h-2.5 bg-amber-450 rounded-full" />
            <span className="w-2.5 h-2.5 bg-emerald-450 rounded-full" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-indigo-700">{`$ cat profile.json`}</h1>
          <div className="text-[11px] leading-relaxed text-slate-700 space-y-1">
            <div><span className="text-slate-400">"name":</span> "{fullName}",</div>
            <div><span className="text-slate-400">"role":</span> "{personalInfo.jobTitle || 'Developer'}",</div>
            <div>
              <span className="text-slate-400">"contact":</span> {'{'} 
              {personalInfo.email && ` "email": "${personalInfo.email}",`}
              {personalInfo.phone && ` "phone": "${personalInfo.phone}",`}
              {personalInfo.location && ` "location": "${personalInfo.location}" `}
              {'}'}
            </div>
            {personalInfo.github && <div><span className="text-slate-400">"github":</span> "{personalInfo.github}"</div>}
          </div>
        </div>

        {summary && (
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-700 border-b border-slate-300 pb-1"># Profile Summary</h2>
            <p className="text-[11px] leading-relaxed text-slate-700 whitespace-pre-line">{summary}</p>
          </div>
        )}

        {skills && skills.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-700 border-b border-slate-300 pb-1"># Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((s, idx) => (
                <span key={idx} className="bg-indigo-50 border border-indigo-250 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {experience && experience.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-700 border-b border-slate-300 pb-1"># Employment History</h2>
            <div className="space-y-4">
              {experience.map((exp, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-900">
                    <span>{`> ${exp.position} @ ${exp.company}`}</span>
                    <span className="text-slate-400">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <p className="text-[10px] leading-relaxed text-slate-650 whitespace-pre-line pl-4 border-l-2 border-indigo-500/25">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {education && education.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-700 border-b border-slate-300 pb-1"># Academic Background</h2>
            <div className="space-y-2">
              {education.map((edu, idx) => (
                <div key={idx} className="text-[11px] space-y-0.5">
                  <div className="flex justify-between text-[11px] font-bold text-slate-900">
                    <span>{edu.degree} in {edu.fieldOfStudy}</span>
                    <span className="text-slate-450">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <div className="text-[10px] text-slate-500">{edu.school}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const ElegantTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, projects } = data;
  const fullName = `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`.trim() || 'Your Name';

  return (
    <div className="bg-[#fcfbf9] text-[#1e1c18] p-10 max-w-[21cm] min-h-[29.7cm] font-serif shadow-md border border-[#e5e2db] flex flex-col justify-between text-left">
      <div className="space-y-6">
        {/* Centered Classic Serif Header */}
        <div className="text-center space-y-1 mb-6">
          <h1 className="text-4xl font-normal tracking-wide text-[#1e1c18]">{fullName}</h1>
          <p className="text-xs italic text-[#706450] tracking-wide mt-1">{personalInfo.jobTitle || 'Target Job Title'}</p>
          <hr className="border-[#d5cfc0] w-1/4 mx-auto my-3" />
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-[#554d3e] font-sans">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.website && <span>{personalInfo.website}</span>}
          </div>
        </div>

        {summary && (
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#706450] border-b border-[#d5cfc0] pb-1 font-sans">Summary</h2>
            <p className="text-xs leading-relaxed text-[#2c2822] whitespace-pre-line">{summary}</p>
          </div>
        )}

        {experience && experience.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#706450] border-b border-[#d5cfc0] pb-1 font-sans">Professional History</h2>
            <div className="space-y-4">
              {experience.map((exp, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between items-baseline font-bold text-[#1e1c18]">
                    <span className="text-xs font-sans tracking-tight">{exp.position}</span>
                    <span className="text-[10px] text-[#706450] font-sans font-medium">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-[10px] italic text-[#554d3e]">
                    <span>{exp.company}</span>
                    {exp.location && <span>{exp.location}</span>}
                  </div>
                  <p className="text-[11px] leading-relaxed text-[#2c2822] whitespace-pre-line mt-1">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {education && education.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#706450] border-b border-[#d5cfc0] pb-1 font-sans">Education</h2>
            <div className="space-y-3">
              {education.map((edu, idx) => (
                <div key={idx} className="space-y-0.5 text-xs">
                  <div className="flex justify-between items-baseline font-bold text-[#1e1c18]">
                    <span className="font-sans">{edu.degree} in {edu.fieldOfStudy}</span>
                    <span className="text-[10px] text-[#706450] font-sans font-medium">
                      {edu.startDate} – {edu.endDate}
                    </span>
                  </div>
                  <div className="text-[10px] italic text-[#554d3e]">{edu.school} {edu.location ? `| ${edu.location}` : ''}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const ResumeTemplateSelector: React.FC<{ id: string; data: Resume }> = ({ id, data }) => {
  switch (id) {
    case 'minimal':
      return <MinimalTemplate data={data} />;
    case 'tech':
      return <TechTemplate data={data} />;
    case 'elegant':
      return <ElegantTemplate data={data} />;
    case 'modern':
    default:
      return <ModernTemplate data={data} />;
  }
};
